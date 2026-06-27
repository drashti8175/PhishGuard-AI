from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any

class URLScanRequest(BaseModel):
    url: str

class URLScanResponse(BaseModel):
    id: Optional[str] = None
    url: str
    prediction: str
    risk_score: float  # Percentage score (e.g. 91.5)
    reasons: List[str]
    features: Dict[str, float]
    created_at: datetime

class EmailScanRequest(BaseModel):
    content: str

class EmailScanResponse(BaseModel):
    id: Optional[str] = None
    content_preview: str
    prediction: str
    risk_score: float
    urgency_count: int
    reward_count: int
    credential_harvesting: bool
    reasons: List[str]
    urls_found: List[Dict[str, Any]]
    created_at: datetime

class QRScanResponse(BaseModel):
    id: Optional[str] = None
    decoded_text: str
    is_url: bool
    url_analysis: Optional[URLScanResponse] = None
    created_at: datetime
