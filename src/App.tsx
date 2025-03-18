<<<<<<< HEAD
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { initializeTheme } from './utils/theme';
=======
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
>>>>>>> c4b8260 (Initial commit)
import './styles/global.css';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Clients from './pages/Clients';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Bills from './pages/Bills';
import Inventory from './pages/Inventory';
import Workers from './pages/Workers';
import Settings from './pages/Settings';
import { ProtectedRoute } from './components/ProtectedRoute';
<<<<<<< HEAD

const App: React.FC = () => {
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <AuthProvider>
      <AppProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <ProtectedRoute>
                <Layout>
                  <Invoices />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <Layout>
                  <Clients />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Layout>
                  <Expenses />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bills"
            element={
              <ProtectedRoute>
                <Layout>
                  <Bills />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Layout>
                  <Inventory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workers"
            element={
              <ProtectedRoute>
                <Layout>
                  <Workers />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
=======
import Register from './pages/Register';
import Profile from './pages/Profile';
import { useApp } from './context/AppContext';
import { useTheme } from './context/AppContext';

// Separate component to use hooks inside AppProvider
const AppContent: React.FC = () => {
  const { state: authState } = useAuth();
  const { dispatch: appDispatch } = useApp();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    // Initialize with light theme
    setTheme('light');
  }, [setTheme]);

  React.useEffect(() => {
    // Sync auth state with app state
    if (authState.user) {
      appDispatch({ type: 'SET_USER', payload: authState.user });
    } else {
      appDispatch({ type: 'CLEAR_USER' });
    }
  }, [authState.user, appDispatch]);

  return (
    <Routes>
      <Route path="/login" element={!authState.user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!authState.user ? <Register /> : <Navigate to="/" />} />
      <Route path="/" element={authState.user ? <Layout><Outlet /></Layout> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="clients" element={<Clients />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="reports" element={<Reports />} />
        <Route path="bills" element={<Bills />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="workers" element={<Workers />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
>>>>>>> c4b8260 (Initial commit)
      </AppProvider>
    </AuthProvider>
  );
};

export default App; 