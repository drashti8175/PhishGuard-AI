import os
import re
from urllib.parse import quote_plus
from dotenv import load_dotenv

# Load environmental variables from .env file
load_dotenv()

def get_mongodb_uri():
    uri = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI")
    if not uri:
        return "mongodb://localhost:27017/phishguard"
    
    # Auto-encode special characters in password if present
    if uri.startswith("mongodb"):
        scheme_match = re.match(r"^(mongodb(?:\+srv)?://)(.*)$", uri)
        if scheme_match:
            scheme, rest = scheme_match.groups()
            # Find host separator (first '/' or '?')
            separator_idx = len(rest)
            for c in ['/', '?']:
                idx = rest.find(c)
                if idx != -1 and idx < separator_idx:
                    separator_idx = idx
            
            cred_part = rest[:separator_idx]
            host_part = rest[separator_idx:]
            
            # Find last '@' in credentials
            at_idx = cred_part.rfind("@")
            if at_idx != -1:
                user_pass = cred_part[:at_idx]
                host = cred_part[at_idx+1:]
                
                # Split user and password
                colon_idx = user_pass.find(":")
                if colon_idx != -1:
                    username = user_pass[:colon_idx]
                    password = user_pass[colon_idx+1:]
                    
                    # If password contains special characters and is not already URL encoded
                    if "@" in password or ":" in password or " " in password or "@" in username:
                        encoded_password = quote_plus(password)
                        encoded_username = quote_plus(username)
                        return f"{scheme}{encoded_username}:{encoded_password}@{host}{host_part}"
    return uri

class Settings:
    MONGO_URI: str = get_mongodb_uri()
    JWT_SECRET: str = os.getenv("JWT_SECRET", "phishguard_secure_jwt_secret_key_2026_safe")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")) # Default 24 hours
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")

settings = Settings()

