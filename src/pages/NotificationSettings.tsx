import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { BellIcon } from '@heroicons/react/24/outline';

const NotificationSettings: React.FC = () => {
  const { state, dispatch } = useNotification();
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAddEmail = () => {
    if (newEmail && !state.settings.emailRecipients.includes(newEmail)) {
      dispatch({
        type: 'UPDATE_SETTINGS',
        payload: {
          emailRecipients: [...state.settings.emailRecipients, newEmail],
        },
      });
      setNewEmail('');
    }
  };

  const handleAddPhone = () => {
    if (newPhone && !state.settings.smsRecipients.includes(newPhone)) {
      dispatch({
        type: 'UPDATE_SETTINGS',
        payload: {
          smsRecipients: [...state.settings.smsRecipients, newPhone],
        },
      });
      setNewPhone('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        emailRecipients: state.settings.emailRecipients.filter((e) => e !== email),
      },
    });
  };

  const handleRemovePhone = (phone: string) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        smsRecipients: state.settings.smsRecipients.filter((p) => p !== phone),
      },
    });
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Notification Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Configure your email and SMS notification preferences.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {/* Email Notifications */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Email Notifications</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Receive email notifications for important events.</p>
            </div>
            <div className="mt-5">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={state.settings.emailEnabled}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_SETTINGS',
                      payload: { emailEnabled: e.target.checked },
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label className="ml-2 block text-sm text-gray-900">Enable email notifications</label>
              </div>
            </div>
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700">Email Recipients</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Enter email address"
                />
                <button
                  type="button"
                  onClick={handleAddEmail}
                  className="ml-3 inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {state.settings.emailRecipients.map((email) => (
                  <div key={email} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                    <span className="text-sm text-gray-900">{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(email)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">SMS Notifications</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Receive SMS notifications for important events.</p>
            </div>
            <div className="mt-5">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={state.settings.smsEnabled}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_SETTINGS',
                      payload: { smsEnabled: e.target.checked },
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label className="ml-2 block text-sm text-gray-900">Enable SMS notifications</label>
              </div>
            </div>
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700">Phone Numbers</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Enter phone number"
                />
                <button
                  type="button"
                  onClick={handleAddPhone}
                  className="ml-3 inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {state.settings.smsRecipients.map((phone) => (
                  <div key={phone} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                    <span className="text-sm text-gray-900">{phone}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePhone(phone)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Threshold */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Low Stock Alerts</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Configure when to receive low stock notifications.</p>
            </div>
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
              <div className="mt-1">
                <input
                  type="number"
                  value={state.settings.lowStockThreshold}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_SETTINGS',
                      payload: { lowStockThreshold: Number(e.target.value) },
                    })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings; 