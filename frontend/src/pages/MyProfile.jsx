import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('👤');

  // Avatar options matching the image
  const avatarOptions = [
    '👨', '👨🏻', '👨🏼', '👨🏽', '👨🏾', '👨🏿',
    '👩', '👩🏻', '👩🏼', '👩🏾', '👩🏿', '🧔'
  ];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
  });   

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      if (response.data.success) {
        const userData = response.data.user;
        setProfileData(userData);
        
        // Parse name into first and last
        const nameParts = (userData.name || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Parse DOB if exists
        const dob = userData.preferences?.dob || '';
        const dobParts = dob.split('-');
        
        // Set avatar if exists
        if (userData.preferences?.profilePicture) {
          setSelectedAvatar(userData.preferences.profilePicture);
        } else if (userData.preferences?.avatar) {
          setSelectedAvatar(userData.preferences.avatar);
        }
        
        setFormData({
          firstName,
          lastName,
          phone: userData.phone || '',
          gender: userData.preferences?.gender || '',
          dobDay: dobParts[2] || '',
          dobMonth: dobParts[1] || '',
          dobYear: dobParts[0] || '',
        });
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const dob = formData.dobYear && formData.dobMonth && formData.dobDay 
        ? `${formData.dobYear}-${formData.dobMonth.padStart(2, '0')}-${formData.dobDay.padStart(2, '0')}`
        : '';
      
      const preferences = {
        gender: formData.gender,
        dob: dob,
        profilePicture: selectedAvatar,
      };

      const response = await api.put('/user/profile', {
        name: fullName,
        phone: formData.phone,
        preferences,
      });

      if (response.data.success) {
        setProfileData(response.data.user);
        updateUser(response.data.user);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setShowAvatarDropdown(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <img 
                src="/images/cerope-logo.jpg" 
                alt="Cerope Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-semibold text-gray-800">Cerope</span>
            </div>
            
            <div className="relative inline-block">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 via-cyan-400 via-green-400 via-yellow-400 via-orange-400 to-red-500 p-[3px]">
                <div className="w-full h-full rounded-full"></div>
              </div>
              <button className="relative px-6 py-1.5 rounded-full bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50 text-black text-sm font-bold hover:opacity-95 transition-opacity flex items-center gap-2 shadow-lg">
                <span>Explore More</span>
                <span className="text-base">✨</span>
              </button>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 border-b-2 border-blue-600 pb-1">Home</Link>
            <a href="#" className="text-black hover:text-gray-700 font-bold relative group">
              Know My Vibe
              <svg className="inline-block ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <a href="#" className="text-black hover:text-gray-700 font-bold">My Wardrobe</a>
            <a href="#" className="text-black hover:text-gray-700 font-bold">Ask AI Pal</a>
            <a href="#" className="text-black hover:text-gray-700 font-bold">Plan Outfit</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 via-yellow-200 to-pink-200 flex items-center justify-center text-2xl">
              {selectedAvatar}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Profile</h1>

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Form Fields */}
              <div className="flex-1 space-y-6">
                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      placeholder="Roshani"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      placeholder="Shah"
                    />
                  </div>
                </div>

                {/* Email ID and Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email ID
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={profileData?.email}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                      placeholder="Roshani123@gmail"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      placeholder="+91 9920587654"
                    />
                  </div>
                </div>

                {/* Gender and DOB */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Gender
                    </label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === 'male'}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Male</span>
                      </label>
                      
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === 'female'}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Female</span>
                      </label>
                      
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="other"
                          checked={formData.gender === 'other'}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Other</span>
                      </label>
                    </div>
                  </div>

                  {/* DOB */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DOB
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="dobDay"
                        value={formData.dobDay}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="01"
                        maxLength="2"
                        className="w-16 px-3 py-2.5 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                      <input
                        type="text"
                        name="dobMonth"
                        value={formData.dobMonth}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="10"
                        maxLength="2"
                        className="w-16 px-3 py-2.5 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                      <input
                        type="text"
                        name="dobYear"
                        value={formData.dobYear}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="2000"
                        maxLength="4"
                        className="w-24 px-3 py-2.5 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Picture */}
              <div className="lg:w-80 flex flex-col items-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-orange-200 via-yellow-100 to-pink-200 border-4 border-orange-300 flex items-center justify-center overflow-hidden shadow-lg text-8xl">
                  {selectedAvatar}
                </div>
                
                {isEditing && (
                  <div className="mt-6 relative">
                    <button
                      type="button"
                      onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                      Change Profile Picture
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 1l5 5 5-5"/>
                      </svg>
                    </button>
                    
                    {showAvatarDropdown && (
                      <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50 w-64">
                        <div className="grid grid-cols-6 gap-3">
                          {avatarOptions.map((avatar, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleAvatarSelect(avatar)}
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl hover:bg-gray-100 transition-all ${
                                selectedAvatar === avatar ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                              }`}
                            >
                              {avatar}
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAvatarDropdown(false)}
                          className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                        >
                          Select
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
