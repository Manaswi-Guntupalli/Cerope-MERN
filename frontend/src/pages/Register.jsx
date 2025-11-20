import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const emailCheckTimeout = useRef(null);

  // Allow navigation to Register page even when authenticated
  // This enables users to view the home/landing page from Profile

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (emailCheckTimeout.current) {
        clearTimeout(emailCheckTimeout.current);
      }
    };
  }, []);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (/\d/.test(value)) {
          error = 'Invalid Name! Please Do Not Enter Numerals.';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else {
          // Use the validateEmailFormat function for consistency
          error = validateEmailFormat(value);
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        } else if (!/^[A-Za-z0-9*@#]*$/.test(value)) {
          error = 'Password contains invalid special characters. Only *, @, # are allowed';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Confirm Password is required';
        } else if (value !== formData.password) {
          error = 'Passwords Don\'t Match.';
        }
        break;

      case 'termsAccepted':
        if (!value) {
          error = 'Please Tick The Checkbox To Agree To The Terms.';
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Validate email format (Step 1)
  const validateEmailFormat = (email) => {
    if (!email.trim()) {
      return 'Email is required';
    }
    
    // Strict email validation regex
    // Must have: username @ domain . TLD (at least 2 chars)
    const strictEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!strictEmailRegex.test(email)) {
      return 'Invalid Email Address!';
    }
    
    // Extract domain and TLD
    const emailParts = email.toLowerCase().split('@');
    if (emailParts.length !== 2) {
      return 'Invalid Email Address!';
    }
    
    const domainParts = emailParts[1].split('.');
    
    // Check if domain has at least 2 parts (domain.tld)
    if (domainParts.length < 2) {
      return 'Invalid Email Address!';
    }
    
    // Check TLD is at least 2 characters (com, net, org, etc.) and not just single letter
    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2) {
      return 'Invalid Email Address!';
    }
    
    // Check for common typos and incomplete domains
    const invalidPatterns = [
      'gmil.com', 'gmai.com', 'yahooo.com', 'outlok.com',
      '.co$', // Reject .co at the end unless it's a valid .co domain
    ];
    
    const lowerEmail = email.toLowerCase();
    
    // Check for common typos
    const commonTypos = ['gmil.com', 'gmai.com', 'yahooo.com', 'outlok.com'];
    if (commonTypos.some(typo => lowerEmail.includes(typo))) {
      return 'Invalid Email Address!';
    }
    
    // Reject .co unless it's specifically .co.uk, .co.in, etc (has something after .co)
    if (lowerEmail.endsWith('.co')) {
      return 'Invalid Email Address!';
    }
    
    // List of valid common TLDs to accept
    const validTLDs = [
      'com', 'net', 'org', 'edu', 'gov', 'mil', 'int',
      'co.uk', 'co.in', 'co.za', 'co.jp', 'co.kr',
      'ac.uk', 'ac.in',
      'io', 'ai', 'app', 'dev', 'tech',
      'us', 'uk', 'ca', 'au', 'de', 'fr', 'in', 'jp', 'cn',
      'info', 'biz', 'me', 'tv', 'cc'
    ];
    
    // Extract the TLD (including country codes like .co.uk)
    const domainWithTLD = emailParts[1].toLowerCase();
    const hasValidTLD = validTLDs.some(validTLD => {
      return domainWithTLD.endsWith('.' + validTLD);
    });
    
    if (!hasValidTLD) {
      return 'Invalid Email Address!';
    }
    
    return ''; // No error - email format is valid
  };

  // Check if email exists in database (Step 2 - only if format is valid)
  const checkEmailExists = async (email) => {
    // Step 1: First validate email format on frontend
    const formatError = validateEmailFormat(email);
    if (formatError) {
      // Don't make API call if format is invalid
      return;
    }

    // Step 2: If format is valid, check with backend
    setEmailChecking(true);
    try {
      const response = await api.post('/auth/check-email', { email });
      
      // Email doesn't exist - clear any existing error
      if (!response.data.exists) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
    } catch (error) {
      // Email exists or error occurred
      if (error.response?.status === 400 && error.response?.data?.exists) {
        setErrors((prev) => ({
          ...prev,
          email: 'Looks Like You Already Have An Account. Sign In',
        }));
      }
    } finally {
      setEmailChecking(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // Clear confirm password error when password changes
    if (name === 'password' && errors.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: '',
      }));
    }

    // Handle email input with debouncing
    if (name === 'email') {
      // Clear previous timeout
      if (emailCheckTimeout.current) {
        clearTimeout(emailCheckTimeout.current);
      }

      // Step 1: Validate email format first
      const formatError = validateEmailFormat(value);
      
      if (formatError) {
        // Show format error immediately
        setErrors((prev) => ({
          ...prev,
          email: formatError,
        }));
        setEmailChecking(false);
      } else if (value.trim()) {
        // Format is valid, show checking state
        setEmailChecking(true);
        
        // Step 2: Check with backend after 800ms delay (debounce)
        emailCheckTimeout.current = setTimeout(() => {
          checkEmailExists(value.trim());
        }, 800);
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Skip validation for termsAccepted checkbox on blur
    if (name === 'termsAccepted') {
      return;
    }
    
    const fieldValue = type === 'checkbox' ? checked : value;
    const error = validateField(name, fieldValue);

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }

    // For email field: validate format first, then check existence
    if (name === 'email' && value) {
      // Cancel any pending debounced check
      if (emailCheckTimeout.current) {
        clearTimeout(emailCheckTimeout.current);
      }

      // Step 1: Validate format
      const formatError = validateEmailFormat(value);
      
      if (!formatError) {
        // Step 2: Format is valid, check with backend immediately on blur
        checkEmailExists(value.trim());
      }
    }
  };

  const passwordRequirements = [
    { text: 'An Upper Case Letter', regex: /[A-Z]/ },
    { text: 'A lower case letter', regex: /[a-z]/ },
    { text: 'A number', regex: /[0-9]/ },
    { text: 'A special character (*, @, #)', regex:/^[A-Za-z0-9*@#]*$/ ,isNegative: false}
  ];

  // Check password requirement status
  const getPasswordRequirementStatus = (regex) => {
    if (!formData.password) return 'inactive';
    return regex.test(formData.password) ? 'passed' : 'failed';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/setup');
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach((err) => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
      } else {
        setErrors({
          general: error.response?.data?.message || 'Registration failed. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-pink-100 relative overflow-hidden">
      {/* Background Image - Fashion Couple positioned behind signup card - Desktop only */}
      <div 
        className="hidden md:block absolute inset-0 flex items-center justify-start"
        style={{
          backgroundImage: `url('/images/fashion-couple.jpg')`,
          backgroundSize: '405px 476px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left center',
          opacity: 0.15,
          filter: 'blur(1px)',
          marginLeft: '10%',
          marginBottom: '35%',
        }}
      />
      
      {/* Gradient overlay for better fade effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-50/30 to-purple-100/50" />
      
      {/* Header - Desktop Only */}
      <header className="hidden md:block bg-white border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Cerope Logo */}
            <img 
              src="/images/cerope-logo.jpg" 
              alt="Cerope Logo" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.target.src = '/images/cerope-logo.svg';
              }}
            />
            <span className="text-xl font-semibold">Cerope</span>
          </div>
          <button className="px-6 py-2 rounded-full border-2 border-purple-600 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity">
            Explore More ✨
          </button>
        </div>
      </header>

      {/* Mobile Header with Search and Profile */}
      <div className="md:hidden bg-white p-4 flex items-center gap-3 relative z-10">
        <div className="flex items-center space-x-2">
          <img 
            src="/images/cerope-logo.jpg" 
            alt="Cerope Logo" 
            className="w-6 h-6 object-contain"
            onError={(e) => {
              e.target.src = '/images/cerope-logo.svg';
            }}
          />
        </div>
        <div className="flex-1 relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search ..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
        <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-xl">
          👤
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        {/* Mobile: Holographic Dress on Top */}
        <div className="md:hidden relative w-full h-64 overflow-hidden">
          <img 
            src="/images/holographic-dress.jpg" 
            alt="Holographic Fashion Dress" 
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {/* Cerope Logo Overlay on Image */}
          <div className="absolute top-4 right-4">
            <div className="flex flex-col items-end">
              <img 
                src="/images/cerope-logo.jpg" 
                alt="Cerope" 
                className="w-10 h-10 object-contain mb-1"
                onError={(e) => e.target.style.display = 'none'}
              />
              <span className="text-xs font-semibold text-white">Cerope</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl w-full">
          {/* Left Side - Form */}
          <div className="max-w-md mx-auto w-full bg-white md:bg-transparent bg-opacity-90 backdrop-blur-md md:backdrop-blur-none rounded-3xl md:rounded-none p-6 md:p-0 -mt-12 md:mt-0 shadow-2xl md:shadow-none">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-2" style={{color: '#000000'}}>
              Set up Your Cerope Account
            </h1>

            {errors.termsAccepted && (
              <div className="mb-6 text-center">
                <p className="text-sm font-medium" style={{color: '#FF0000'}}>{errors.termsAccepted}</p>
              </div>
            )}

            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${errors.name ? 'input-field-error' : ''}`}
                />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${errors.email ? 'input-field-error' : ''}`}
                />
                {emailChecking && (
                  <p className="text-xs text-gray-500 mt-1">Checking email...</p>
                )}
                {errors.email && (
                  <p className="error-text">
                    {errors.email.includes('Sign In') ? (
                      <>
                        Looks Like You Already Have An Account.{' '}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate('/login');
                          }}
                          className="text-blue-600 hover:text-blue-800 underline font-semibold cursor-pointer relative z-50 bg-transparent border-none p-0 inline"
                        >
                          Sign In
                        </button>
                      </>
                    ) : (
                      errors.email
                    )}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setShowPasswordRequirements(true)}
                  onBlur={(e) => {
                    handleBlur(e);
                    setShowPasswordRequirements(false);
                  }}
                  className={`input-field pr-12 ${errors.password ? 'input-field-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 z-10"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                
                {showPasswordRequirements && formData.password && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-2">New Password must contain</p>
                    <ul className="space-y-1">
                      {passwordRequirements.map((req, index) => {
                        const status = getPasswordRequirementStatus(req.regex);
                        return (
                          <li key={index} className="text-xs flex items-center">
                            <span className="mr-2 flex-shrink-0">
                              {status === 'inactive' && <span className="text-gray-400">-</span>}
                              {status === 'passed' && (
                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                              )}
                              {status === 'failed' && (
                                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                                </svg>
                              )}
                            </span>
                            <span className={
                              status === 'passed' ? 'text-green-600' : 
                              status === 'failed' ? 'text-red-600' : 
                              'text-gray-600'
                            }>
                              {req.text}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field pr-12 ${errors.confirmPassword ? 'input-field-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 z-10"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
              </div>

              {/* Terms Checkbox */}
              <div>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="mt-1 w-4 h-4 text-cerope-blue border-gray-300 rounded focus:ring-cerope-blue"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to Cerope's Terms of Service & Privacy Policy.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600">
                Already a member?{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate('/login');
                  }}
                  className="text-blue-600 hover:text-blue-800 underline font-semibold cursor-pointer relative z-50 bg-transparent border-none p-0 inline"
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>

          {/* Right Side - Holographic Dress Image */}
          <div className="hidden md:flex md:items-start md:justify-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{width: '405px', height: '476px'}}>
              {/* Holographic Dress Image */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-700" style={{width: '405px', height: '476px'}}>
                <img 
                  src="/images/holographic-dress.jpg" 
                  alt="Holographic Fashion Dress" 
                  className="w-full h-full object-cover rounded-3xl"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                {/* Cerope Logo Overlay on Image */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full p-2">
                  <img 
                    src="/images/cerope-logo.jpg" 
                    alt="Cerope" 
                    className="w-8 h-8 object-contain"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-2xl font-bold">Cerope</span>
              </div>
              <p className="text-white text-sm leading-relaxed">
                Revolutionizing fashion with AI-powered styling solutions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2 text-sm text-white">
                <li><a href="#">Home</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Features</a></li>
                <li><a href="#">FAQ's</a></li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Products</h3>
              <ul className="space-y-2 text-sm text-white">
                <li>User Styling</li>
                <li className="text-white ml-2">~ Launching Soon</li>
                <li>Price Comparison</li>
                <li>Creator Space</li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Policies</h3>
              <ul className="space-y-2 text-sm text-white">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Copyright Policy</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">Terms and Conditions</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-black mt-10 pt-6 text-center text-sm text-white">
            ©2025 Cerope. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;