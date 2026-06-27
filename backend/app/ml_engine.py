import re

def extract_url_features(url: str):
    """
    Advanced Heuristic analysis of a URL to detect potential phishing.
    """
    is_https = url.startswith("https")
    url_len = len(url)
    num_dots = url.count('.')
    has_at_symbol = "@" in url
    has_ip = 1 if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url) else 0
    
    suspicious_keywords = ['login', 'verify', 'secure', 'update', 'banking', 'account', 'signin']
    found_keywords = [word for word in suspicious_keywords if word in url.lower()]
    
    risk_score = 0
    reasons = []
    
    if not is_https:
        risk_score += 40
        reasons.append("The connection is not secure (HTTP). Legitimate services always use HTTPS.")
    
    if url_len > 75:
        risk_score += 25
        reasons.append("The URL is unusually long, which is a common tactic to hide the real domain.")

    if num_dots > 3:
        risk_score += 15
        reasons.append(f"Found {num_dots} dots. Too many subdomains are often used in malicious redirects.")

    if has_ip:
        risk_score += 50
        reasons.append("The URL uses an IP address instead of a domain name. This is a high-risk indicator.")

    if has_at_symbol:
        risk_score += 30
        reasons.append("The URL contains an '@' symbol, which can be used to deceive the browser about the actual destination.")

    if found_keywords:
        risk_score += 20
        reasons.append(f"Suspicious keywords detected: {', '.join(found_keywords)}.")

    prediction = "Phishing" if risk_score >= 55 else ("Suspicious" if risk_score >= 30 else "Safe")
    
    return {
        "url": url,
        "prediction": prediction,
        "risk_score": risk_score,
        "reasons": reasons,
        "details": {
            "url_length": url_len,
            "is_https": is_https,
            "dot_count": num_dots,
            "has_ip": bool(has_ip)
        }
    }