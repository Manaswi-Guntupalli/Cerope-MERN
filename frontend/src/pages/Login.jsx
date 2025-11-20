import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Remove auto-redirect - let users access login page even if authenticated
  // Navigation happens after successful login in handleSubmit

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid Email Address!';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await login(formData);
      // Navigate based on profile setup status
      if (response.user?.profileSetup) {
        navigate('/profile');
      } else {
        navigate('/setup');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach((err) => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
      } else {
        setErrors({
          general: error.response?.data?.message || 'Login failed. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cerope-pink relative overflow-hidden">
      {/* Background Image - Desktop Only */}
      <div 
        className="hidden md:block absolute inset-0 bg-cover bg-center opacity-10 blur-sm"
        style={{
          backgroundImage: `url('/images/fashion-couple.jpg')`,
          backgroundSize: 'auto 65%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left center',
          opacity: 0.15,
          filter: 'blur(1px)',
          marginLeft: '10%',
          marginBottom: '35%'
        }}
      />
      
      {/* Header - Desktop Only */}
      <header className="hidden md:block bg-white border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
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
          <input
            type="text"
            placeholder="Search ..."
            className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-xl">
          👤
        </div>
      </div>

      {/* Mobile Fashion Image */}
      <div className="md:hidden relative w-full h-80 overflow-hidden">
        <img 
          src="/images/login image.jpg" 
          alt="Fashion Model" 
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute top-4 right-4">
          <div className="flex flex-col items-end">
            <img 
              src="/images/cerope-logo.jpg" 
              alt="Cerope Logo" 
              className="w-10 h-10 object-contain mb-1"
              onError={(e) => {
                e.target.src = '/images/cerope-logo.svg';
              }}
            />
            <span className="text-xs font-semibold text-gray-800">Cerope</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Form */}
          <div className="md:p-10 max-w-md mx-auto w-full bg-white bg-opacity-90 backdrop-blur-md md:bg-transparent md:backdrop-blur-none rounded-3xl md:rounded-none p-6 md:p-8 -mt-16 md:mt-0 shadow-2xl md:shadow-none">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-900">
              Welcome Back to Cerope
            </h1>
            <p className="text-gray-600 text-sm mb-6">Your personalized fashion journey awaits.</p>

            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 bg-opacity-80 backdrop-blur-sm border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-xs text-gray-600 mb-1 md:hidden">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg bg-transparent md:border-0 border md:border-b-2 ${
                    errors.email ? 'border-red-500' : 'border-gray-300 md:border-black md:border-opacity-40'
                  } focus:border-purple-400 focus:outline-none transition-all text-black placeholder-black md:placeholder-black placeholder:text-sm`}
                />
                {errors.email && <p className="text-red-600 text-sm mt-1 font-medium">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="relative">
                <label className="block text-xs text-gray-600 mb-1 md:hidden">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg bg-transparent md:border-0 border md:border-b-2 ${
                    errors.password ? 'border-red-500' : 'border-gray-300 md:border-black md:border-opacity-40'
                  } focus:border-purple-400 focus:outline-none transition-all text-black placeholder-black md:placeholder-black placeholder:text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
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
                {errors.password && <p className="text-red-600 text-sm mt-1 font-medium">{errors.password}</p>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="mr-2 rounded" />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-400"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white md:bg-cerope-pink text-gray-600">or</span>
                </div>
              </div>

              {/* Social Sign In Buttons */}
              <div className="flex gap-3">
                {/* Google Button */}
                <button
                  type="button"
                  className="flex-1 py-3 px-4 border-2 border-gray-800 rounded-full font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-gray-900">Google</span>
                </button>

                {/* Apple Button - Mobile Only */}
                <button
                  type="button"
                  className="md:hidden flex-1 py-3 px-4 border-2 border-gray-800 rounded-full font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span className="text-gray-900">Apple</span>
                </button>
              </div>

              {/* Register Link */}
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
                  
          {/* Right Side - Holographic Dress Image */}
          <div className="hidden md:flex md:items-start md:justify-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl w-full max-w-md">
              {/* Holographic Dress Image */}
              <div className="relative rounded-3xl overflow-hidden aspect-[3/4] bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-700">
                <img 
                  src="/images/login image.jpg" 
                  alt="Fashion Model" 
                  className="w-full h-full object-cover rounded-3xl"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xl font-bold">Cerope</span>
              </div>
              <p className="text-gray-400 text-sm">
                Revolutionizing fashion with AI-powered styling solutions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ's</a></li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Products</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>User Styling</li>
                <li className="text-gray-600">~ Launching Soon</li>
                <li>Price Comparison</li>
                <li>Creator Space</li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Policies</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Copyright Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms and Conditions</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            ©2025 Cerope. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
