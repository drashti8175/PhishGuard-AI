from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.database import get_users_collection
from app.models.user import UserRegister, UserLogin, UserResponse, Token
from app.services.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserRegister):
    users_col = get_users_collection()
    
    # Standard check for email unique constraint
    existing_user = await users_col.find_one({"email": user_in.email})
    if existing_user:
        # Return existing user info matching UserResponse model
        existing_user["id"] = str(existing_user["_id"])
        # Convert ObjectId and keep required fields
        response_user = {
            "id": existing_user["id"],
            "name": existing_user.get("name"),
            "email": existing_user.get("email"),
            "created_at": existing_user.get("created_at"),
            "last_login": existing_user.get("last_login"),
        }
        return response_user
    # Document storage structure for new user
    new_user = {
        "name": user_in.name,
        "email": user_in.email,
        "password_hash": hash_password(user_in.password),
        "created_at": datetime.now(timezone.utc),
        "last_login": None,
        "role": "user"
    }
    result = await users_col.insert_one(new_user)
    # Build response matching UserResponse model
    response_user = {
        "id": str(result.inserted_id),
        "name": new_user["name"],
        "email": new_user["email"],
        "created_at": new_user["created_at"],
        "last_login": None
    }
    return response_user
    


@router.post("/login", response_model=Token)
async def login(user_in: UserLogin):
    users_col = get_users_collection()
    user = await users_col.find_one({"email": user_in.email})
    
    if not user or not verify_password(user_in.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Log session timestamp
    now = datetime.now(timezone.utc)
    await users_col.update_one({"_id": user["_id"]}, {"$set": {"last_login": now}})
    
    user["id"] = str(user["_id"])
    user["last_login"] = now
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/token", response_model=Token)
async def login_oauth2(form_data: OAuth2PasswordRequestForm = Depends()):
    users_col = get_users_collection()
    user = await users_col.find_one({"email": form_data.username})
    
    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    now = datetime.now(timezone.utc)
    await users_col.update_one({"_id": user["_id"]}, {"$set": {"last_login": now}})
    
    user["id"] = str(user["_id"])
    user["last_login"] = now
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
