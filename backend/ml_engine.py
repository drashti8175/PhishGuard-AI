import re
from urllib.parse import urlparse

def extract_url_features(url: str):
    """
    Extracts features for the ML model as defined in Module 2 & 3.
    """
    hostname = urlparse(url).netloc
    path = urlparse(url).path
    
    # Feature 1: URL Length
    url_length = len(url)
    
    # Feature 2: Number of dots in hostname
    num_dots = hostname.count('.')
    
    # Feature 3: HTTPS usage
    is_https = 1 if url.startswith('https') else 0
    
    # Feature 4: Prefix/Suffix (Hyphens in domain)
    prefix_suffix = 1 if '-' in hostname else 0
    
    # Feature 5: Suspicious Keywords
    suspicious_words = ['login', 'verify', 'bank', 'secure', 'update', 'account', 'sbi', 'amazon']
    has_suspicious_keywords = 1 if any(word in url.lower() for word in suspicious_words) else 0

    # Feature 6: IP Address usage
    has_ip = 1 if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', hostname) else 0

    # Logic for a simple heuristic risk score (Phase 2) 
    # This can be replaced by model.predict() in Phase 3
    risk_score = 0
    reasons = []

    if not is_https:
        risk_score += 30
        reasons.append("Missing HTTPS certificate")
    if url_length > 75:
        risk_score += 20
        reasons.append("Unusually long URL")
    if num_dots > 3:
        risk_score += 20
        reasons.append("Multiple subdomains detected")
    if has_ip:
        risk_score += 30
        reasons.append("URL contains raw IP address")
    if has_suspicious_keywords:
        risk_score += 20
        reasons.append("Contains suspicious security-related keywords")
    
    risk_score = min(risk_score, 100)
    prediction = "Phishing" if risk_score > 50 else "Safe"

    return {
        "url": url,
        "prediction": prediction,
        "risk_score": risk_score,
        "reasons": reasons,
        "details": {
            "hostname": hostname,
            "dots": num_dots,
            "https": bool(is_https),
            "length": url_length
        }
    }