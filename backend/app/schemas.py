from pydantic import BaseModel, EmailStr

class GeoBase(BaseModel):
    lat: str
    lng: str

class AddressBase(BaseModel):
    street: str
    suite: str
    city: str
    zipcode: str
    geo: GeoBase

class CompanyBase(BaseModel):
    name: str
    catchPhrase: str
    bs: str

class UserBase(BaseModel):
    name: str
    username: str
    email: EmailStr
    address: AddressBase
    phone: str
    website: str
    company: CompanyBase

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class UserAuth(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    email: EmailStr
    name: str
    password: str 