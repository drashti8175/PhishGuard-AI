import re
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.database import get_scans_collection
from app.models.scan import URLScanRequest, URLScanResponse, EmailScanRequest, EmailScanResponse, QRScanResponse
from app.services.url_extractor import extract_url_features
from app.ml.predictor import predictor
from app.services.auth import get_current_user
from app.services.email_analyzer import analyze_email_content
from app.services.qr_scanner import decode_qr_image

security = HTTPBearer(auto_error=False)

async def get_optional_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[dict]:
    """
    Decodes the JWT token if present, returns None if anonymous user,
    preventing 401 unauthenticated errors on public landing pages.
    """
    if not credentials:
        return None
    try:
        return await get_current_user(credentials.credentials)
    except HTTPException:
        return None
    except Exception:
        return None

router = APIRouter(prefix="/api/scan", tags=["scans"])

def generate_url_explanations(url: str, features: dict, label: str) -> List[str]:
    """
    Synthesizes exact security indicators mapping the features to human-readable logs.
    """
    reasons = []
    
    if label == "Phishing":
        if features["is_https"] == 0:
            reasons.append("The website does not use the secure HTTPS protocol (transmits credentials in plaintext).")
        if features["url_length"] > 75:
            reasons.append(f"The URL is unusually long ({features['url_length']} characters), which is a common brand-masking obfuscation.")
        if features["num_dots"] > 3:
            reasons.append(f"Excessive dot count ({features['num_dots']}) suggests deceptive subdomain routing configurations.")
        if features["has_ip"] == 1:
            reasons.append("URL maps directly to a raw IP host, completely bypassing standard DNS security checks.")
        if features["is_shortened"] == 1:
            reasons.append("Link is masked using a known URL shortening proxy, hiding final redirects.")
        if features["has_suspicious_keywords"] == 1:
            reasons.append("URL path contains sensitive credentials or panic terms (login, verify, banking).")
        if features["prefix_suffix"] == 1:
            reasons.append("Primary domain name utilizes hyphens (-) to mimic official portals (brand spoofing).")
        if features["num_subdomains"] >= 2:
            reasons.append(f"Contains multiple subdomains ({features['num_subdomains']}), standard in phishing redirection grids.")
        if features["has_unicode"] == 1:
            reasons.append("Detects Internationalized Domain Name Unicode mappings, indicative of IDN Homograph spoofing.")
        if features["has_redirection"] == 1:
            reasons.append("URL path contains high risk inline redirection characters (// in path).")
        if features["num_percentage"] > 2:
            reasons.append("Dense concentration of URL encoding characters (%), typical of hidden parameters.")
            
        # Self-healing checklist fallback
        if not reasons:
            reasons.append("AI classifier matched this link's architectural traits with known phishing campaign structures.")
    else:
        if features["is_https"] == 1:
            reasons.append("Uses standard, secure SSL/TLS HTTPS encryption.")
        if features["url_length"] < 60:
            reasons.append("Short and concise URL path, presenting standard structural parameters.")
        if features["num_dots"] <= 2:
            reasons.append("Normal level of domain nesting.")
        if features["has_suspicious_keywords"] == 0:
            reasons.append("No sensitive phishing or credential keywords identified in the string.")
            
    return reasons

def perform_url_analysis(url: str):
    """
    Encapsulates the core URL analysis logic to be reused across URL and QR endpoints.
    """
    features = extract_url_features(url)
    prob, label = predictor.predict(features)
    risk_score = round(prob * 100, 1)
    reasons = generate_url_explanations(url, features, label)
    
    return {
        "prediction": label,
        "risk_score": risk_score,
        "reasons": reasons,
        "features": features
    }

@router.post("/url", response_model=URLScanResponse)
async def scan_url(request: URLScanRequest, current_user: Optional[dict] = Depends(get_optional_user)):
    url = request.url.strip()
    analysis = perform_url_analysis(url)
    
    # 4. Persistence into MongoDB
    scans_col = get_scans_collection()
    scan_doc = {
        "url": url,
        "type": "url",
        **analysis,
        "created_at": datetime.now(timezone.utc),
        "user_id": current_user["id"] if current_user else None
    }
    
    result = await scans_col.insert_one(scan_doc)
    scan_doc["id"] = str(result.inserted_id)
    
    return scan_doc

@router.post("/email", response_model=EmailScanResponse)
async def scan_email(request: EmailScanRequest, current_user: Optional[dict] = Depends(get_optional_user)):
    content = request.content
    
    # 1. NLP Content Parsing
    analysis = analyze_email_content(content)
    
    # 2. Database Log Storage
    scans_col = get_scans_collection()
    scan_doc = {
        "content_preview": analysis["content_preview"],
        "content_full": content,
        "type": "email",
        "prediction": analysis["prediction"],
        "risk_score": analysis["risk_score"],
        "urgency_count": analysis["urgency_count"],
        "reward_count": analysis["reward_count"],
        "credential_harvesting": analysis["credential_harvesting"],
        "reasons": analysis["reasons"],
        "urls_found": analysis["urls_found"],
        "created_at": datetime.now(timezone.utc),
        "user_id": current_user["id"] if current_user else None
    }
    
    result = await scans_col.insert_one(scan_doc)
    scan_doc["id"] = str(result.inserted_id)
    
    return scan_doc

@router.post("/qr", response_model=QRScanResponse)
async def scan_qr(file: UploadFile = File(...), current_user: Optional[dict] = Depends(get_optional_user)):
    # Read image buffer bytes
    image_bytes = await file.read()
    
    # Run OpenCV-supported decode service
    try:
        decoded_text = decode_qr_image(image_bytes)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        
    is_url = False
    url_analysis = None
    
    # Generic domain validation regex
    url_pattern = r'^(https?://)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(/[a-zA-Z0-9-._~:/?#\[\]@!$&\'()*+,;=]*)?$'
    if decoded_text.startswith(("http://", "https://", "www.")) or re.match(url_pattern, decoded_text):
        is_url = True
        
        # Standardize prefix protocol
        url_to_analyze = decoded_text
        if not url_to_analyze.startswith(("http://", "https://")):
            url_to_analyze = "https://" + url_to_analyze
            
        # Run features and classifier
        analysis = perform_url_analysis(url_to_analyze)
        url_analysis = {
            "url": decoded_text,
            **analysis,
            "created_at": datetime.now(timezone.utc)
        }
        
    scans_col = get_scans_collection()
    scan_doc = {
        "decoded_text": decoded_text,
        "is_url": is_url,
        "type": "qr",
        "url_analysis": url_analysis,
        "prediction": url_analysis["prediction"] if (is_url and url_analysis) else "Safe",
        "risk_score": url_analysis["risk_score"] if (is_url and url_analysis) else 0.0,
        "created_at": datetime.now(timezone.utc),
        "user_id": current_user["id"] if current_user else None
    }
    
    result = await scans_col.insert_one(scan_doc)
    scan_doc["id"] = str(result.inserted_id)
    
    return scan_doc
