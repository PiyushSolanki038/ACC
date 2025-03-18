import React, { createContext, useContext, useReducer, useEffect } from 'react';
<<<<<<< HEAD
import { AuthState, User, LoginCredentials, PasswordResetRequest, PasswordReset } from '../types/user';
=======
import { AuthState, User, LoginCredentials, PasswordResetRequest, PasswordReset, UserRole } from '../types/user';
>>>>>>> c4b8260 (Initial commit)

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'RESET_PASSWORD_START' }
  | { type: 'RESET_PASSWORD_SUCCESS' }
  | { type: 'RESET_PASSWORD_FAILURE'; payload: string };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const AuthContext = createContext<{
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (data: PasswordReset) => Promise<void>;
} | null>(null);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return initialState;
    case 'RESET_PASSWORD_START':
      return { ...state, isLoading: true, error: null };
    case 'RESET_PASSWORD_SUCCESS':
      return { ...state, isLoading: false, error: null };
    case 'RESET_PASSWORD_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for stored auth token on mount
    const token = localStorage.getItem('authToken');
    if (token) {
      // TODO: Validate token with backend
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
<<<<<<< HEAD
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid credentials');
      }

      const user = await response.json();
      localStorage.setItem('authToken', user.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
=======
      // For development, simulate a successful login
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: 'Test User',
        role: 'owner' as UserRole,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // In production, replace with actual API call
      // const response = await fetch('http://localhost:5000/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials),
      // });

      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.message || 'Invalid credentials');
      // }

      // const user = await response.json();
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
>>>>>>> c4b8260 (Initial commit)
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: (error as Error).message });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const requestPasswordReset = async (email: string) => {
    try {
      dispatch({ type: 'RESET_PASSWORD_START' });
      
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/reset-password-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to request password reset');
      }

      dispatch({ type: 'RESET_PASSWORD_SUCCESS' });
    } catch (error) {
      dispatch({ type: 'RESET_PASSWORD_FAILURE', payload: (error as Error).message });
      throw error;
    }
  };

  const resetPassword = async (data: PasswordReset) => {
    try {
      dispatch({ type: 'RESET_PASSWORD_START' });
      
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      dispatch({ type: 'RESET_PASSWORD_SUCCESS' });
    } catch (error) {
      dispatch({ type: 'RESET_PASSWORD_FAILURE', payload: (error as Error).message });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 