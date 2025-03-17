import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { saveAs } from 'file-saver';

const DataManagement: React.FC = () => {
  const { state, dispatch } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create a backup of the current data
  const handleBackup = () => {
    const backup = {
      data: state,
      version: '1.0',
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const fileName = `copper-shop-backup-${new Date().toISOString().split('T')[0]}.json`;
    saveAs(blob, fileName);
  };

  // Handle file selection for restore
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string);
        if (!backup.version || !backup.data) {
          alert('Invalid backup file format');
          return;
        }

        // Restore the data
        localStorage.setItem('appState', JSON.stringify(backup.data));
        window.location.reload(); // Reload to apply the restored data
      } catch (error) {
        alert('Error restoring backup: Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  // Export all data as JSON
  const handleExport = () => {
    const exportData = {
      data: state,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    saveAs(blob, 'copper-shop-export.json');
  };

  // Import data from JSON
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (!importedData.data) {
          alert('Invalid import file format');
          return;
        }

        localStorage.setItem('appState', JSON.stringify(importedData.data));
        window.location.reload();
      } catch (error) {
        alert('Error importing data: Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  // Clear all data
  const handleClearData = () => {
    if (showConfirm) {
      localStorage.removeItem('appState');
      window.location.reload();
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Data Management</h2>
      <div className="space-y-4">
        {/* Backup & Restore */}
        <div className="flex space-x-4">
          <button
            onClick={handleBackup}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Backup
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Restore Backup
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".json"
            className="hidden"
          />
        </div>

        {/* Export & Import */}
        <div className="flex space-x-4">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Export Data
          </button>
          <div className="relative">
            <button
              onClick={() => document.getElementById('importFile')?.click()}
              className="inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Import Data
            </button>
            <input
              id="importFile"
              type="file"
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* Clear Data */}
        <div className="border-t pt-4">
          <button
            onClick={handleClearData}
            className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {showConfirm ? 'Click again to confirm' : 'Clear All Data'}
          </button>
          {showConfirm && (
            <span className="ml-2 text-sm text-red-600">
              Warning: This action cannot be undone!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataManagement; 