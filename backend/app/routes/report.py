from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from app.services.auth import get_current_user
from app.database import get_scans_collection
from app.services.pdf_generator import generate_scan_pdf
from bson import ObjectId

router = APIRouter(prefix="/api/report", tags=["reports"])

@router.get("/download/{scan_id}")
async def download_scan_report(scan_id: str, current_user: dict = Depends(get_current_user)):
    """
    Finds a scan record in the ledger matching the scan_id owned by the current logged-in user,
    generates a custom ReportLab PDF, and returns a binary StreamingResponse for immediate download.
    """
    scans_col = get_scans_collection()
    
    # 1. Fetch scan and verify user access
    try:
        scan = await scans_col.find_one({"_id": ObjectId(scan_id), "user_id": current_user["id"]})
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid security ledger ID format."
        )
        
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Security record not found, or you do not have permission to view it."
        )
        
    # Map database ObjectId
    scan["id"] = str(scan["_id"])
    
    # 2. Construct PDF file buffer stream
    pdf_buffer = generate_scan_pdf(scan)
    
    # 3. Formulate attachment filename
    filename = f"phishguard_audit_{scan_id}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
