import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/AppContext';
import { classNames } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { state, dispatch } = useApp();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: state.user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      // Here you would typically make an API call to update the user's profile
      // For now, we'll just simulate a successful update
      if (!state.user?.id) {
        throw new Error('User not found');
      }

      dispatch({
        type: 'UPDATE_USER',
        payload: {
          id: state.user.id,
          email: formData.email,
          name: state.user.name,
        }
      });

      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className={classNames(
      "min-h-screen py-8",
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
    )}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={classNames(
          "shadow rounded-lg",
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        )}>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className={classNames(
                "text-2xl font-bold",
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>Profile Settings</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className={classNames(
                    "px-4 py-2 rounded-md text-sm font-medium",
                    theme === 'dark'
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  )}
                >
                  Edit Profile
                </button>
              )}
            </div>

            {error && (
              <div className="mb-4 p-4 rounded-md bg-red-50 text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 rounded-md bg-green-50 text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className={classNames(
                  "block text-sm font-medium",
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={classNames(
                    "mt-1 block w-full rounded-md shadow-sm sm:text-sm",
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'border-gray-300',
                    !isEditing && 'bg-gray-50 text-gray-900'
                  )}
                />
              </div>

              {isEditing && (
                <>
                  <div>
                    <label htmlFor="currentPassword" className={classNames(
                      "block text-sm font-medium",
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className={classNames(
                        "mt-1 block w-full rounded-md shadow-sm sm:text-sm",
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'border-gray-300'
                      )}
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className={classNames(
                      "block text-sm font-medium",
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className={classNames(
                        "mt-1 block w-full rounded-md shadow-sm sm:text-sm",
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'border-gray-300'
                      )}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className={classNames(
                      "block text-sm font-medium",
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={classNames(
                        "mt-1 block w-full rounded-md shadow-sm sm:text-sm",
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'border-gray-300'
                      )}
                    />
                  </div>
                </>
              )}

              {isEditing && (
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        email: state.user?.email || '',
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                      setError('');
                      setSuccess('');
                    }}
                    className={classNames(
                      "px-4 py-2 rounded-md text-sm font-medium",
                      theme === 'dark'
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    )}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={classNames(
                      "px-4 py-2 rounded-md text-sm font-medium",
                      theme === 'dark'
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    )}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 