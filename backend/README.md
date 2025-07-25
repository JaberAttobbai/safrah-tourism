# Safrah Tourism Backend API

A comprehensive Node.js backend for the Safrah Tourism platform - Saudi Arabia's premier women-focused tourism service.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based auth with role management
- **Destinations Management** - Complete CRUD for tourist destinations
- **Tours & Trips** - Booking system with availability management
- **Tour Guides** - Guide profiles with verification and scheduling
- **Booking System** - Full booking lifecycle with payments and cancellations
- **Blog Management** - Content management with comments and likes
- **File Uploads** - Image and document upload handling
- **Admin Dashboard** - Complete admin functionality
- **Real-time Statistics** - Analytics and reporting

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer
- **Security:** Helmet, CORS, Rate Limiting
- **Validation:** Joi validation
- **Environment:** dotenv for configuration

## 📁 Project Structure

```
backend/
├── models/           # Mongoose schemas
│   ├── User.js
│   ├── Destination.js
│   ├── Trip.js
│   ├── Guide.js
│   ├── Booking.js
│   └── BlogPost.js
├── routes/           # Express route handlers
│   ├── auth.js
│   ├── users.js
│   ├── destinations.js
│   ├── trips.js
│   ├── guides.js
│   ├── bookings.js
│   ├── blog.js
│   └── upload.js
├── middleware/       # Custom middleware
│   └── auth.js
├── uploads/          # File upload directory
├── server.js         # Main server file
├── package.json
└── .env.example
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone and setup:**
```bash
cd backend
npm install
```

2. **Environment Configuration:**
```bash
cp .env.example .env
```

3. **Configure your .env file:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/safrah-tourism
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

4. **Start the server:**
```bash
# Development
npm run dev

# Production
npm start
```

5. **Verify installation:**
```bash
curl http://localhost:5000/api/health
```

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication
Include JWT token in request headers:
```
Authorization: Bearer your-jwt-token
```

### Core Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile
- `POST /auth/forgot-password` - Password reset
- `PUT /auth/reset-password/:token` - Reset password

#### Destinations
- `GET /destinations` - List destinations
- `GET /destinations/featured` - Featured destinations
- `GET /destinations/:id` - Get destination details
- `POST /destinations` - Create destination (Admin)
- `PUT /destinations/:id` - Update destination (Admin)
- `POST /destinations/:id/wishlist` - Add to wishlist

#### Trips
- `GET /trips` - List trips
- `GET /trips/featured` - Featured trips
- `GET /trips/:id` - Get trip details
- `GET /trips/:id/availability` - Check availability
- `POST /trips` - Create trip (Admin)

#### Guides
- `GET /guides` - List guides
- `GET /guides/top-rated` - Top-rated guides
- `GET /guides/:id` - Get guide profile
- `POST /guides` - Create guide profile
- `PUT /guides/:id/availability` - Update availability

#### Bookings
- `POST /bookings` - Create booking
- `GET /bookings/my-bookings` - User's bookings
- `GET /bookings/:id` - Get booking details
- `PUT /bookings/:id/cancel` - Cancel booking
- `PUT /bookings/:id/confirm` - Confirm booking (Admin)

#### Blog
- `GET /blog` - List blog posts
- `GET /blog/featured` - Featured posts
- `GET /blog/:id` - Get post details
- `POST /blog` - Create post (Admin)
- `POST /blog/:id/like` - Like post
- `POST /blog/:id/comments` - Add comment

#### File Upload
- `POST /upload/image` - Upload single image
- `POST /upload/images` - Upload multiple images
- `POST /upload/profile` - Upload profile image
- `POST /upload/document` - Upload document

### Query Parameters

#### Filtering & Search
```javascript
// Destinations
GET /destinations?region=west&category=beach&minPrice=500&maxPrice=2000&search=جدة

// Trips
GET /trips?difficulty=easy&featured=true&sortBy=price&sortOrder=asc

// Guides
GET /guides?language=english&verified=true&region=center
```

#### Pagination
```javascript
GET /destinations?page=2&limit=12
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "data": {
    "destinations": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 12
    }
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

## 🔐 Security Features

- **JWT Authentication** with refresh tokens
- **Role-based Access Control** (user, guide, admin)
- **Rate Limiting** to prevent abuse
- **Input Validation** with Joi
- **CORS Protection** for cross-origin requests
- **Helmet** for security headers
- **Password Hashing** with bcrypt

## 📊 Data Models

### User Schema
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: ['user', 'admin', 'guide'],
  preferences: {
    regions: [String],
    categories: [String],
    budgetRange: { min: Number, max: Number }
  },
  wishlist: [ObjectId],
  bookingHistory: [ObjectId],
  loyaltyPoints: Number
}
```

### Booking Schema
```javascript
{
  user: ObjectId,
  trip: ObjectId,
  destination: ObjectId,
  travelers: {
    adults: Number,
    children: Number,
    infants: Number
  },
  dates: {
    startDate: Date,
    endDate: Date,
    duration: Number
  },
  pricing: {
    basePrice: Number,
    taxAmount: Number,
    totalAmount: Number
  },
  status: ['pending', 'confirmed', 'cancelled', 'completed'],
  payment: {
    status: ['pending', 'paid', 'failed', 'refunded'],
    method: String,
    transactionId: String
  }
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Test specific endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🚀 Deployment

### Environment Variables (Production)
```env
NODE_ENV=production
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/safrah-tourism
JWT_SECRET=strong-production-secret
FRONTEND_URL_PROD=https://your-domain.com
```

### Build & Deploy
```bash
npm run build
npm start
```

## 📈 Monitoring & Analytics

- Health check endpoint: `GET /api/health`
- User dashboard: `GET /api/users/dashboard` (Admin)
- Booking analytics: Available through admin endpoints
- Performance monitoring: Built-in request logging

## 🤝 API Usage Examples

### Register New User
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'سارة',
    lastName: 'أحمد',
    email: 'sara@example.com',
    password: 'password123',
    phone: '0551234567',
    city: 'الرياض'
  })
});
```

### Create Booking
```javascript
const response = await fetch('/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    trip: 'trip_id',
    travelers: { adults: 2, children: 1, infants: 0 },
    dates: {
      startDate: '2024-03-15',
      endDate: '2024-03-18'
    },
    contactInfo: {
      email: 'sara@example.com',
      phone: '0551234567'
    },
    payment: {
      method: 'credit_card'
    }
  })
});
```

## 🛟 Support

For technical support or questions:
- Check the health endpoint: `/api/health`
- Review error responses for debugging
- Verify environment configuration
- Check MongoDB connection

## 📝 License

This project is licensed under the MIT License.

---

**Safrah Tourism Backend** - Empowering Saudi women through exceptional travel experiences. 🌟