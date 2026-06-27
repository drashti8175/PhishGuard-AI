import re
from urllib.parse import urlparse

# Shortening service list
SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "rebrand.ly", "is.gd", "buff.ly", "adf.ly", "bit.do",
    "lnkd.in", "db.tt", "qr.ae", "goo.gl", "ow.ly", "w.sharethis.com", "merky.de", "short.io"
}

# Suspicious keywords indicating high-probability credential harvesting campaigns
SUSPICIOUS_KEYWORDS = [
    "secure", "login", "verify", "update", "banking", "account", 
    "paypal", "wallet", "signin", "support", "billing", "confirm", 
    "security", "recover", "authenticate", "reset-password"
]

def extract_url_features(url: str) -> dict:
    raw_url = url
    
    # Pre-parse: Standardize protocol prefix
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
        
    try:
        parsed = urlparse(url)
        domain = parsed.netloc or parsed.path.split("/")[0]
        path = parsed.path
        query = parsed.query
    except Exception:
        # Fallback parsing in case of highly deformed inputs
        domain = url.split("/")[2] if len(url.split("/")) > 2 else url
        path = ""
        query = ""
        parsed = None

    # 1. URL Length
    url_length = len(raw_url)
    
    # 2. Number of dots
    num_dots = raw_url.count(".")
    
    # 3. HTTPS flag
    is_https = 1 if url.startswith("https://") else 0
    
    # 4. Has IP representation as Host
    ip_pattern = r"^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$"
    has_ip = 1 if re.match(ip_pattern, domain) else 0
    
    # 5. Is Shortened URL
    clean_domain = domain.lower().replace("www.", "")
    is_shortened = 1 if clean_domain in SHORTENERS else 0
    
    # 6. Number of ATS (@)
    num_ats = raw_url.count("@")
    
    # 7. Number of Dashes (-)
    num_dashes = raw_url.count("-")
    
    # 8. Suspicious Keywords
    url_lower = raw_url.lower()
    has_suspicious_keywords = 1 if any(kw in url_lower for kw in SUSPICIOUS_KEYWORDS) else 0
    
    # 9. Prefix/Suffix (Dash in domain)
    prefix_suffix = 1 if "-" in domain else 0
    
    # 10. Path Depth
    path_depth = path.count("/") if path else 0
    
    # 11. Number of Subdomains
    domain_parts = clean_domain.split(".")
    num_subdomains = max(0, len(domain_parts) - 2)
    
    # 12. Has Unicode (IDN Homograph check)
    try:
        raw_url.encode('ascii')
        has_unicode = 0
    except UnicodeEncodeError:
        has_unicode = 1
        
    # 13. Number of Digits
    num_digits = sum(c.isdigit() for c in raw_url)
    
    # 14. Number of Queries
    num_queries = len(query.split("&")) if query else 0
    
    # 15. Has Redirection (double slash inside path)
    has_redirection = 1 if "//" in path else 0
    
    # 16. Number of Percentages (%)
    num_percentage = raw_url.count("%")
    
    return {
        "url_length": url_length,
        "num_dots": num_dots,
        "is_https": is_https,
        "has_ip": has_ip,
        "is_shortened": is_shortened,
        "num_ats": num_ats,
        "num_dashes": num_dashes,
        "has_suspicious_keywords": has_suspicious_keywords,
        "prefix_suffix": prefix_suffix,
        "path_depth": path_depth,
        "num_subdomains": num_subdomains,
        "has_unicode": has_unicode,
        "num_digits": num_digits,
        "num_queries": num_queries,
        "has_redirection": has_redirection,
        "num_percentage": num_percentage
    }
