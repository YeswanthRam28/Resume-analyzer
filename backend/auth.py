import os
from fastapi import Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWKClient

# Initialize HTTP Bearer
security = HTTPBearer()

# The frontend passes the token. Clerk tokens are signed by your Clerk instance.
# We fetch the JWKS to verify them.

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    CLERK_ISSUER = os.getenv("CLERK_ISSUER_URL", "https://happy-bear-99.clerk.accounts.dev")
    token = credentials.credentials
    if not CLERK_ISSUER:
        # For development if issuer isn't set, return a mock user or fail
        return "mock_user_id"
        
    try:
        jwks_client = PyJWKClient(f"{CLERK_ISSUER}/.well-known/jwks.json")
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        data = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_aud": False, "verify_iss": False},
            leeway=60
        )
        return data.get("sub") # The clerk user ID
    except Exception as e:
        print(f"Auth error: {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication token")
