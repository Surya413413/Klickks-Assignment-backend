# 🔐 Authentication API Backend

A robust Node.js/Express backend API for user authentication and profile management with JWT token-based security and SQLite database.

## 🚀 Features

- **User Registration** - Create new user accounts
- **User Authentication** - Secure login with JWT tokens
- **Password Hashing** - bcrypt encryption for password security
- **Profile Management** - Protected user profile endpoints
- **JWT Middleware** - Token verification for protected routes
- **SQLite Database** - Lightweight database for user storage
- **CORS Support** - Cross-origin resource sharing enabled

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **SQLite3** - Embedded database
- **bcrypt** - Password hashing library
- **jsonwebtoken** - JWT implementation
- **cors** - Cross-origin resource sharing
- **sqlite** - SQLite database driver

## 📦 Dependencies

```json
{
  "bcrypt": "^6.0.0",
  "cors": "^2.8.5",
  "express": "^5.1.0",
  "jsonwebtoken": "^9.0.2",
  "sqlite": "^5.1.1",
  "sqlite3": "^5.1.7"
}
```

## ⚡ Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm package manager

### Installation

1. **Clone and navigate to project**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create database**
   The SQLite database (`klickks.db`) will be created automatically on first run.

4. **Start the server**
   ```bash
   node server.js
   ```
   
   Server will start on port 3000: `http://localhost:3000`

### Database Setup

The application will automatically create the SQLite database and table structure:

```sql
CREATE TABLE IF NOT EXISTS usertable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000
```

### 1. User Registration

**Endpoint:** `POST /register`

**Description:** Creates a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "sureshnayak6695.com",
  "password": "Surya@413"
}
```

**Response:**

✅ **Success (201)**
```json
{
  "message": "user created sucessfully"
}
```

❌ **Error (400)**
```json
"Email Id is already Registered"
```

**Example:**
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "suresh",
    "email": "sureshnayak6695@gmail.com",
    "password": "Surya@413"
  }'
```

### 2. User Login

**Endpoint:** `POST /login`

**Description:** Authenticates user and returns JWT token

**Request Body:**
```json
{
  "email": "sureshnayak6695@gamil.com",
    "password": "Surya@413"
}
```

**Response:**

✅ **Success (200)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

❌ **Error (400)**
```json
{
  "error_msg": "Invalid user Login"
}
```
```json
{
  "error_msg": "Invalid Password"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
     "email": "sureshnayak6695@gmail.com",
    "password": "Surya@413"
  }'
```

### 3. Get User Profile

**Endpoint:** `GET /profile`

**Description:** Retrieves authenticated user's profile information

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**

✅ **Success (200)**
```json
{
  "name": "suresh",
    "email": "sureshnayak6695@gmail.com"
  
}
```

❌ **Error (401)**
```json
"user Unathorized"
```
```json
"Invalid access token"
```

❌ **Error (404)**
```json
{
  "error": "User not found"
}
```

**Example:**
```bash
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🔒 Authentication & Security

### JWT Configuration
- **Secret Key:** `klickks123` (change in production)
- **Token Expiration:** 1 hour
- **Algorithm:** HS256

### Password Security
- **Hashing:** bcrypt with 10 salt rounds
- **Storage:** Only hashed passwords stored in database

### Protected Routes
Routes that require authentication:
- `GET /profile`

### Middleware: `actunticationjwtToken`
```javascript
// Authentication flow:
1. Extract token from Authorization header
2. Verify token with JWT secret
3. Decode user ID from token payload
4. Attach user ID to request object
5. Continue to protected route
```

## 🗄️ Database Schema

### Table: `usertable`

| Column   | Type    | Constraints           |
|----------|---------|----------------------|
| id       | INTEGER | PRIMARY KEY, AUTO INCREMENT |
| name     | TEXT    | NOT NULL             |
| email    | TEXT    | UNIQUE, NOT NULL     |
| password | TEXT    | NOT NULL (hashed)    |

## 🔧 Configuration

### Environment Variables (Recommended)

Create `.env` file:
```env
PORT=3000
JWT_SECRET=your-secure-secret-key
DB_PATH=./klickks.db
NODE_ENV=development
```

### Current Configuration
- **Port:** 3000
- **Database:** `./klickks.db`
- **JWT Secret:** `klickks123`
- **CORS:** Enabled for all origins

## 🚀 Deployment

### Production Checklist
- [ ] Change JWT secret key
- [ ] Set up environment variables
- [ ] Configure database path
- [ ] Set up HTTPS
- [ ] Configure CORS for specific origins
- [ ] Add rate limiting
- [ ] Set up logging

### Heroku Deployment
```bash
# Install Heroku CLI and login
heroku create your-app-name
heroku config:set JWT_SECRET=your-production-secret
git push heroku main
```

### Railway Deployment
```bash
# Connect to Railway
railway login
railway init
railway up
```

## 🧪 Testing API

### Using Postman
1. Import the following collection:
   - POST `/register` - Create account
   - POST `/login` - Get token
   - GET `/profile` - Use token from login

### Using curl
```bash
# Register
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Profile (replace TOKEN with actual token)
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer TOKEN"
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```
Solution: Ensure SQLite3 is properly installed and database path is correct
```

**JWT Token Not Working**
```
Check: Authorization header format - "Bearer <token>"
Verify: Token hasn't expired (1 hour limit)
```

**CORS Issues**
```
Solution: CORS is enabled for all origins. Check if preflight requests are handled.
```

**Password Validation Fails**
```
Check: Password is being hashed before comparison
Verify: bcrypt.compare is used correctly
```

## 📁 Project Structure

```
backend/
├── index.js          # Main server file
├── klickks.db        # SQLite database (auto-generated)
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## 🔍 Code Examples

### Register New User
```javascript
// Hash password before storing
const hashedPassword = await bcrypt.hash(password, 10);

// Check if user exists
const existingUser = await db.get(
  "SELECT * FROM usertable WHERE email = ?", 
  [email]
);

// Create new user
await db.run(
  "INSERT INTO usertable (name, email, password) VALUES (?, ?, ?)",
  [name, email, hashedPassword]
);
```

### Generate JWT Token
```javascript
const payload = { id: user.id };
const token = jwt.sign(payload, "klickks123", { expiresIn: "1h" });
```

## 📝 TODO / Future Enhancements

- [ ] Add input validation middleware
- [ ] Implement refresh tokens
- [ ] Add rate limiting
- [ ] Add request logging
- [ ] Implement password reset
- [ ] Add user roles/permissions
- [ ] Database connection pooling
- [ ] API versioning
- [ ] Swagger documentation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Server Status:** Running on port 3000 🚀
