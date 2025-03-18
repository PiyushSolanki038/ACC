import { AppState } from '../context/AppContext';
import * as XLSX from 'xlsx';

export const createBackup = async (state: AppState, format: 'json' | 'csv' | 'excel', location: string) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupData = {
      timestamp,
      version: '1.0',
      data: state
    };

    switch (format) {
      case 'json':
        await createJsonBackup(backupData, timestamp);
        break;
      case 'csv':
        await createCsvBackup(backupData, timestamp);
        break;
      case 'excel':
        await createExcelBackup(backupData, timestamp);
        break;
    }

    return true;
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
};

const createJsonBackup = async (data: any, timestamp: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const fileName = `backup_${timestamp}.json`;
  
  try {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('JSON backup failed:', error);
    throw error;
  }
};

const createCsvBackup = async (data: any, timestamp: string) => {
  const csvData = convertToCSV(data);
  const blob = new Blob([csvData], { type: 'text/csv' });
  const fileName = `backup_${timestamp}.csv`;
  
  try {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('CSV backup failed:', error);
    throw error;
  }
};

const createExcelBackup = async (data: any, timestamp: string) => {
  const workbook = XLSX.utils.book_new();
  
  // Add different sheets for different data types
  Object.entries(data.data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const worksheet = XLSX.utils.json_to_sheet(value);
      XLSX.utils.book_append_sheet(workbook, worksheet, key);
    }
  });

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const fileName = `backup_${timestamp}.xlsx`;
  
  try {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Excel backup failed:', error);
    throw error;
  }
};

const convertToCSV = (data: any): string => {
  const rows: string[] = [];
  
  // Add header row
  rows.push('Category,Field,Value');
  
  // Convert nested object to CSV rows
  const flattenObject = (obj: any, prefix = '') => {
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null) {
        flattenObject(value, newKey);
      } else {
        rows.push(`${newKey},${value}`);
      }
    });
  };
  
  flattenObject(data);
  return rows.join('\n');
}; 