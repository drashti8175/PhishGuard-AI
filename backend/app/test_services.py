import pytest
from app.services.url_extractor import extract_url_features
from app.services.email_analyzer import analyze_email_content

def test_url_extractor_standard_safe():
    """
    Asserts structural parameters extracted from a standard safe URL match expected states.
    """
    url = "https://www.google.com"
    features = extract_url_features(url)
    
    assert features["is_https"] == 1
    assert features["has_ip"] == 0
    assert features["is_shortened"] == 0
    assert features["num_dots"] >= 2  # www.google.com has 2 dots
    assert features["has_suspicious_keywords"] == 0
    assert features["prefix_suffix"] == 0

def test_url_extractor_malicious_anomaly():
    """
    Asserts flags raised by malicious indicators are captured correctly (IP address host, lack of SSL, suspicious words).
    """
    url = "http://192.168.1.1/secure-login-verify-account"
    features = extract_url_features(url)
    
    assert features["is_https"] == 0
    assert features["has_ip"] == 1
    assert features["has_suspicious_keywords"] == 1
    assert features["path_depth"] >= 1

def test_email_analyzer_secure():
    """
    Asserts standard communications register safe scores.
    """
    text = "Hello Drashti, hope you are doing well. Please find attached the meeting notes from yesterday's presentation."
    analysis = analyze_email_content(text)
    
    assert analysis["prediction"] == "Safe"
    assert analysis["risk_score"] < 20.0
    assert analysis["urgency_count"] == 0
    assert analysis["reward_count"] == 0
    assert analysis["credential_harvesting"] is False

def test_email_analyzer_phishing():
    """
    Asserts phishing emails trigger critical warning scores and flags.
    """
    text = "URGENT ACTION REQUIRED! Your banking account has been compromised. Verify your identity or we will suspend your card details immediately: http://bank-secure-restore.net"
    analysis = analyze_email_content(text)
    
    assert analysis["prediction"] == "Phishing"
    assert analysis["risk_score"] >= 65.0
    assert analysis["urgency_count"] >= 2
    assert analysis["credential_harvesting"] is True
    assert len(analysis["urls_found"]) == 1
