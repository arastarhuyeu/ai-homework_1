from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class LocationCoordinates(Base):
    __tablename__ = "geo"

    id = Column(Integer, primary_key=True, index=True)
    lat = Column(String)
    lng = Column(String)
    address_id = Column(Integer, ForeignKey("address.id"))

class UserAddress(Base):
    __tablename__ = "address"

    id = Column(Integer, primary_key=True, index=True)
    street = Column(String)
    suite = Column(String)
    city = Column(String)
    zipcode = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    geo = relationship("LocationCoordinates", uselist=False, cascade="all, delete-orphan")

class UserCompany(Base):
    __tablename__ = "company"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    catchPhrase = Column(String)
    bs = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

class UserProfile(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    website = Column(String)
    address = relationship("UserAddress", uselist=False, cascade="all, delete-orphan")
    company = relationship("UserCompany", uselist=False, cascade="all, delete-orphan")

class UserAccount(Base):
    __tablename__ = "auth_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    password_hash = Column(String) 