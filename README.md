# TODO Application - Adbrew Assignment

A full-stack TODO application built with React, Django, and MongoDB. Features real-time todo management with a clean, responsive UI.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Testing](#testing)
- [Database Management](#database-management)

## ✨ Features

- ✅ Create TODO items with descriptions
- ✅ View all TODOs in real-time
- ✅ Automatic list refresh after creating new TODO
- ✅ Clean, responsive UI with error handling
- ✅ MongoDB persistence
- ✅ RESTful API with proper validation
- ✅ Docker containerization for easy deployment

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with Hooks
- **React Hooks** - State management (`useState`, `useEffect`, `useCallback`)
- **CSS3** - Responsive styling with animations

### Backend
- **Django 3.x** - Web framework
- **Django REST Framework** - API development
- **django-cors-headers** - CORS support

### Database
- **MongoDB** - NoSQL database
- **PyMongo** - MongoDB Python driver

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📦 Prerequisites

Before you begin, ensure you have:

- **Docker** (version 20.10+)
- **Docker Compose** (version 1.29+)
- **Git**
- **VS Code** (optional but recommended)
- **Node.js 16+** (for local development without Docker)
- **Python 3.8+** (for local development without Docker)

### Installation

**Windows:**
```powershell
# Download and install Docker Desktop from:
# https://www.docker.com/products/docker-desktop

# Verify installation:
docker --version
docker-compose --version
```

**macOS/Linux:**
```bash
# Using Homebrew (macOS)
brew install docker docker-compose

# Or follow: https://docs.docker.com/install/
```

## 📁 Project Structure

```
adb_test/
├── src/
│   ├── app/                          # React Frontend
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── App.js               # Main App component
│   │   │   ├── App.css              # Styling
│   │   │   ├── index.js             # Entry point
│   │   │   └── logo.svg
│   │   ├── package.json             # React dependencies
│   │   ├── Dockerfile              # React container config
│   │   └── .gitignore
│   │
│   ├── rest/                         # Django Backend
│   │   ├── rest/
│   │   │   ├── settings.py          # Django configuration
│   │   │   ├── urls.py              # URL routing
│   │   │   ├── views.py             # API views
│   │   │   ├── wsgi.py
│   │   │   └── asgi.py
│   │   ├── manage.py                # Django CLI
│   │   ├── requirements.txt         # Python dependencies
│   │   ├── Dockerfile              # Django container config
│   │   └── .gitignore
│   │
│   └── requirements.txt             # Shared Python dependencies
│
├── docker-compose.yml               # Multi-container setup
├── .gitignore                       # Git ignore rules
├── README.md                        # This file
└── .vscode/
    ├── settings.json               # VS Code settings
    └── launch.json                 # Debug configuration
```

## 🚀 Installation & Setup

### Docker Setup

```powershell
# 1. Clone the repository
git clone https://github.com/rahulmangla28/Adbrew_Assignment.git
cd adb_test

# 2. Build and start all services
docker-compose up --build

# 3. Wait for all services to start (check logs)
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# MongoDB: localhost:27017
```

## 🎯 Running the Application

### With Docker 

```powershell
# Start all services
docker-compose up

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (clear data)
docker-compose down -v
```

## 📡 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### GET /todos/
Retrieve all TODO items from the database.

**Request:**
```http
GET /todos/ HTTP/1.1
Content-Type: application/json
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "description": "Buy groceries"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "description": "Learn Docker"
  }
]
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch todos",
  "details": "Error message"
}
```

---

#### POST /todos/
Create a new TODO item.

**Request:**
```http
POST /todos/ HTTP/1.1
Content-Type: application/json

{
  "description": "Buy groceries"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "description": "Buy groceries"
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "error": "Description field is required"
}
```

500 Internal Server Error:
```json
{
  "error": "Failed to create todo",
  "details": "Error message"
}
```

---

## 💻 Usage Guide

### 1. **Access the Application**

Open your browser and navigate to:
```
http://localhost:3000
```

### 2. **View TODOs**

The homepage displays all TODOs stored in MongoDB:
- Initially shows "No TODOs yet. Create one to get started!"
- Automatically loads all existing TODOs from the backend

### 3. **Create a New TODO**

1. Enter TODO description in the text input (e.g., "Buy groceries")
2. Click "Add ToDo!" button
3. Wait for confirmation (button shows "Adding...")
4. Input clears automatically on success
5. New TODO appears in the list instantly

### 4. **Error Handling**

- **Empty input**: Error message "Please enter a TODO description"
- **Network error**: Error message displays with details
- **Server error**: Error message from backend displayed
- All errors are logged to browser console for debugging

## 🧪 Testing

### Manual Testing with Browser

1. Open `http://localhost:3000`
2. Test scenarios:
   - Load page and verify TODOs fetch
   - Create TODO with valid description
   - Try submitting empty input (should show error)
   - Create multiple TODOs and verify list updates
   - Refresh page and verify data persists

### API Testing with REST Client

Create `test.http` in project root:

```http
@baseUrl = http://localhost:8000

### Get all TODOs
GET {{baseUrl}}/todos/
Content-Type: application/json

### Create a TODO
POST {{baseUrl}}/todos/
Content-Type: application/json

{
  "description": "Buy groceries"
}

### Create another TODO
POST {{baseUrl}}/todos/
Content-Type: application/json

{
  "description": "Learn Docker"
}

### Create TODO with empty description (should fail)
POST {{baseUrl}}/todos/
Content-Type: application/json

{
  "description": ""
}
```

In VS Code with REST Client extension:
- Right-click any request → "Send Request"
- View response in sidebar

### cURL Testing

```powershell
# Get all TODOs
curl -X GET http://localhost:8000/todos/

# Create TODO
curl -X POST http://localhost:8000/todos/ `
  -H "Content-Type: application/json" `
  -d '{"description":"Test TODO"}'
```

### Unit Testing (Optional)

```powershell
# Run React tests
cd src/app
npm test

# Run Django tests
cd src/rest
python manage.py test
```

## 🗄️ Database Management

### View Data in MongoDB

#### Using mongosh in Docker

```powershell
# Access MongoDB shell
docker exec -it mongo mongosh

# Inside mongosh:
use test_db
show collections
db.todos.find().pretty()
db.todos.count()
exit
```

### Clear Database

```powershell
# Drop only todos collection
docker exec -it mongo mongosh --eval "use test_db; db.todos.drop();"

# Drop entire database
docker exec -it mongo mongosh --eval "use test_db; db.dropDatabase();"

# Clear all volumes (Docker)
docker-compose down -v
```

### Backup Database

```powershell
# Create backup
docker exec mongo mongodump --db test_db --out /backup

# Restore backup
docker exec mongo mongorestore /backup
```

## 📝 File Descriptions

### Frontend

**`src/app/src/App.js`**
- Main React component
- Manages TODO list and form state
- Handles API calls to backend
- Error handling and loading states

**`src/app/src/App.css`**
- Responsive styling
- Animations and transitions
- Mobile-first design
- Accessibility compliance

### Backend

**`src/rest/rest/views.py`**
- `TodoListView` - Handles GET (list) and POST (create)
- MongoDB integration
- Request validation
- Error handling

**`src/rest/rest/urls.py`**
- URL routing configuration
- Maps endpoints to views

**`src/rest/rest/settings.py`**
- Django configuration
- Database configuration
- Installed apps

## 🚢 Deployment

### Using Docker in Production

```powershell
# Build for production
docker-compose -f docker-compose.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Variables

Create `.env` file in root:

```
MONGO_HOST=mongo
MONGO_PORT=27017
DJANGO_DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1
```
