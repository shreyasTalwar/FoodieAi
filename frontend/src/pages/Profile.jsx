import React, { useState, useEffect } from 'react';
import { IoPersonOutline, IoKeyOutline, IoMailOutline, IoLockClosedOutline } from 'react-icons/io5';
import api from '../api';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setUsername(res.data.username);
      setEmail(res.data.email);
    } catch (err) {
      console.error(err);
      setError('Could not load profile details.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (password && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setIsLoading(true);
    try {
      const payload = { username, email };
      if (password) payload.password = password;
      
      const res = await api.put('/profile', payload);
      setMessage('Profile updated successfully.');
      setPassword('');
      setConfirmPassword('');
      
      // Update saved username in context/localStorage if needed
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="rounded-3xl glass-panel border border-white/10 p-8 flex flex-col gap-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-rose-600/20 text-rose-500 flex items-center justify-center text-3xl mx-auto mb-4 border border-rose-500/20">
            <IoPersonOutline />
          </div>
          <h2 className="text-2xl font-black text-white">Your Profile</h2>
          <p className="text-sm text-gray-400 mt-1">Manage your account information and password</p>
        </div>

        {message && (
          <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
            ✅ {message}
          </div>
        )}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Username</label>
            <div className="relative">
              <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-sm text-white"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-sm text-white"
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="border-t border-white/5 pt-4 mt-2">
            <h3 className="text-sm font-bold text-rose-400 mb-4 flex items-center gap-2">
              <IoKeyOutline /> Change Password (Optional)
            </h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep same"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Leave blank to keep same"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-sm text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl glow-button text-white font-bold text-sm transition mt-4 cursor-pointer"
          >
            {isLoading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
