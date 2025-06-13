from pydantic import BaseModel, EmailStr

class LocationCoordinatesBase(BaseModel):
    lat: str
    lng: str

class UserAddressBase(BaseModel):
    street: str
    suite: str
    city: str
    zipcode: str
    geo: LocationCoordinatesBase

class UserCompanyBase(BaseModel):
    name: str
    catchPhrase: str
    bs: str

class UserProfileBase(BaseModel):
    name: str
    username: str
    email: EmailStr
    address: UserAddressBase
    phone: str
    website: str
    company: UserCompanyBase

class UserProfileCreate(UserProfileBase):
    pass

class UserProfile(UserProfileBase):
    id: int

    class Config:
        from_attributes = True

class AuthToken(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    email: str | None = None

class UserAuth(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    email: EmailStr
    name: str
    password: str 