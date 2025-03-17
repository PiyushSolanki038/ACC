import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import WorkerAttendance from '../components/WorkerAttendance';
import { saveAs } from 'file-saver';
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

const Workers: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isAddingWorker, setIsAddingWorker] = useState(false);
  const [newWorker, setNewWorker] = useState({
    name: '',
    role: '',
    phone: '',
    salary: '',
    joiningDate: new Date().toISOString().split('T')[0],
  });

  const handleAddWorker = () => {
    if (!newWorker.name || !newWorker.role || !newWorker.phone || !newWorker.salary) {
      alert('Please fill in all fields');
      return;
    }

    dispatch({
      type: 'ADD_WORKER',
      payload: {
        id: `WRK${state.workers.length + 1}`.padStart(6, '0'),
        name: newWorker.name,
        role: newWorker.role,
        phone: newWorker.phone,
        salary: parseFloat(newWorker.salary),
        joiningDate: newWorker.joiningDate,
        status: 'Active',
        attendance: [],
      },
    });

    setIsAddingWorker(false);
    setNewWorker({
      name: '',
      role: '',
      phone: '',
      salary: '',
      joiningDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleDeleteWorker = (workerId: string) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      dispatch({
        type: 'DELETE_WORKER',
        payload: workerId,
      });
    }
  };

  const handleExportToExcel = () => {
    // Prepare CSV data
    const headers = ['ID', 'Name', 'Role', 'Phone', 'Salary', 'Joining Date', 'Status', 'Present Days', 'Half Days', 'Absent Days'];
    const rows = state.workers.map(worker => [
      worker.id,
      worker.name,
      worker.role,
      worker.phone,
      worker.salary,
      worker.joiningDate,
      worker.status,
      worker.attendance.filter(a => a.status === 'Present').length,
      worker.attendance.filter(a => a.status === 'Half Day').length,
      worker.attendance.filter(a => a.status === 'Absent').length,
    ]);

    // Convert to CSV format
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'workers_list.csv');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Worker Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleExportToExcel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export to Excel
          </button>
          <button
            onClick={() => setIsAddingWorker(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Worker
          </button>
        </div>
      </div>

      {/* Add Worker Modal */}
      {isAddingWorker && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Worker</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newWorker.name}
                  onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  value={newWorker.role}
                  onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={newWorker.phone}
                  onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Salary</label>
                <input
                  type="number"
                  value={newWorker.salary}
                  onChange={(e) => setNewWorker({ ...newWorker, salary: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Joining Date</label>
                <input
                  type="date"
                  value={newWorker.joiningDate}
                  onChange={(e) => setNewWorker({ ...newWorker, joiningDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddingWorker(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddWorker}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Add Worker
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Worker List */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Worker List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.workers.map((worker) => (
                  <tr key={worker.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {worker.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {worker.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {worker.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{worker.salary.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        worker.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {worker.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDeleteWorker(worker.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Attendance Section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <WorkerAttendance />
        
        {/* Today's Attendance Summary */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Today's Attendance Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600">Present</span>
                </div>
                <span className="font-medium text-gray-900">
                  {state.workers.filter(w => 
                    w.attendance.some(a => 
                      a.date === new Date().toISOString().split('T')[0] && 
                      a.status === 'Present'
                    )
                  ).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-gray-600">Half Day</span>
                </div>
                <span className="font-medium text-gray-900">
                  {state.workers.filter(w => 
                    w.attendance.some(a => 
                      a.date === new Date().toISOString().split('T')[0] && 
                      a.status === 'Half Day'
                    )
                  ).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-gray-600">Absent</span>
                </div>
                <span className="font-medium text-gray-900">
                  {state.workers.filter(w => 
                    w.attendance.some(a => 
                      a.date === new Date().toISOString().split('T')[0] && 
                      a.status === 'Absent'
                    )
                  ).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workers; 