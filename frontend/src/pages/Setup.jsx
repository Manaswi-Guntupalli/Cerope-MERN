import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Setup = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    profilePicture: '',
    dob: '',
    stylePreference: '',
    phone: '',
    country: '',
    city: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('👤');

  // Avatar options matching the image
  const avatarOptions = [
    '👨', '👨🏻', '👨🏼', '👨🏽', '👨🏾', '👨🏿',
    '👩', '👩🏻', '👩🏼', '👩🏽', '👩🏾', '👩🏿'
  ];

  // Indian cities list
  const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai',
    'Kolkata', 'Pune', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur',
    'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
    'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi',
    'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad',
    'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada',
    'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Chandigarh', 'Guwahati'
  ];

  useEffect(() => {
    // If profile is already set up, redirect to profile
    if (user?.profileSetup) {
      navigate('/profile');
    }
    
    // Pre-fill first name from user's name if available
    if (user?.name) {
      const nameParts = user.name.split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
      }));
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setFormData((prev) => ({
      ...prev,
      profilePicture: avatar,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Combine first and last name
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      const preferences = {
        profilePicture: formData.profilePicture || selectedAvatar,
        stylePreference: formData.stylePreference,
        dob: formData.dob,
        country: formData.country,
        city: formData.city,
      };

      const response = await api.put('/user/profile/setup', {
        name: fullName,
        phone: formData.phone,
        preferences,
      });

      if (response.data.success) {
        updateUser(response.data.user);
        navigate('/profile');
      }
    } catch (err) {
      console.error('Setup error:', err);
      setError(err.response?.data?.message || 'Failed to complete setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Desktop Only */}
      <header className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="/images/cerope-logo.jpg" 
              alt="Cerope Logo" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-semibold text-gray-800">Cerope</span>
          </div>
          
          <button className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1">
            Explore More ✨
          </button>
        </div>
      </header>

      {/* Mobile Header with Search and Profile */}
      <div className="md:hidden bg-white p-4 flex items-center gap-3 border-b border-gray-200">
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

      {/* Mobile Fashion Image - Top */}
      <div className="md:hidden relative w-full h-64 overflow-hidden bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100">
        <img 
          src="/images/setup.jpg" 
          alt="Fashion Model" 
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        {/* Cerope Logo Overlay */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row justify-center items-start gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Left Side - Form */}
          <div className="w-full lg:w-auto lg:flex-shrink-0">
            <div className="max-w-md mx-auto lg:mx-0 bg-white md:bg-transparent bg-opacity-95 backdrop-blur-md md:backdrop-blur-none rounded-3xl md:rounded-none p-6 md:p-0 -mt-12 md:mt-0 shadow-2xl md:shadow-none">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Set up Your User Account</h1>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-normal text-gray-600 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent text-gray-900 bg-white"
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-normal text-gray-600 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent text-gray-900 bg-white"
                />
              </div>

              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-normal text-gray-600 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {selectedAvatar === '👤' ? (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
                        <circle cx="12" cy="8" r="4" fill="currentColor"/>
                        <path d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="white"/>
                      </svg>
                    ) : (
                      <span className="text-2xl">{selectedAvatar}</span>
                    )}
                  </div>
                  <div className="flex-1 relative">
                    <button
                      type="button"
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-left text-gray-500 bg-white hover:bg-gray-50 transition-all flex items-center justify-between"
                    >
                      <span>Select Profile Picture</span>
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 1l4 4 4-4"/>
                      </svg>
                    </button>
                    
                    {/* Avatar Dropdown */}
                    {showProfileDropdown && (
                      <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-64">
                        <div className="grid grid-cols-6 gap-2 mb-3">
                          {avatarOptions.map((avatar, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleAvatarSelect(avatar)}
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl hover:bg-gray-100 transition-all ${
                                selectedAvatar === avatar ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                              }`}
                            >
                              {avatar}
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowProfileDropdown(false)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                        >
                          Select
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dob" className="block text-sm font-normal text-gray-600 mb-2">
                  Date of Birth<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent bg-white cursor-pointer [&::-webkit-datetime-edit]:hidden [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    style={{ color: formData.dob ? '#374151' : 'transparent' }}
                  />
                  {!formData.dob && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      Select DOB
                    </span>
                  )}
                  {formData.dob && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none">
                      {new Date(formData.dob + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  )}
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 20 20" 
                    fill="none" 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  >
                    <path d="M6 2V5M14 2V5M3 8H17M4 4H16C16.5523 4 17 4.44772 17 5V17C17 17.5523 16.5523 18 16 18H4C3.44772 18 3 17.5523 3 17V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Style Preference */}
              <div>
                <label className="block text-sm font-normal text-gray-600 mb-2">
                  Style Preference<span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="stylePreference"
                      value="men"
                      checked={formData.stylePreference === 'men'}
                      onChange={handleChange}
                      required
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-600">Men</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="stylePreference"
                      value="women"
                      checked={formData.stylePreference === 'women'}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-600">Women</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="stylePreference"
                      value="both"
                      checked={formData.stylePreference === 'both'}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-600">Both</span>
                  </label>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-normal text-gray-600 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent text-gray-900 bg-white"
                />
              </div>

              {/* Country */}
              <div className="md:hidden">
                <label htmlFor="country-mobile" className="block text-sm font-normal text-gray-600 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="country-mobile"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent text-gray-900 bg-white"
                />
              </div>

              {/* City - Mobile */}
              <div className="md:hidden">
                <label htmlFor="city-mobile" className="block text-sm font-normal text-gray-600 mb-2">
                  City
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-left text-gray-500 bg-white hover:bg-gray-50 transition-all flex items-center justify-between"
                  >
                    <span>{formData.city || 'Select location'}</span>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 1l4 4 4-4"/>
                    </svg>
                  </button>
                  
                  {showCityDropdown && formData.country.toLowerCase() === 'india' && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 w-full max-h-60 overflow-y-auto">
                      {indianCities.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, city }));
                            setShowCityDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700 text-sm"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Processing...' : 'Continue'}
              </button>
            </form>
          </div>
          </div>

          {/* Right Side - Image and Fields */}
          <div className="hidden lg:block w-full lg:w-auto lg:flex-shrink-0">
            <div className="flex flex-col gap-6 max-w-md mx-auto lg:mx-0">
            {/* Fashion Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-md bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 w-full lg:w-[360px]" style={{ height: '480px' }}>
              <img 
                src="/images/setup.jpg" 
                alt="Fashion Model" 
                className="w-full h-full object-cover"
              />
              {/* Cerope Logo Overlay */}
              <div className="absolute top-4 right-4 bg-white/60 backdrop-blur-sm rounded-md px-2 py-1.5 shadow-sm">
                <div className="flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-800">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-semibold text-gray-800 text-xs">Cerope</span>
                </div>
              </div>
            </div>

            {/* Country and City Fields - Desktop Only */}
            <div className="hidden md:block space-y-4 w-full lg:w-[360px]">
              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-normal text-gray-600 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent text-gray-900 bg-white"
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-normal text-gray-600 mb-2">
                  City
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-left text-gray-500 bg-white hover:bg-gray-50 transition-all flex items-center justify-between"
                  >
                    <span>{formData.city || 'Select location'}</span>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 1l4 4 4-4"/>
                    </svg>
                  </button>
                  
                  {showCityDropdown && formData.country.toLowerCase() === 'india' && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 w-full max-h-60 overflow-y-auto">
                      {indianCities.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, city }));
                            setShowCityDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md text-gray-700 text-sm"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;
