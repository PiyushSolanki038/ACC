import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  category: 'Copper Wire' | 'Copper Sheet' | 'Copper Pipe' | 'Copper Fitting' | 'Copper Cotton Wire' | 'Electric Items' | 'Plastic Items' | 'Tools' | 'Other';
  unit: 'kg' | 'meter' | 'piece' | 'roll';
  pricePerUnit: string;
  currentStock: number;
  minimumStock: number;
  gstRate: number;
  lastUpdated: string;
  supplier?: string;
  location?: string;
  reorderPoint?: number;
  lastPurchaseDate?: string;
  lastPurchasePrice?: string;
}

export interface PurchaseOrder {
  id: string;
  supplierName: string;
  supplierContact: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  totalAmount: number;
  gstAmount: number;
  grandTotal: number;
  notes: string;
  date: string;
}

interface Invoice {
  id: string;
  client: string;
  amount: string;
  status: 'Pending' | 'Paid' | 'Overdue';
  date: string;
  dueDate?: string;
  notes?: string;
  items?: {
    description: string;
    quantity: number;
    price: string;
    amount: string;
  }[];
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  totalInvoices: number;
  totalAmount: string;
}

interface Expense {
  id: string;
  description: string;
  amount: string;
  date: string;
  status: 'Pending' | 'Paid';
  category: string;
}

export interface Bill {
  id: string;
  billNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  dueDate: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    gstAmount: number;
    totalAmount: number;
  }[];
  subTotal: number;
  totalGST: number;
  grandTotal: number;
  status: 'Pending' | 'Paid' | 'Overdue';
  notes: string;
}

interface Worker {
  id: string;
  name: string;
  role: string;
  phone: string;
  salary: number;
  joiningDate: string;
  status: 'Active' | 'Inactive';
  attendance: {
    date: string;
    status: 'Present' | 'Absent' | 'Half Day';
    checkIn?: string;
    checkOut?: string;
    notes?: string;
  }[];
}

export interface Settings {
  general: {
    companyName: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    currency: string;
    language: string;
  };
  financial: {
    gstRate: number;
    cgstRate: number;
    sgstRate: number;
    igstRate: number;
    defaultTaxRate: number;
    financialYearStart: string;
    financialYearEnd: string;
  };
  invoice: {
    prefix: string;
    startingNumber: number;
    termsAndConditions: string;
    dueDatePeriod: number;
    showLogo: boolean;
    defaultTemplate: string;
  };
  notifications: {
    emailNotifications: boolean;
    dueDateReminders: boolean;
    paymentReminders: boolean;
    lowStockAlerts: boolean;
    reminderDays: number;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    primaryColor: string;
    compactMode: boolean;
  };
}

interface AppState {
  invoices: Invoice[];
  clients: Client[];
  expenses: Expense[];
  products: Product[];
  purchaseOrders: PurchaseOrder[];
  bills: Bill[];
  workers: Worker[];
  settings: Settings;
}

export type AppAction =
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: Invoice }
  | { type: 'DELETE_INVOICE'; payload: string }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_PURCHASE_ORDER'; payload: PurchaseOrder }
  | { type: 'UPDATE_PURCHASE_ORDER'; payload: PurchaseOrder }
  | { type: 'DELETE_PURCHASE_ORDER'; payload: string }
  | { type: 'ADD_BILL'; payload: Bill }
  | { type: 'UPDATE_BILL'; payload: Bill }
  | { type: 'DELETE_BILL'; payload: string }
  | { type: 'ADD_WORKER'; payload: Worker }
  | { type: 'UPDATE_WORKER'; payload: Worker }
  | { type: 'DELETE_WORKER'; payload: string }
  | { type: 'MARK_ATTENDANCE'; payload: { workerId: string; attendance: Worker['attendance'][0] } }
  | { type: 'UPDATE_SETTINGS'; payload: Settings };

// Load initial state from localStorage or use default state
const loadInitialState = (): AppState => {
  const savedState = localStorage.getItem('appState');
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    // Ensure settings exist in the saved state
    return {
      ...parsedState,
      settings: parsedState.settings || {
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
      },
    };
  }
  return {
    invoices: [],
    clients: [
      {
        id: 'CLT001',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        status: 'Active',
        totalInvoices: 2,
        totalAmount: '$1,500.00',
      },
      {
        id: 'CLT002',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '0987654321',
        status: 'Active',
        totalInvoices: 1,
        totalAmount: '$750.00',
      },
    ],
    expenses: [],
    products: [
      {
        id: 'PRD001',
        name: 'Copper Wire 2.5mm',
        description: 'High-quality copper wire, 2.5mm diameter',
        category: 'Copper Wire',
        unit: 'meter',
        pricePerUnit: '150',
        currentStock: 1000,
        minimumStock: 100,
        gstRate: 18,
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      {
        id: 'PRD002',
        name: 'Copper Sheet 1mm',
        description: 'Copper sheet, 1mm thickness',
        category: 'Copper Sheet',
        unit: 'kg',
        pricePerUnit: '800',
        currentStock: 500,
        minimumStock: 50,
        gstRate: 18,
        lastUpdated: new Date().toISOString().split('T')[0],
      },
    ],
    purchaseOrders: [],
    bills: [],
    workers: [
      {
        id: 'WRK001',
        name: 'Rahul Sharma',
        role: 'Worker',
        phone: '9876543210',
        salary: 15000,
        joiningDate: '2024-01-01',
        status: 'Active',
        attendance: [
          {
            date: new Date().toISOString().split('T')[0],
            status: 'Present',
            checkIn: '09:00',
            checkOut: '18:00',
            notes: 'Regular shift'
          }
        ]
      },
      {
        id: 'WRK002',
        name: 'Priya Patel',
        role: 'Worker',
        phone: '9876543211',
        salary: 15000,
        joiningDate: '2024-01-15',
        status: 'Active',
        attendance: [
          {
            date: new Date().toISOString().split('T')[0],
            status: 'Present',
            checkIn: '09:00',
            checkOut: '18:00',
            notes: 'Regular shift'
          }
        ]
      }
    ],
    settings: {
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
    },
  };
};

// Reducer
export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_INVOICE':
      return {
        ...state,
        invoices: [...state.invoices, action.payload],
      };

    case 'UPDATE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.map((invoice) =>
          invoice.id === action.payload.id ? action.payload : invoice
        ),
      };
    case 'DELETE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.filter((invoice) => invoice.id !== action.payload),
      };
    case 'ADD_CLIENT':
      return {
        ...state,
        clients: [...state.clients, action.payload],
      };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map((client) =>
          client.id === action.payload.id ? action.payload : client
        ),
      };
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter((client) => client.id !== action.payload),
      };
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload),
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload],
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.payload),
      };
    case 'ADD_PURCHASE_ORDER':
      return {
        ...state,
        purchaseOrders: [...state.purchaseOrders, action.payload],
      };
    case 'UPDATE_PURCHASE_ORDER':
      return {
        ...state,
        purchaseOrders: state.purchaseOrders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        ),
      };
    case 'DELETE_PURCHASE_ORDER':
      return {
        ...state,
        purchaseOrders: state.purchaseOrders.filter((order) => order.id !== action.payload),
      };
    case 'ADD_BILL':
      return {
        ...state,
        bills: [...state.bills, action.payload],
      };
    case 'UPDATE_BILL':
      return {
        ...state,
        bills: state.bills.map((bill) =>
          bill.id === action.payload.id ? action.payload : bill
        ),
      };
    case 'DELETE_BILL':
      return {
        ...state,
        bills: state.bills.filter((bill) => bill.id !== action.payload),
      };
    case 'ADD_WORKER':
      return {
        ...state,
        workers: [...state.workers, action.payload],
      };
    case 'UPDATE_WORKER':
      return {
        ...state,
        workers: state.workers.map((worker) =>
          worker.id === action.payload.id ? action.payload : worker
        ),
      };
    case 'DELETE_WORKER':
      return {
        ...state,
        workers: state.workers.filter((worker) => worker.id !== action.payload),
      };
    case 'MARK_ATTENDANCE':
      return {
        ...state,
        workers: state.workers.map((worker) =>
          worker.id === action.payload.workerId
            ? {
                ...worker,
                attendance: [
                  ...worker.attendance.filter(
                    (a) => a.date !== action.payload.attendance.date
                  ),
                  action.payload.attendance,
                ],
              }
            : worker
        ),
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: action.payload,
      };
    default:
      return state;
  }
};

// Add theme context and hook
interface ThemeContextType {
  theme: string;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, loadInitialState());
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'system'>(
    state.settings?.appearance?.theme || 'light'
  );

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  // Handle theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const activeTheme = theme === 'system' ? systemTheme : theme;

    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const newSystemTheme = mediaQuery.matches ? 'dark' : 'light';
        root.classList.remove('light', 'dark');
        root.classList.add(newSystemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    </AppContext.Provider>
  );
};

// Custom hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within an AppProvider');
  }
  return context;
}; 