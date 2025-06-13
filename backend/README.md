# User Management API

This is a FastAPI-based REST API for user management with JWT authentication and PostgreSQL database.

## Features

- User CRUD operations
- JWT Authentication
- PostgreSQL database with SQLAlchemy ORM
- Docker support
- Automatic data seeding from JSONPlaceholder
- Unit tests

## Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)

## Setup

1. Clone the repository
2. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql://postgres:postgres@db:5432/users_db
   SECRET_KEY=your-secret-key-here
   ```

3. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

- `POST /register` - Register a new user
- `POST /token` - Login and get JWT token

### Users

- `GET /users/` - Get all users (requires authentication)
- `GET /users/{user_id}` - Get specific user (requires authentication)
- `POST /users/` - Create new user (requires authentication)
- `PUT /users/{user_id}` - Update user (requires authentication)
- `DELETE /users/{user_id}` - Delete user (requires authentication)

## Testing

Run tests with pytest:
```bash
pytest
```

## Development

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

## API Documentation

Once the server is running, you can access:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc` 