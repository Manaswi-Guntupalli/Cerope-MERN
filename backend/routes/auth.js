import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/check-email
// @desc    Check if email already exists
// @access  Public
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        exists: true,
        message: 'Looks Like You Already Have An Account. Sign In'
      });
    }

    res.json({
      success: true,
      exists: false
    });
  } catch (error) {
    console.error('Email check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking email'
    });
  }
});

// Custom email validator
const strictEmailValidator = (email) => {
  // Strict email validation
  const strictEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!strictEmailRegex.test(email)) {
    return false;
  }
  
  const emailParts = email.toLowerCase().split('@');
  if (emailParts.length !== 2) {
    return false;
  }
  
  const domainParts = emailParts[1].split('.');
  if (domainParts.length < 2) {
    return false;
  }
  
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) {
    return false;
  }
  
  // Reject .co at the end
  if (email.toLowerCase().endsWith('.co')) {
    return false;
  }
  
  // Valid TLDs
  const validTLDs = [
    'com', 'net', 'org', 'edu', 'gov', 'mil', 'int',
    'co.uk', 'co.in', 'co.za', 'co.jp', 'co.kr',
    'ac.uk', 'ac.in',
    'io', 'ai', 'app', 'dev', 'tech',
    'us', 'uk', 'ca', 'au', 'de', 'fr', 'in', 'jp', 'cn',
    'info', 'biz', 'me', 'tv', 'cc'
  ];
  
  const domainWithTLD = emailParts[1].toLowerCase();
  const hasValidTLD = validTLDs.some(validTLD => {
    return domainWithTLD.endsWith('.' + validTLD);
  });
  
  return hasValidTLD;
};

// Validation middleware
const validateRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .matches(/^[^0-9]*$/)
    .withMessage('Invalid Name! Please Do Not Enter Numerals.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .custom((value) => {
      if (!strictEmailValidator(value)) {
        throw new Error('Invalid Email Address!');
      }
      return true;
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^[A-Za-z0-9*@#]*$/)
    .withMessage('Password contains invalid special characters. Only *, @, # are allowed')
    .matches(/[A-Z]/)
    .withMessage('An Upper Case Letter')
    .matches(/[a-z]/)
    .withMessage('A lower case letter')
    .matches(/[0-9]/)
    .withMessage('A number')
    .matches(/[*@#]/)
    .withMessage('A special character (*, @, #)'),
  body('confirmPassword')
    .trim()
    .notEmpty()
    .withMessage('Confirm Password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords Don\'t Match.');
      }
      return true;
    }),
  body('termsAccepted')
    .isBoolean()
    .custom((value) => {
      if (!value) {
        throw new Error('Please Tick The Checkbox To Agree To The Terms.');
      }
      return true;
    })
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .custom((value) => {
      if (!strictEmailValidator(value)) {
        throw new Error('Invalid Email Address!');
      }
      return true;
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }

    const { name, email, password, termsAccepted } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        errors: [{
          field: 'email',
          message: 'Looks Like You Already Have An Account. Sign In'
        }]
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      termsAccepted
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileSetup: user.profileSetup
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        errors: [{
          field: 'email',
          message: 'Looks Like You Already Have An Account. Sign In'
        }]
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }

    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        errors: [{
          field: 'email',
          message: 'Invalid email or password'
        }]
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        errors: [{
          field: 'password',
          message: 'Invalid email or password'
        }]
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileSetup: user.profileSetup
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
});

export default router;
