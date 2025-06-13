from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import httpx
from typing import List

from . import database_models, api_schemas, auth_service
from .db_config import engine, get_db

database_models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Seed data from JSONPlaceholder
async def seed_data(db: Session):
    async with httpx.AsyncClient() as client:
        response = await client.get("https://jsonplaceholder.typicode.com/users")
        users_data = response.json()
        
        for user_data in users_data:
            # Create LocationCoordinates
            geo = database_models.LocationCoordinates(
                lat=user_data["address"]["geo"]["lat"],
                lng=user_data["address"]["geo"]["lng"]
            )
            
            # Create UserAddress
            address = database_models.UserAddress(
                street=user_data["address"]["street"],
                suite=user_data["address"]["suite"],
                city=user_data["address"]["city"],
                zipcode=user_data["address"]["zipcode"],
                geo=geo
            )
            
            # Create UserCompany
            company = database_models.UserCompany(
                name=user_data["company"]["name"],
                catchPhrase=user_data["company"]["catchPhrase"],
                bs=user_data["company"]["bs"]
            )
            
            # Create UserProfile
            user = database_models.UserProfile(
                id=user_data["id"],
                name=user_data["name"],
                username=user_data["username"],
                email=user_data["email"],
                phone=user_data["phone"],
                website=user_data["website"],
                address=address,
                company=company
            )
            
            db.add(user)
        
        db.commit()

@app.on_event("startup")
async def startup_event():
    db = next(get_db())
    await seed_data(db)

@app.post("/token", response_model=api_schemas.AuthToken)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(database_models.UserAccount).filter(database_models.UserAccount.email == form_data.username).first()
    if not user or not auth_service.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth_service.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", response_model=api_schemas.AuthToken)
async def register_user(user: api_schemas.UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(database_models.UserAccount).filter(database_models.UserAccount.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth_service.get_password_hash(user.password)
    db_user = database_models.UserAccount(
        email=user.email,
        name=user.name,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token_expires = timedelta(minutes=auth_service.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/", response_model=List[api_schemas.UserProfile])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: database_models.UserAccount = Depends(auth_service.get_current_user)
):
    users = db.query(database_models.UserProfile).offset(skip).limit(limit).all()
    return users

@app.get("/users/{user_id}", response_model=api_schemas.UserProfile)
def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: database_models.UserAccount = Depends(auth_service.get_current_user)
):
    user = db.query(database_models.UserProfile).filter(database_models.UserProfile.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/users/", response_model=api_schemas.UserProfile)
def create_user(
    user: api_schemas.UserProfileCreate,
    db: Session = Depends(get_db),
    current_user: database_models.UserAccount = Depends(auth_service.get_current_user)
):
    db_user = database_models.UserProfile(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.put("/users/{user_id}", response_model=api_schemas.UserProfile)
def update_user(
    user_id: int,
    user: api_schemas.UserProfileCreate,
    db: Session = Depends(get_db),
    current_user: database_models.UserAccount = Depends(auth_service.get_current_user)
):
    db_user = db.query(database_models.UserProfile).filter(database_models.UserProfile.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    for key, value in user.dict().items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: database_models.UserAccount = Depends(auth_service.get_current_user)
):
    db_user = db.query(database_models.UserProfile).filter(database_models.UserProfile.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"} 