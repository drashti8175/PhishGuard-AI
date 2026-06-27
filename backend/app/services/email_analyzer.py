import re
from typing import Dict, List, Tuple
from app.services.url_extractor import extract_url_features
from app.ml.predictor import predictor

# Keywords commonly deployed to generate false urgency or panic
URGENCY_KEYWORDS = [
    r"\bimmediate(ly)?\b", r"\bsuspended\b", r"\baction required\b", r"\b24 hours\b", 
    r"\bblock(ed)?\b", r"\bunauthorized\b", r"\bterminate(d)?\b", r"\bexpire(s)?\b",
    r"\bwarning\b", r"\bcritical\b", r"\bconsequences\b", r"\bcompromised\b",
    r"\bhurry\b", r"\brestrict(ed)?\b", r"\bdisable(d)?\b", r"\bclos(ed|ing)\b"
]

# Reward-baiting financial queries
REWARD_KEYWORDS = [
    r"\bwon\b", r"\blottery\b", r"\binheritance\b", r"\btransfer of\b", r"\bgift card\b", 
    r"\bcompensation\b", r"\bprize\b", r"\breward\b", r"\bclaim now\b", r"\bfree money\b",
    r"\bcash bonus\b", r"\bmillions\b", r"\bfree trial\b", r"\bexclusive offer\b"
]

# Sensitive credentials harvested during attacks
CREDENTIAL_KEYWORDS = [
    r"\bpassword\b", r"\bsecurity pin\b", r"\botp\b", r"\bcredit card\b", r"\bcvv\b",
    r"\blogin credentials\b", r"\bsecret phrase\b", r"\bkeyphrase\b", r"\bssn\b", r"\bsocial security\b"
]

def analyze_email_content(content: str) -> dict:
    content_lower = content.lower()
    
    # 1. NLP Count Extractor
    urgency_count = sum(len(re.findall(pat, content_lower)) for pat in URGENCY_KEYWORDS)
    reward_count = sum(len(re.findall(pat, content_lower)) for pat in REWARD_KEYWORDS)
    
    # 2. Harvesting indicators
    credential_harvesting = any(len(re.findall(pat, content_lower)) > 0 for pat in CREDENTIAL_KEYWORDS)
    
    # 3. Hyperlink Extraction
    url_pattern = r'https?://[^\s<>"]+|www\.[^\s<>"]+'
    raw_urls = re.findall(url_pattern, content)
    
    urls_found = []
    highest_url_risk = 0.0
    
    # Dedup and analyze
    for raw_url in list(set(raw_urls)):
        clean_url = raw_url.strip()
        # Remove trailing punctuations
        clean_url = re.sub(r'[.,;:!?)]+$', '', clean_url)
        
        try:
            features = extract_url_features(clean_url)
            prob, label = predictor.predict(features)
            risk_score = round(prob * 100, 1)
            highest_url_risk = max(highest_url_risk, risk_score)
            
            urls_found.append({
                "url": clean_url,
                "prediction": label,
                "risk_score": risk_score
            })
        except Exception:
            continue
            
    # Calculate heuristic score for the text context
    text_risk = 0.0
    text_risk += min(45.0, urgency_count * 15.0)  # Capped at 45%
    text_risk += min(45.0, reward_count * 15.0)   # Capped at 45%
    if credential_harvesting:
        text_risk += 25.0
        
    text_risk = min(100.0, text_risk)
    
    # Overall risk takes the highest threat present: text or link
    overall_risk = max(text_risk, highest_url_risk)
    
    # Generate human explanations
    reasons = []
    if urgency_count > 0:
        reasons.append(f"Identified {urgency_count} threat-urgency flags (e.g. immediate, suspended, restrict).")
    if reward_count > 0:
        reasons.append(f"Found {reward_count} reward-baiting patterns promising financial compensation or cash prizes.")
    if credential_harvesting:
        reasons.append("Identified sensitive credential requests requesting critical assets (OTP, password, credit card).")
    if len(urls_found) > 0:
        reasons.append(f"Analyzed {len(urls_found)} embedded links found in body.")
        
    # Specific warnings for high risk links
    phishing_urls_count = sum(1 for u in urls_found if u["prediction"] == "Phishing")
    if phishing_urls_count > 0:
        reasons.append(f"CRITICAL WARNING: Found {phishing_urls_count} malicious phishing URL(s) embedded in the message body.")
        
    prediction = "Phishing" if overall_risk >= 50.0 else "Safe"
    
    if not reasons:
        reasons.append("Email text content falls within clean standards with zero phishing lexical indicators.")
        
    return {
        "content_preview": content[:120] + ("..." if len(content) > 120 else ""),
        "prediction": prediction,
        "risk_score": round(overall_risk, 1),
        "urgency_count": urgency_count,
        "reward_count": reward_count,
        "credential_harvesting": credential_harvesting,
        "reasons": reasons,
        "urls_found": urls_found
    }
