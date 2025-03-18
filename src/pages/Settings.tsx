import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
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
=======
import { useApp } from '../context/AppContext';
import { Tab } from '@headlessui/react';
import { classNames } from '../utils/helpers';
import type { Settings as SettingsType } from '../context/AppContext';
import { Switch } from '@headlessui/react';
import { createBackup } from '../utils/backup';

const tabs = [
  { name: 'General', icon: '⚙️' },
  { name: 'Financial', icon: '💰' },
  { name: 'Invoice', icon: '📄' },
  { name: 'Notifications', icon: '🔔' },
  { name: 'Backup', icon: '💾' },
];

const defaultSettings: SettingsType = {
>>>>>>> c4b8260 (Initial commit)
  general: {
    companyName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    currency: 'INR',
<<<<<<< HEAD
    language: 'en',
=======
>>>>>>> c4b8260 (Initial commit)
  },
  financial: {
    gstRate: 18,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
<<<<<<< HEAD
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
=======
    financialYearStart: '2024-04-01',
    financialYearEnd: '2025-03-31',
  },
  invoice: {
    prefix: 'INV',
    startingNumber: 1001,
    termsAndConditions: '',
    template: 'default',
    showLogo: true,
  },
  notifications: {
    emailNotifications: true,
    paymentReminders: true,
    reminderDays: 7,
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '00:00',
    retentionDays: 30,
    backupLocation: '',
    backupFormat: 'json',
>>>>>>> c4b8260 (Initial commit)
  },
};

const Settings: React.FC = () => {
  const { state, dispatch } = useApp();
<<<<<<< HEAD
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SettingsState>(state.settings || defaultSettings);
  const [isDirty, setIsDirty] = useState(false);

  // Update local state when context settings change
=======
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);
  const [isDirty, setIsDirty] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupStatus, setBackupStatus] = useState<string>('');

>>>>>>> c4b8260 (Initial commit)
  useEffect(() => {
    if (state.settings) {
      setSettings(state.settings);
    }
  }, [state.settings]);

<<<<<<< HEAD
  const handleSettingChange = (category: keyof SettingsState, field: string, value: any) => {
    setIsDirty(true);
    setSettings(prev => ({
=======
  const handleSettingChange = (category: keyof SettingsType, field: string, value: any) => {
    setSettings((prev) => ({
>>>>>>> c4b8260 (Initial commit)
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
<<<<<<< HEAD

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
=======
    setIsDirty(true);
  };

  const saveSettings = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    setIsDirty(false);
  };

  const handleBrowseClick = async () => {
    try {
      // Check if the File System Access API is supported
      if ('showDirectoryPicker' in window) {
        const dirHandle = await window.showDirectoryPicker({
          mode: 'readwrite',
          startIn: 'documents'
        });
        
        // Get the directory path
        const path = dirHandle.name;
        handleSettingChange('backup', 'backupLocation', path);
      } else {
        // Fallback for browsers that don't support the File System Access API
        const input = document.createElement('input');
        input.type = 'text';
        input.value = settings.backup.backupLocation;
        input.onchange = (e) => {
          handleSettingChange('backup', 'backupLocation', (e.target as HTMLInputElement).value);
        };
        input.click();
      }
    } catch (err) {
      console.error('Error selecting directory:', err);
      // Fallback to text input if directory picker fails
      const input = document.createElement('input');
      input.type = 'text';
      input.value = settings.backup.backupLocation;
      input.onchange = (e) => {
        handleSettingChange('backup', 'backupLocation', (e.target as HTMLInputElement).value);
      };
      input.click();
    }
  };

  const handleBackup = async () => {
    if (!settings.backup.backupLocation) {
      setBackupStatus('Please select a backup location first');
      return;
    }

    setIsBackingUp(true);
    setBackupStatus('Creating backup...');

    try {
      await createBackup(
        state,
        settings.backup.backupFormat,
        settings.backup.backupLocation
      );
      setBackupStatus('Backup created successfully!');
    } catch (error) {
      console.error('Backup failed:', error);
      setBackupStatus('Backup failed. Please try again.');
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
              <button
                onClick={saveSettings}
                disabled={!isDirty}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  isDirty
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isDirty ? 'Save Changes' : 'No Changes'}
              </button>
            </div>

            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                        selected
                          ? 'bg-white text-primary-700 shadow'
                          : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary-600'
                      )
                    }
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-6">
                {/* General Settings */}
                <Tab.Panel>
                  <div className="space-y-6">
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
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
>>>>>>> c4b8260 (Initial commit)
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
<<<<<<< HEAD
=======
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
>>>>>>> c4b8260 (Initial commit)
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
<<<<<<< HEAD
                          <option value="GBP">British Pound (£)</option>
=======
>>>>>>> c4b8260 (Initial commit)
                        </select>
                      </div>
                    </div>
                  </div>
<<<<<<< HEAD
                )}

                {activeTab === 'financial' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">Tax & Financial Settings</h2>
=======
                </Tab.Panel>

                {/* Financial Settings */}
                <Tab.Panel>
                  <div className="space-y-6">
>>>>>>> c4b8260 (Initial commit)
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
<<<<<<< HEAD
=======
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
>>>>>>> c4b8260 (Initial commit)
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
<<<<<<< HEAD
=======
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
>>>>>>> c4b8260 (Initial commit)
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
<<<<<<< HEAD
                )}

                {activeTab === 'invoice' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">Invoice & Bill Settings</h2>
=======
                </Tab.Panel>

                {/* Invoice Settings */}
                <Tab.Panel>
                  <div className="space-y-6">
>>>>>>> c4b8260 (Initial commit)
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
<<<<<<< HEAD
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
=======
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Terms and Conditions</label>
                      <textarea
                        value={settings.invoice.termsAndConditions}
                        onChange={(e) => handleSettingChange('invoice', 'termsAndConditions', e.target.value)}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Template</label>
                        <select
                          value={settings.invoice.template}
                          onChange={(e) => handleSettingChange('invoice', 'template', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="default">Default</option>
                          <option value="modern">Modern</option>
                          <option value="classic">Classic</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Show Logo</label>
                        <div className="mt-2">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.invoice.showLogo}
                              onChange={(e) => handleSettingChange('invoice', 'showLogo', e.target.checked)}
                              className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Show company logo on invoices</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                {/* Notification Settings */}
                <Tab.Panel>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
                      <div className="mt-2">
                        <label className="inline-flex items-center">
>>>>>>> c4b8260 (Initial commit)
                          <input
                            type="checkbox"
                            checked={settings.notifications.emailNotifications}
                            onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
<<<<<<< HEAD
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
=======
                          <span className="ml-2 text-sm text-gray-700">Enable email notifications</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Reminders</label>
                      <div className="mt-2">
                        <label className="inline-flex items-center">
>>>>>>> c4b8260 (Initial commit)
                          <input
                            type="checkbox"
                            checked={settings.notifications.paymentReminders}
                            onChange={(e) => handleSettingChange('notifications', 'paymentReminders', e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
<<<<<<< HEAD
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
=======
                          <span className="ml-2 text-sm text-gray-700">Enable payment reminders</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reminder Days</label>
                      <input
                        type="number"
                        value={settings.notifications.reminderDays}
                        onChange={(e) => handleSettingChange('notifications', 'reminderDays', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </Tab.Panel>

                {/* Backup Settings */}
                <Tab.Panel>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Automatic Backup</h3>
                        <p className="text-sm text-gray-500">Enable automatic backup of your data</p>
                      </div>
                      <Switch
                        checked={settings.backup.autoBackup}
                        onChange={(checked) => handleSettingChange('backup', 'autoBackup', checked)}
                      />
                    </div>

                    {settings.backup.autoBackup && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Backup Location</label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                              type="text"
                              value={settings.backup.backupLocation}
                              onChange={(e) => handleSettingChange('backup', 'backupLocation', e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              placeholder="Enter backup location path"
                              readOnly
                            />
                            <button
                              type="button"
                              onClick={handleBrowseClick}
                              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Browse
                            </button>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">Select a directory to store your backup files</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Backup Format</label>
                          <select
                            value={settings.backup.backupFormat}
                            onChange={(e) => handleSettingChange('backup', 'backupFormat', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          >
                            <option value="json">JSON (Recommended)</option>
                            <option value="csv">CSV</option>
                            <option value="excel">Excel</option>
                          </select>
                          <p className="mt-1 text-sm text-gray-500">
                            {settings.backup.backupFormat === 'json' && 'Best for data integrity and easy restoration'}
                            {settings.backup.backupFormat === 'csv' && 'Good for spreadsheet compatibility'}
                            {settings.backup.backupFormat === 'excel' && 'Best for viewing and editing in Microsoft Excel'}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Backup Frequency</label>
                          <select
                            value={settings.backup.backupFrequency}
                            onChange={(e) => handleSettingChange('backup', 'backupFrequency', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Backup Time</label>
                          <input
                            type="time"
                            value={settings.backup.backupTime}
                            onChange={(e) => handleSettingChange('backup', 'backupTime', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Retention Period (days)</label>
                          <input
                            type="number"
                            value={settings.backup.retentionDays}
                            onChange={(e) => handleSettingChange('backup', 'retentionDays', parseInt(e.target.value))}
                            min="1"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>

                        <div className="pt-4">
                          <button
                            type="button"
                            onClick={handleBackup}
                            disabled={isBackingUp || !settings.backup.backupLocation}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                              isBackingUp || !settings.backup.backupLocation
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                            }`}
                          >
                            {isBackingUp ? 'Creating Backup...' : 'Create Backup Now'}
                          </button>
                          {backupStatus && (
                            <p className={`mt-2 text-sm ${
                              backupStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {backupStatus}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
>>>>>>> c4b8260 (Initial commit)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 