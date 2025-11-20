# Cerope - AI-Powered Fashion Styling Platform

A complete MERN (MongoDB, Express.js, React.js, Node.js) stack application for the Cerope fashion styling platform, featuring user authentication, profile management, and responsive design.

## 📋 Project Overview

This application implements a complete user authentication and profile management system with the following features:

- **User Registration** with comprehensive validation
- **User Login** with JWT-based authentication
- **Profile Setup** for personalized user preferences
- **Profile Management** with view and edit capabilities
- **Responsive Design** optimized for mobile and desktop devices
- **Secure Authentication** using JWT tokens
- **Form Validation** with real-time error feedback

## 🏗️ Project Structure

```
MERN-APPLICATION/
├── backend/                 # Node.js + Express.js backend
│   ├── models/             # MongoDB schemas
│   │   └── User.js
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   └── user.js
│   ├── middleware/         # Authentication middleware
│   │   └── auth.js
│   ├── server.js           # Express server setup
│   ├── package.json
│   └── .env
│
├── frontend/               # React.js frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/       # React context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Setup.jsx
│   │   │   └── MyProfile.jsx
│   │   ├── utils/         # Utility functions
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🚀 Features

### 1. User Registration

- Name validation (no numerals allowed)
- Email validation with format checking
- Password strength requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- Password confirmation matching
- Terms and conditions acceptance
- Real-time validation feedback
- Duplicate email detection

### 2. User Login

- Email and password authentication
- JWT token generation
- Secure token storage
- Automatic redirection based on profile status

### 3. Profile Setup

- Phone number (optional)
- Bio/description (optional)
- Style preference selection
- Favorite colors input
- Skip option for later completion

### 4. My Profile

- View profile information
- Edit profile details
- Update preferences
- Member since date display
- Logout functionality

## 🛠️ Technologies Used

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** (jsonwebtoken) - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend

- **React** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and development server

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas account)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

   - The `.env` file is already created with default values
   - Update `MONGODB_URI` if using a different MongoDB connection
   - Update `JWT_SECRET` for production use

4. Start the backend server:

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. The `.env` file is already configured to connect to the backend

4. Start the development server:

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

### MongoDB Setup

#### Option 1: Local MongoDB

1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   - Windows: MongoDB should start automatically as a service
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

#### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `backend/.env` with your Atlas connection string

## 🎯 Usage Flow

1. **Sign Up**: Navigate to `/register` and create a new account
2. **Sign In**: Use your credentials at `/login`
3. **Setup Profile**: Complete your profile setup at `/setup` (or skip)
4. **View Profile**: Access your profile at `/profile`
5. **Edit Profile**: Click "Edit Profile" to update your information

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server generates a JWT token
3. Token is stored in localStorage
4. Token is sent with every API request in the Authorization header
5. Server validates token for protected routes
6. Invalid/expired tokens redirect to login

## 🎨 Design Implementation

The UI design is based on the Figma mockup provided and includes:

- Clean, modern interface with pink background (`#FFF5F5`)
- Consistent header with Cerope branding
- "Explore More" gradient button
- Responsive forms with proper validation
- Error messages matching the design specifications
- Footer with quick links, products, and policies
- Holographic/gradient effects for visual elements
- Mobile-optimized layout for all screen sizes

## 📱 Responsive Design

The application is fully responsive with:

- Mobile-first approach
- Breakpoints for tablets and desktops
- Touch-friendly input fields
- Optimized font sizes (16px minimum to prevent zoom on iOS)
- Flexible grid layouts
- Hidden decorative elements on mobile for better UX

## 🔒 Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- Protected routes requiring authentication
- Input validation and sanitization
- CORS configuration
- Environment variable management
- Secure password requirements
- XSS protection through React

## 🧪 Testing the Application

### Test User Flow

1. **Registration**:

   - Try entering numbers in the name field (should show error)
   - Try an invalid email format (should show error)
   - Try a weak password (should show requirements)
   - Try mismatched passwords (should show error)
   - Try submitting without accepting terms (should show error)

2. **Login**:

   - Try logging in with incorrect credentials
   - Try logging in with a registered user

3. **Profile Setup**:

   - Complete the setup with all fields
   - Try skipping the setup

4. **Profile Management**:
   - View your profile
   - Edit profile information
   - Save changes

## 🚧 Error Handling

The application includes comprehensive error handling:

- Frontend validation before submission
- Backend validation with descriptive error messages
- Network error handling
- 401 Unauthorized - automatic redirect to login
- 500 Server errors - user-friendly messages
- Duplicate email detection
- Token expiration handling

## 📝 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - Login user

### User Routes (`/api/user`) - Protected

- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `PUT /profile/setup` - Complete profile setup

## 🎓 Evaluation Criteria Addressed

### 1. Code Readability & Cleanliness ✅

- Well-structured components and files
- Consistent naming conventions
- Comprehensive comments where needed
- Modular code organization
- Separation of concerns

### 2. Design Parity with Figma ✅

- Accurate implementation of design elements
- Matching colors, fonts, and spacing
- Proper form layouts
- Footer implementation
- Responsive behavior

### 3. Error Handling & Validation ✅

- Real-time form validation
- Clear error messages matching design
- Backend validation
- Network error handling
- User-friendly feedback

### 4. Functional Completeness ✅

- JWT authentication implemented
- Complete user flow (Signup → Login → Setup → Profile)
- Data persistence in MongoDB
- Responsive design for mobile and desktop
- Protected routes
- Profile management

## 🔧 Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cerope
JWT_SECRET=cerope_secret_key_change_this_in_production_2024
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network settings for MongoDB Atlas

### Port Already in Use

- Change PORT in backend `.env`
- Update VITE_API_URL in frontend `.env`

### CORS Errors

- Verify backend CORS configuration
- Check API URL in frontend

### JWT Errors

- Clear localStorage and re-login
- Verify JWT_SECRET is set correctly

## 📄 License

This project is created as part of the MERN Stack Developer Intern application for Cerope.

## 👨‍💻 Author

Created with ❤️ for the Cerope internship application

## 🙏 Acknowledgments

- Design inspiration from Cerope Figma mockup
- Built with the MERN stack
- Styled with Tailwind CSS

---

**Note**: This is a demonstration project for the Cerope MERN Stack Developer Intern position. All validation requirements, error messages, and design elements have been implemented according to the assignment specifications.
A proper MERN Application
