import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const WorkerAttendance: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedWorker, setSelectedWorker] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState<'Present' | 'Absent' | 'Half Day'>('Present');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  const handleMarkAttendance = () => {
    if (!selectedWorker) {
      setMessage('Please select a worker');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    
    dispatch({
      type: 'MARK_ATTENDANCE',
      payload: {
        workerId: selectedWorker,
        attendance: {
          date: today,
          status: attendanceStatus,
          checkIn: attendanceStatus === 'Present' ? checkIn : undefined,
          checkOut: attendanceStatus === 'Present' ? checkOut : undefined,
          notes: notes || undefined,
        },
      },
    });

    setMessage('Attendance marked successfully!');
    // Reset form
    setCheckIn('');
    setCheckOut('');
    setNotes('');
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Mark Attendance</h2>
      
      <div className="space-y-4">
        {/* Worker Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Worker</label>
          <select
            value={selectedWorker}
            onChange={(e) => setSelectedWorker(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">Select a worker</option>
            {state.workers.map((worker) => (
              <option key={worker.id} value={worker.id}>
                {worker.name}
              </option>
            ))}
          </select>
        </div>

        {/* Attendance Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Attendance Status</label>
          <select
            value={attendanceStatus}
            onChange={(e) => setAttendanceStatus(e.target.value as 'Present' | 'Absent' | 'Half Day')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="Present">Present</option>
            <option value="Half Day">Half Day</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        {/* Check In Time (only for Present status) */}
        {attendanceStatus === 'Present' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Check In Time</label>
            <input
              type="time"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        )}

        {/* Check Out Time (only for Present status) */}
        {attendanceStatus === 'Present' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Check Out Time</label>
            <input
              type="time"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Add any notes about attendance..."
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            onClick={handleMarkAttendance}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Mark Attendance
          </button>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mt-4 p-4 rounded-md bg-green-50 text-green-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerAttendance; 