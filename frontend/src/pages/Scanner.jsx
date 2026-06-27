import React, { useState } from 'react';
import API from '../utils/api';

const Scanner = () => {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleScan = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await API.get(`/scan?url=${encodeURIComponent(url)}`);
            setResult(response.data);
        } catch (error) {
            console.error("Scan failed", error);
            alert("Error connecting to security engines.");
        }
        setLoading(false);
    };

    return (
        <div className="scanner-container">
            <h2>🔍 Security Scanner</h2>
            <p>Scan URLs, domains, and file hashes in real-time with 70+ security engines.</p>

            <form onSubmit={handleScan} className="scan-form">
                <input
                    type="text"
                    placeholder="Enter URL (e.g., https://example.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Analyzing...' : 'Scan Now'}
                </button>
            </form>

            {result && (
                <div className={`result-box ${result.prediction.toLowerCase()}`}>
                    <h3>Analysis Result: {result.prediction}</h3>
                    <p>Risk Score: {result.risk_score}/100</p>
                    <div className="features">
                        <span>HTTPS: {result.features.is_https ? '✅' : '❌'}</span>
                        <span>Suspicious Keywords: {result.features.has_suspicious_keywords ? '🚩' : 'None'}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Scanner;