from fastapi import APIRouter, Depends, HTTPException, status
from app.services.auth import get_current_user
from app.database import get_users_collection, get_scans_collection
from app.models.user import UserResponse
from typing import List

router = APIRouter(prefix="/api/admin", tags=["admin"])

async def get_admin_user(current_user: dict = Depends(get_current_user)):
    """Dependency to ensure the current user has admin privileges."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can access this resource."
        )
    return current_user


@router.get("/users", response_model=List[UserResponse])
async def get_all_users(admin_user: dict = Depends(get_admin_user)):
    """Module 10: Admin - View all registered users."""
    users_col = get_users_collection()
    users = await users_col.find().to_list(length=1000) # Limit for practical purposes
    
    for user in users:
        user["id"] = str(user["_id"])
        del user["_id"]
    return users

@router.get("/scans")
async def get_all_scans(admin_user: dict = Depends(get_admin_user)):
    """Module 10: Admin - View all scans performed on the platform."""
    scans_col = get_scans_collection()
    scans = await scans_col.find().to_list(length=1000) # Limit for practical purposes
    
    for scan in scans:
        scan["id"] = str(scan["_id"])
        del scan["_id"]
    return scans
