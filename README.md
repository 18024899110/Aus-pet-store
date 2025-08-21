# CY Pet Store

A complete pet supplies e-commerce website, including a React frontend application and a Python FastAPI backend service.

## Project Structure

```
cy-pet-store/
├── frontend/             # React Frontend
│   ├── public/           # Static Files
│   └── src/              # Source Code
│       ├── assets/       # Assets
│       ├── components/   # Components
│       ├── context/      # Context
│       └── pages/        # Pages
└── backend/              # Python FastAPI Backend
    ├── app/              # Application Code
    │   ├── api/          # API Routes
    │   ├── core/         # Core Configuration
    │   ├── db/           # Database
    │   ├── models/       # Data Models
    │   ├── schemas/      # Pydantic Schemas
    │   └── utils/        # Utility Functions
    └── static/           # Static Files
```

## Features

- Responsive design, compatible with various devices
- User registration and login system
- Product browsing and search
- Product categories
- Shopping cart functionality
- Checkout process
- Order management
- Admin dashboard

## Tech Stack

### Frontend

- React
- React Router
- Bootstrap
- Axios
- Context API

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication

## Installation and Running

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
pip install -r requirements.txt
python run.py
```

## API Documentation

After starting the backend service, you can access `http://localhost:8000/docs` to view the API documentation.

## Test Accounts

- Administrator: admin@example.com / admin
- Test User: test@example.com / password