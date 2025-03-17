import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

// Add type definitions for Google API
declare global {
  interface Window {
    gapi: any;
  }
}

interface BackupMetadata {
  id: string;
  timestamp: string;
  version: string;
  encrypted: boolean;
}

interface DriveFile {
  id: string;
  name: string;
  createdTime: string;
}

// Utility functions for encryption/decryption
const getKeyMaterial = async (password: string) => {
  const enc = new TextEncoder();
  return await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
};

const getKey = async (keyMaterial: CryptoKey, salt: Uint8Array) => {
  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

const encryptData = async (data: string, password: string): Promise<string> => {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    enc.encode(data)
  );

  // Combine the salt, iv, and encrypted data
  const encryptedArray = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  encryptedArray.set(salt, 0);
  encryptedArray.set(iv, salt.length);
  encryptedArray.set(new Uint8Array(encrypted), salt.length + iv.length);

  return btoa(String.fromCharCode(...Array.from(encryptedArray)));
};

const decryptData = async (encryptedData: string, password: string): Promise<string> => {
  const encryptedArray = new Uint8Array(
    atob(encryptedData).split('').map(char => char.charCodeAt(0))
  );

  const salt = encryptedArray.slice(0, 16);
  const iv = encryptedArray.slice(16, 28);
  const data = encryptedArray.slice(28);

  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    data
  );

  return new TextDecoder().decode(decrypted);
};

const CloudBackup: React.FC = () => {
  const { state } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [backupPassword, setBackupPassword] = useState('');
  const [restorePassword, setRestorePassword] = useState('');
  const [autoBackup, setAutoBackup] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [backupList, setBackupList] = useState<BackupMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Google Drive API
  useEffect(() => {
    const initGoogleDrive = async () => {
      try {
        await window.gapi.client.init({
          apiKey: process.env.REACT_APP_GOOGLE_DRIVE_API_KEY,
          clientId: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
          scope: 'https://www.googleapis.com/auth/drive.file',
        });

        const isSignedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();
        setIsAuthenticated(isSignedIn);

        window.gapi.auth2.getAuthInstance().isSignedIn.listen((signedIn: boolean) => {
          setIsAuthenticated(signedIn);
        });
      } catch (error) {
        setError('Failed to initialize Google Drive');
      }
    };

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client:auth2', initGoogleDrive);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAuth = async () => {
    try {
      await window.gapi.auth2.getAuthInstance().signIn();
    } catch (error) {
      setError('Authentication failed');
    }
  };

  const createEncryptedBackup = async (): Promise<string | null> => {
    if (!backupPassword) {
      setError('Please set a backup password');
      return null;
    }

    const backupData = {
      data: state,
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        encrypted: true,
      },
    };

    try {
      return await encryptData(JSON.stringify(backupData), backupPassword);
    } catch (error) {
      setError('Failed to encrypt backup data');
      return null;
    }
  };

  const uploadBackup = async () => {
    try {
      setLoading(true);
      setError(null);

      const encryptedData = await createEncryptedBackup();
      if (!encryptedData) return;

      const fileName = `copper-shop-backup-${new Date().toISOString()}.enc`;
      const file = new Blob([encryptedData], { type: 'application/octet-stream' });

      await window.gapi.client.drive.files.create({
        resource: {
          name: fileName,
          mimeType: 'application/octet-stream',
          parents: ['appDataFolder'],
        },
        media: {
          mimeType: 'application/octet-stream',
          body: file,
        },
      });

      setLastBackup(new Date().toISOString());
      setError(null);
    } catch (error) {
      setError('Failed to upload backup');
    } finally {
      setLoading(false);
    }
  };

  const listBackups = async () => {
    try {
      setLoading(true);
      const response = await window.gapi.client.drive.files.list({
        spaces: 'appDataFolder',
        fields: 'files(id, name, createdTime)',
        orderBy: 'createdTime desc',
      });

      const files = response.result.files || [];
      const backups = files.map((file: any) => ({
        id: file.id,
        timestamp: file.createdTime,
        version: '1.0',
        encrypted: true,
      }));

      setBackupList(backups);
    } catch (error) {
      setError('Failed to list backups');
    } finally {
      setLoading(false);
    }
  };

  const restoreBackup = async (fileId: string) => {
    if (!restorePassword) {
      setError('Please enter the backup password');
      return;
    }

    try {
      setLoading(true);
      const response = await window.gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media',
      });

      try {
        const decrypted = await decryptData(response.body, restorePassword);
        const backupData = JSON.parse(decrypted);

        if (!backupData.data || !backupData.metadata) {
          throw new Error('Invalid backup format');
        }

        localStorage.setItem('appState', JSON.stringify(backupData.data));
        window.location.reload();
      } catch (error) {
        setError('Invalid password or corrupted backup');
      }
    } catch (error) {
      setError('Failed to restore backup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Cloud Backup</h2>
      
      {/* Authentication */}
      {!isAuthenticated ? (
        <button
          onClick={handleAuth}
          className="mb-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Connect Google Drive
        </button>
      ) : (
        <div className="space-y-6">
          {/* Backup Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Backup Password</label>
              <input
                type="password"
                value={backupPassword}
                onChange={(e) => setBackupPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter password to encrypt backup"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={autoBackup}
                onChange={(e) => setAutoBackup(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Enable automatic daily backup
              </label>
            </div>

            <button
              onClick={uploadBackup}
              disabled={loading || !backupPassword}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Creating Backup...' : 'Create Backup Now'}
            </button>
          </div>

          {/* Restore Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Restore from Backup</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Restore Password</label>
                <input
                  type="password"
                  value={restorePassword}
                  onChange={(e) => setRestorePassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Enter password to decrypt backup"
                />
              </div>

              <button
                onClick={listBackups}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Refresh Backup List
              </button>

              {/* Backup List */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Available Backups</h4>
                <div className="space-y-2">
                  {backupList.map((backup) => (
                    <div
                      key={backup.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(backup.timestamp).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Version {backup.version}</p>
                      </div>
                      <button
                        onClick={() => restoreBackup(backup.id)}
                        disabled={loading || !restorePassword}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {error && (
        <div className="mt-4 p-4 rounded-md bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Last Backup Status */}
      {lastBackup && (
        <div className="mt-4 p-4 rounded-md bg-green-50">
          <p className="text-sm text-green-700">
            Last backup: {new Date(lastBackup).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default CloudBackup; 