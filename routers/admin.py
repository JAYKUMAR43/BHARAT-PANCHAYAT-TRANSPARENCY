from fastapi import APIRouter, HTTPException, Depends
from database import SessionLocal
from models import Admin, Project
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel
from datetime import datetime, timedelta

# Config -- in a real app these should be in env vars
SECRET_KEY = "CHANGE_THIS_SECRET_FOR_PRODUCTION"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60*24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter(prefix="/admin", tags=["admin"])

class AdminCreate(BaseModel):
    email: str
    password: str
    name: str = None

class AdminLogin(BaseModel):
    email: str
    password: str

def verify_password(plain_password, hashed):
    return pwd_context.verify(plain_password, hashed)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/create")
def create_admin(payload: AdminCreate):
    db = SessionLocal()
    existing = db.query(Admin).filter(Admin.email == payload.email).first()
    if existing:
        db.close()
        raise HTTPException(status_code=400, detail="Admin exists")
    admin = Admin(email=payload.email, name=payload.name, hashed_password=get_password_hash(payload.password))
    db.add(admin); db.commit(); db.refresh(admin); db.close()
    return {"message": "admin created", "email": admin.email}

@router.post("/login")
def login(payload: AdminLogin):
    db = SessionLocal()
    admin = db.query(Admin).filter(Admin.email == payload.email).first()
    if not admin or not verify_password(payload.password, admin.hashed_password):
        db.close()
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token({"sub": admin.email}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    db.close()
    return {"access_token": access_token, "token_type": "bearer"}

def get_current_admin(token: str = Depends(lambda: None)):
    # In your real FastAPI you should use OAuth2PasswordBearer and dependency here.
    # For simplicity, this helper will be used by admin endpoints if integrated properly in the frontend (pass token in headers).
    raise NotImplementedError("Use OAuth2PasswordBearer in real app")
