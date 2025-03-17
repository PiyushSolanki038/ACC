import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'email' | 'sms';
  title: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
  createdAt: string;
  recipient: string;
}

interface NotificationState {
  notifications: Notification[];
  settings: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    lowStockThreshold: number;
    emailRecipients: string[];
    smsRecipients: string[];
  };
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'UPDATE_NOTIFICATION'; payload: Notification }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<NotificationState['settings']> };

const initialState: NotificationState = {
  notifications: [],
  settings: {
    emailEnabled: true,
    smsEnabled: true,
    lowStockThreshold: 10,
    emailRecipients: [],
    smsRecipients: [],
  },
};

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'UPDATE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload.id ? action.payload : notification
        ),
      };
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((notification) => notification.id !== action.payload),
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

const NotificationContext = createContext<{
  state: NotificationState;
  dispatch: React.Dispatch<NotificationAction>;
} | null>(null);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}; 