from fastapi import APIRouter, Depends
from app.services.auth import get_current_user
from app.database import get_scans_collection
from datetime import datetime, timedelta, timezone

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    scans_col = get_scans_collection()
    user_id = current_user["id"]
    
    # 1. Retrieve aggregated scanning metrics
    total_scans = await scans_col.count_documents({"user_id": user_id})
    threats_detected = await scans_col.count_documents({"user_id": user_id, "prediction": "Phishing"})
    safe_scans = total_scans - threats_detected
    
    url_scans = await scans_col.count_documents({"user_id": user_id, "type": "url"})
    email_scans = await scans_col.count_documents({"user_id": user_id, "type": "email"})
    qr_scans = await scans_col.count_documents({"user_id": user_id, "type": "qr"})
    
    # 2. Score distribution mapping (perfect for Doughnut charting)
    # Low: < 25%, Medium: 25-50%, High: 50-75%, Critical: >= 75%
    low_risk = await scans_col.count_documents({"user_id": user_id, "risk_score": {"$lt": 25.0}})
    medium_risk = await scans_col.count_documents({"user_id": user_id, "risk_score": {"$gte": 25.0, "$lt": 50.0}})
    high_risk = await scans_col.count_documents({"user_id": user_id, "risk_score": {"$gte": 50.0, "$lt": 75.0}})
    critical_risk = await scans_col.count_documents({"user_id": user_id, "risk_score": {"$gte": 75.0}})
    
    # 3. Weekly scanning volume trends (last 7 days line series)
    activity = []
    today = datetime.now(timezone.utc).date()
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        start_datetime = datetime.combine(day, datetime.min.time())
        end_datetime = datetime.combine(day, datetime.max.time())
        
        day_scans = await scans_col.count_documents({
            "user_id": user_id,
            "created_at": {"$gte": start_datetime, "$lte": end_datetime}
        })
        
        activity.append({
            "date": day.strftime("%b %d"),
            "count": day_scans
        })
        
    return {
        "summary": {
            "total": total_scans,
            "threats": threats_detected,
            "safe": safe_scans,
            "url_count": url_scans,
            "email_count": email_scans,
            "qr_count": qr_scans
        },
        "risk_distribution": {
            "low": low_risk,
            "medium": medium_risk,
            "high": high_risk,
            "critical": critical_risk
        },
        "activity": activity
    }

@router.get("/history")

async def get_scan_history(current_user: dict = Depends(get_current_user)):
    scans_col = get_scans_collection()
    user_id = current_user["id"]
    
    # Fetch top 50 scans chronologically
    cursor = scans_col.find({"user_id": user_id}).sort("created_at", -1).limit(50)
    scans = await cursor.to_list(length=50)
    
    # Sanitize MongoDB internal object references for JSON output
    for scan in scans:
        scan["id"] = str(scan["_id"])
        del scan["_id"]
        
    return scans
