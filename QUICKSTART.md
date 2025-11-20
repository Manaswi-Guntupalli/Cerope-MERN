# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

Open two terminal windows.

**Terminal 1 - Backend:**

```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm install
```

### Step 2: Start MongoDB

Make sure MongoDB is running on your system.

**Windows:**
MongoDB usually runs as a service automatically after installation.

**Mac:**

```bash
brew services start mongodb-community
```

**Linux:**

```bash
sudo systemctl start mongod
```

**Or use MongoDB Atlas:**

- Update `backend/.env` with your MongoDB Atlas connection string

### Step 3: Start the Servers

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

✅ Backend should be running on http://localhost:5000

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

✅ Frontend should be running on http://localhost:3000

### Step 4: Test the Application

1. Open your browser and go to http://localhost:3000
2. You'll be redirected to the Register page
3. Create a new account
4. Complete the profile setup
5. View and edit your profile

## 🧪 Test Credentials

You can create any user during registration. Here's an example:

```
Name: Aishwaryaa Shah
Email: aishwaryaashah007@gmail.com
Password: Cerope*800_
Confirm Password: Cerope*800_
☑ Accept Terms
```

## 📱 Test on Mobile

To test on mobile devices on the same network:

1. Find your computer's IP address:

   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` or `ip addr`

2. Update frontend/.env:

   ```
   VITE_API_URL=http://YOUR_IP_ADDRESS:5000/api
   ```

3. Access from mobile: http://YOUR_IP_ADDRESS:3000

## ⚠️ Common Issues

### MongoDB Connection Error

**Problem:** Cannot connect to MongoDB
**Solution:**

- Check if MongoDB is running
- Verify MONGODB_URI in backend/.env

### Port Already in Use

**Problem:** Port 5000 or 3000 is already in use
**Solution:**

- Change PORT in backend/.env
- Vite will automatically suggest a different port

### CORS Error

**Problem:** API requests blocked
**Solution:**

- Restart both servers
- Clear browser cache

## 🎯 What to Test

### Registration Page

- ✅ Name validation (no numbers)
- ✅ Email format validation
- ✅ Password requirements
- ✅ Password matching
- ✅ Terms checkbox
- ✅ Error messages
- ✅ Duplicate email handling

### Login Page

- ✅ Email/password validation
- ✅ Incorrect credentials error
- ✅ Successful login redirect

### Setup Page

- ✅ Optional fields
- ✅ Skip functionality
- ✅ Profile completion

### Profile Page

- ✅ View profile data
- ✅ Edit mode
- ✅ Save changes
- ✅ Logout

## 📋 Project Requirements Checklist

- ✅ MongoDB database integration
- ✅ Express.js backend API
- ✅ React.js frontend
- ✅ Node.js server
- ✅ JWT authentication
- ✅ Registration page
- ✅ Login page
- ✅ Setup page
- ✅ Profile page
- ✅ Responsive design
- ✅ Tailwind CSS styling
- ✅ Form validation
- ✅ Error handling
- ✅ Design matching Figma

## 🎓 Assignment Completion

This project successfully implements:

1. **Architecture**: Complete MERN stack
2. **UI Implementation**: Responsive design matching Figma
3. **Database**: MongoDB with user data persistence
4. **Authentication**: JWT-based auth system
5. **Language**: JavaScript ES6 throughout
6. **Styling**: Tailwind CSS
7. **Flow**: Signup → Login → Setup → Profile

---

**Need Help?** Check the main README.md for detailed documentation.
