import React, { useState, useEffect } from 'react';
import { useApp, useTheme } from '../context/AppContext';
import type { Settings as SettingsState } from '../context/AppContext';
import {
  Cog6ToothIcon,
  BanknotesIcon,
  DocumentTextIcon,
  BellIcon,
  CloudArrowUpIcon,
  UserIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import DataManagement from '../components/DataManagement';
import CloudBackup from '../components/CloudBackup';

const defaultSettings: SettingsState = {
  general: {
    companyName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    currency: 'INR',
    language: 'en',
  },
  financial: {
    gstRate: 18,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    defaultTaxRate: 18,
    financialYearStart: '04-01',
    financialYearEnd: '03-31',
  },
  invoice: {
    prefix: 'INV',
    startingNumber: 1,
    termsAndConditions: '',
    dueDatePeriod: 30,
    showLogo: true,
    defaultTemplate: 'standard',
  },
  notifications: {
    emailNotifications: true,
    dueDateReminders: true,
    paymentReminders: true,
    lowStockAlerts: true,
    reminderDays: 3,
  },
  appearance: {
    theme: 'light',
    primaryColor: '#4F46E5',
    compactMode: false,
  },
};

const Settings: React.FC = () => {
  const { state, dispatch } = useApp();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SettingsState>(state.settings || defaultSettings);
  const [isDirty, setIsDirty] = useState(false);

  // Update local state when context settings change
  useEffect(() => {
    if (state.settings) {
      setSettings(state.settings);
    }
  }, [state.settings]);

  const handleSettingChange = (category: keyof SettingsState, field: string, value: any) => {
    setIsDirty(true);
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));

    // Handle theme change immediately
    if (category === 'appearance' && field === 'theme') {
      setTheme(value as 'light' | 'dark' | 'system');
    }
  };

  const saveSettings = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: settings,
    });
    setIsDirty(false);
    // Show success notification
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'financial', name: 'Financial', icon: BanknotesIcon },
    { id: 'invoice', name: 'Invoice & Bills', icon: DocumentTextIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'backup', name: 'Backup & Data', icon: CloudArrowUpIcon },
    { id: 'appearance', name: 'Appearance', icon: UserIcon },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Fixed Header Section */}
      <div className={`fixed top-0 left-0 right-0 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } z-20 border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Copper Shop
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow rounded-lg`}>
            <div className={`sticky top-16 z-10 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } rounded-t-lg`}>
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-8">
                  <h1 className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Settings
                  </h1>
                  <button
                    onClick={saveSettings}
                    disabled={!isDirty}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isDirty
                        ? 'bg-primary-600 hover:bg-primary-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                  >
                    {isDirty ? 'Save Changes' : 'No Changes'}
                  </button>
                </div>

                <div className={`border-b ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          ${activeTab === tab.id
                            ? 'border-primary-500 text-primary-600'
                            : theme === 'dark'
                              ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }
                          whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                        `}
                      >
                        <tab.icon className="h-5 w-5 mr-2" />
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">Company Information</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input
                          type="text"
                          value={settings.general.companyName}
                          onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea
                          value={settings.general.address}
                          onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                          type="tel"
                          value={settings.general.phone}
                          onChange={(e) => handleSettingChange('general', 'phone', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={settings.general.email}
                          onChange={(e) => handleSettingChange('general', 'email', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Website</label>
                        <input
                          type="url"
                          value={settings.general.website}
                          onChange={(e) => handleSettingChange('general', 'website', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Currency</label>
                        <select
                          value={settings.general.currency}
                          onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="INR">Indian Rupee (₹)</option>
                          <option value="USD">US Dollar ($)</option>
                          <option value="EUR">Euro (€)</option>
                          <option value="GBP">British Pound (£)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'financial' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">Tax & Financial Settings</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">GST Rate (%)</label>
                        <input
                          type="number"
                          value={settings.financial.gstRate}
                          onChange={(e) => handleSettingChange('financial', 'gstRate', parseFloat(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">CGST Rate (%)</label>
                        <input
                          type="number"
                          value={settings.financial.cgstRate}
                          onChange={(e) => handleSettingChange('financial', 'cgstRate', parseFloat(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">SGST Rate (%)</label>
                        <input
                          type="number"
                          value={settings.financial.sgstRate}
                          onChange={(e) => handleSettingChange('financial', 'sgstRate', parseFloat(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">IGST Rate (%)</label>
                        <input
                          type="number"
                          value={settings.financial.igstRate}
                          onChange={(e) => handleSettingChange('financial', 'igstRate', parseFloat(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Financial Year Start</label>
                        <input
                          type="date"
                          value={settings.financial.financialYearStart}
                          onChange={(e) => handleSettingChange('financial', 'financialYearStart', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Financial Year End</label>
                        <input
                          type="date"
                          value={settings.financial.financialYearEnd}
                          onChange={(e) => handleSettingChange('financial', 'financialYearEnd', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'invoice' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">Invoice & Bill Settings</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Invoice Prefix</label>
                        <input
                          type="text"
                          value={settings.invoice.prefix}
                          onChange={(e) => handleSettingChange('invoice', 'prefix', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Starting Number</label>
                        <input
                          type="number"
                          value={settings.invoice.startingNumber}
                          onChange={(e) => handleSettingChange('invoice', 'startingNumber', parseInt(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Default Due Date Period (days)</label>
                        <input
                          type="number"
                          value={settings.invoice.dueDatePeriod}
                          onChange={(e) => handleSettingChange('invoice', 'dueDatePeriod', parseInt(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Default Template</label>
                        <select
                          value={settings.invoice.defaultTemplate}
                          onChange={(e) => handleSettingChange('invoice', 'defaultTemplate', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="standard">Standard</option>
                          <option value="professional">Professional</option>
                          <option value="minimal">Minimal</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Terms and Conditions</label>
                        <textarea
                          value={settings.invoice.termsAndConditions}
                          onChange={(e) => handleSettingChange('invoice', 'termsAndConditions', e.target.value)}
                          rows={4}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.invoice.showLogo}
                            onChange={(e) => handleSettingChange('invoice', 'showLogo', e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Show Company Logo on Invoices</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
    <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.emailNotifications}
                            onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Enable Email Notifications</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.dueDateReminders}
                            onChange={(e) => handleSettingChange('notifications', 'dueDateReminders', e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Due Date Reminders</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.paymentReminders}
                            onChange={(e) => handleSettingChange('notifications', 'paymentReminders', e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Payment Reminders</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.lowStockAlerts}
                            onChange={(e) => handleSettingChange('notifications', 'lowStockAlerts', e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Low Stock Alerts</span>
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Reminder Days Before Due Date</label>
                        <input
                          type="number"
                          value={settings.notifications.reminderDays}
                          onChange={(e) => handleSettingChange('notifications', 'reminderDays', parseInt(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'backup' && (
                  <div className="space-y-6">
      <CloudBackup />
      <DataManagement />
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <h2 className={`text-lg font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Appearance Settings
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className={`block text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                          Theme
                        </label>
                        <select
                          value={settings.appearance.theme}
                          onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'border-gray-300 text-gray-900'
                          }`}
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                          Primary Color
                        </label>
                        <input
                          type="color"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                          className={`mt-1 block w-full h-10 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`flex items-center ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                          <input
                            type="checkbox"
                            checked={settings.appearance.compactMode}
                            onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                            className={`rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                              theme === 'dark'
                                ? 'bg-gray-700 border-gray-600'
                                : 'border-gray-300'
                            }`}
                          />
                          <span className={`ml-2 text-sm ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                          }`}>
                            Compact Mode
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 