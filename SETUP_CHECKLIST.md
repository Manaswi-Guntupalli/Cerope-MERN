# Setup Verification Checklist

Use this checklist to ensure your Cerope MERN application is set up correctly.

## ✅ Pre-Installation Checklist

- [ ] Node.js installed (v14 or higher)

  - Check: Run `node --version`
  - Download: https://nodejs.org/

- [ ] npm installed

  - Check: Run `npm --version`
  - Comes with Node.js

- [ ] MongoDB installed OR MongoDB Atlas account ready

  - Local: https://www.mongodb.com/try/download/community
  - Atlas: https://www.mongodb.com/cloud/atlas

- [ ] Code editor installed (VS Code recommended)
  - Download: https://code.visualstudio.com/

## ✅ Installation Checklist

- [ ] Backend dependencies installed

  - Navigate to `backend/` folder
  - Run `npm install`
  - Should see `node_modules/` folder created

- [ ] Frontend dependencies installed

  - Navigate to `frontend/` folder
  - Run `npm install`
  - Should see `node_modules/` folder created

- [ ] Environment files present
  - [ ] `backend/.env` exists
  - [ ] `frontend/.env` exists

## ✅ MongoDB Setup Checklist

### Option A: Local MongoDB

- [ ] MongoDB service is running

  - Windows: Check Services app
  - Mac: Run `brew services list`
  - Linux: Run `sudo systemctl status mongod`

- [ ] Can connect to `mongodb://localhost:27017`
  - Test with MongoDB Compass or mongo shell

### Option B: MongoDB Atlas

- [ ] Created MongoDB Atlas account
- [ ] Created a cluster
- [ ] Added database user
- [ ] Whitelisted IP address (0.0.0.0/0 for development)
- [ ] Got connection string
- [ ] Updated `backend/.env` with Atlas URI

## ✅ Backend Verification

- [ ] Backend starts without errors

  - Run `cd backend && npm run dev`
  - Should see: "✅ MongoDB Connected Successfully"
  - Should see: "🚀 Server running on port 5000"

- [ ] Health endpoint responds

  - Open browser: http://localhost:5000/api/health
  - Should see: `{"status":"OK","message":"Cerope API is running"}`

- [ ] No error messages in terminal

## ✅ Frontend Verification

- [ ] Frontend starts without errors

  - Run `cd frontend && npm run dev`
  - Should see: "Local: http://localhost:3000"

- [ ] Can access frontend

  - Open browser: http://localhost:3000
  - Should see the Register page

- [ ] No console errors (F12 in browser)

## ✅ Functionality Testing

### Registration Page

- [ ] Page loads correctly
- [ ] All form fields visible:

  - [ ] Name
  - [ ] Email
  - [ ] Password
  - [ ] Confirm Password
  - [ ] Terms checkbox

- [ ] Header shows "Cerope" logo
- [ ] "Explore More" button visible
- [ ] Footer displays correctly
- [ ] "Sign in" link works

### Validation Testing

- [ ] Name with numbers shows error: "Invalid Name! Please Do Not Enter Numerals."
- [ ] Invalid email shows error: "Invalid Email Address!"
- [ ] Weak password shows requirements tooltip
- [ ] Mismatched passwords show error: "Passwords Don't Match."
- [ ] Unchecked terms show error: "Please Tick The Checkbox To Agree To The Terms."

### Successful Registration

- [ ] Can register with valid data
- [ ] Redirects to Setup page after registration
- [ ] User data saved in MongoDB
  - Check with MongoDB Compass or mongo shell

### Login Page

- [ ] Navigate to login page
- [ ] Can login with registered credentials
- [ ] Invalid credentials show error
- [ ] Successful login redirects to Setup page

### Setup Page

- [ ] Setup page loads for logged-in user
- [ ] All fields visible:

  - [ ] Phone (optional)
  - [ ] Bio (optional)
  - [ ] Style preference (optional)
  - [ ] Favorite colors (optional)

- [ ] "Skip for Now" button works
- [ ] "Complete Setup" button works
- [ ] Both redirect to Profile page

### Profile Page

- [ ] Profile page loads
- [ ] User data displays correctly
- [ ] "Edit Profile" button works
- [ ] Can update profile information
- [ ] Changes save correctly
- [ ] "Logout" button works

## ✅ Responsive Design Testing

- [ ] Desktop view (1920px):

  - [ ] Two-column layout on Register/Login
  - [ ] Holographic image visible on right side
  - [ ] All elements properly spaced

- [ ] Tablet view (768px):

  - [ ] Layout adjusts appropriately
  - [ ] No horizontal scrolling
  - [ ] Touch targets are adequate

- [ ] Mobile view (375px):
  - [ ] Single column layout
  - [ ] Image hidden on small screens
  - [ ] Forms are full width
  - [ ] Buttons are easily clickable
  - [ ] No text overflow

## ✅ Browser Compatibility

Test in multiple browsers:

- [ ] Chrome
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Edge

## ✅ Network & API Testing

- [ ] Registration API works

  - POST to `/api/auth/register`
  - Returns token and user data

- [ ] Login API works

  - POST to `/api/auth/login`
  - Returns token and user data

- [ ] Profile API works

  - GET `/api/user/profile` (with token)
  - Returns user profile

- [ ] Update profile API works
  - PUT `/api/user/profile` (with token)
  - Updates user data

## ✅ Error Handling

- [ ] Network errors handled gracefully
- [ ] Invalid tokens redirect to login
- [ ] Server errors show user-friendly messages
- [ ] Form validation prevents invalid submissions

## ✅ Security Checklist

- [ ] Passwords are hashed (check MongoDB - should not see plain text)
- [ ] JWT tokens expire after 7 days
- [ ] Protected routes require authentication
- [ ] CORS is properly configured
- [ ] No sensitive data in console logs

## ✅ Code Quality

- [ ] No errors in browser console
- [ ] No errors in backend terminal
- [ ] Code follows consistent style
- [ ] Comments where needed
- [ ] No unused variables or imports

## ✅ Documentation

- [ ] README.md is complete
- [ ] QUICKSTART.md is accessible
- [ ] API_DOCUMENTATION.md is accurate
- [ ] PROJECT_SUMMARY.md is detailed

## 🎯 Final Checks

- [ ] All assignment requirements met
- [ ] Design matches Figma mockup
- [ ] Responsive on mobile (as per images 9-10)
- [ ] All validation messages match screenshots
- [ ] User flow works: Signup → Login → Setup → Profile
- [ ] No bugs or crashes
- [ ] Code is clean and well-organized

## 🐛 Common Issues & Solutions

### Issue: Cannot connect to MongoDB

**Solution**:

- Ensure MongoDB service is running
- Check MONGODB_URI in backend/.env
- Try MongoDB Atlas if local connection fails

### Issue: CORS errors

**Solution**:

- Restart both servers
- Check VITE_API_URL in frontend/.env
- Clear browser cache

### Issue: Port already in use

**Solution**:

- Change PORT in backend/.env
- Vite will auto-suggest different port for frontend

### Issue: JWT token errors

**Solution**:

- Clear localStorage in browser
- Log in again
- Check JWT_SECRET in backend/.env

### Issue: Registration fails

**Solution**:

- Check MongoDB connection
- Verify all required fields
- Check backend terminal for errors

## ✅ Deployment Ready Checklist (Optional)

If deploying to production:

- [ ] Update JWT_SECRET to strong random string
- [ ] Set NODE_ENV to "production"
- [ ] Configure production MongoDB URI
- [ ] Update CORS settings for production domain
- [ ] Remove console.log statements
- [ ] Build frontend for production
- [ ] Set up environment variables on hosting platform

---

## 🎉 Success!

If all items are checked, your Cerope MERN application is ready!

**What to do next:**

1. Test all features thoroughly
2. Review the code
3. Read through the documentation
4. Prepare for demo/presentation

**Need Help?**

- Check README.md for detailed instructions
- Review API_DOCUMENTATION.md for endpoint details
- See QUICKSTART.md for quick setup guide

---

**Project Status**: Ready for Review ✅
