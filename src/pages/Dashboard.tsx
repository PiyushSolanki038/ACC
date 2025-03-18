import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
<<<<<<< HEAD
=======
import { useTheme } from '../context/AppContext';
import { Switch } from '@headlessui/react';
import { classNames } from '../utils/helpers';
>>>>>>> c4b8260 (Initial commit)
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  DocumentTextIcon,
  TruckIcon,
  BuildingOfficeIcon,
  ChartPieIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
<<<<<<< HEAD
} from '@heroicons/react/24/outline';
=======
  ArrowUpIcon,
  ArrowDownIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
>>>>>>> c4b8260 (Initial commit)

interface DashboardStats {
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  totalClients: number;
  totalProducts: number;
  lowStockItems: number;
  pendingInvoices: number;
  overdueInvoices: number;
  recentTransactions: any[];
  topProducts: any[];
  salesByCategory: any[];
  monthlyTrend: any[];
<<<<<<< HEAD
=======
  totalOrders: number;
  salesGrowth: number;
  clientGrowth: number;
>>>>>>> c4b8260 (Initial commit)
}

const Dashboard: React.FC = () => {
  const { state } = useApp();
<<<<<<< HEAD
=======
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
>>>>>>> c4b8260 (Initial commit)
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalClients: 0,
    totalProducts: 0,
    lowStockItems: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    recentTransactions: [],
    topProducts: [],
    salesByCategory: [],
    monthlyTrend: [],
<<<<<<< HEAD
=======
    totalOrders: 0,
    salesGrowth: 0,
    clientGrowth: 0,
>>>>>>> c4b8260 (Initial commit)
  });

  useEffect(() => {
    // Calculate total sales
    const totalSales = state.invoices.reduce((sum, invoice) => {
      return sum + parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ''));
    }, 0);

    // Calculate total expenses
    const totalExpenses = state.expenses.reduce((sum, expense) => {
      return sum + parseFloat(expense.amount.replace(/[^0-9.-]+/g, ''));
    }, 0);

    // Get low stock items
    const lowStockItems = state.products.filter(product => 
      product.currentStock <= product.minimumStock
    ).length;

    // Get pending and overdue invoices
    const pendingInvoices = state.invoices.filter(invoice => 
      invoice.status === 'Pending'
    ).length;

    const overdueInvoices = state.invoices.filter(invoice => 
      invoice.status === 'Overdue'
    ).length;

    // Get recent transactions
    const recentTransactions = [...state.invoices, ...state.expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    // Get top products by sales
    const productSales = state.products.map(product => ({
      ...product,
      totalSales: state.invoices.reduce((sum, invoice) => {
        const items = invoice.items || [];
        const productItems = items.filter(item => item.description.includes(product.name));
        return sum + productItems.reduce((itemSum, item) => 
          itemSum + (parseFloat(item.amount) || 0), 0);
      }, 0)
    }));

    const topProducts = productSales
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5);

    // Calculate sales by category
    const salesByCategory = state.products.reduce((acc, product) => {
      const category = product.category;
      const sales = state.invoices.reduce((sum, invoice) => {
        const items = invoice.items || [];
        const productItems = items.filter(item => item.description.includes(product.name));
        return sum + productItems.reduce((itemSum, item) => 
          itemSum + (parseFloat(item.amount) || 0), 0);
      }, 0);

      acc[category] = (acc[category] || 0) + sales;
      return acc;
    }, {} as Record<string, number>);

    // Calculate monthly trend
    const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      
      const monthSales = state.invoices
        .filter(invoice => {
          const invoiceDate = new Date(invoice.date);
          return invoiceDate.getMonth() === date.getMonth() && 
                 invoiceDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, invoice) => 
          sum + parseFloat(invoice.amount.replace(/[^0-9.-]+/g, '')), 0);

      return { month, year, sales: monthSales };
    }).reverse();

<<<<<<< HEAD
=======
    // Calculate total orders
    const totalOrders = state.purchaseOrders.length;

>>>>>>> c4b8260 (Initial commit)
    setStats({
      totalSales,
      totalExpenses,
      netProfit: totalSales - totalExpenses,
      totalClients: state.clients.length,
      totalProducts: state.products.length,
      lowStockItems,
      pendingInvoices,
      overdueInvoices,
      recentTransactions,
      topProducts,
      salesByCategory: Object.entries(salesByCategory).map(([category, sales]) => ({
        category,
        sales
      })),
      monthlyTrend,
<<<<<<< HEAD
=======
      totalOrders,
      salesGrowth: 12.5, // Example growth rate
      clientGrowth: 8.2, // Example growth rate
>>>>>>> c4b8260 (Initial commit)
    });
  }, [state]);

  return (
<<<<<<< HEAD
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                  <dd className="text-lg font-medium text-gray-900">₹{stats.totalSales.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Clients</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalClients}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCartIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalProducts}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Low Stock Items</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.lowStockItems}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Sales</span>
                <span className="font-medium text-gray-900">₹{stats.totalSales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Expenses</span>
                <span className="font-medium text-red-600">₹{stats.totalExpenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Net Profit</span>
                <span className={`font-medium ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{stats.netProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Invoices</span>
                <span className="font-medium text-yellow-600">{stats.pendingInvoices}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Overdue Invoices</span>
                <span className="font-medium text-red-600">{stats.overdueInvoices}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.hasOwnProperty('client') ? 'Invoice' : 'Expense'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.hasOwnProperty('client') ? transaction.client : transaction.description}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.hasOwnProperty('client') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ₹{parseFloat(transaction.amount.replace(/[^0-9.-]+/g, '')).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Products and Sales by Category */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600">{product.name}</span>
                  <span className="font-medium text-gray-900">₹{product.totalSales.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sales by Category</h3>
            <div className="space-y-4">
              {stats.salesByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600">{category.category}</span>
                  <span className="font-medium text-gray-900">₹{category.sales.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Sales Trend</h3>
          <div className="flex items-end justify-between h-48">
            {stats.monthlyTrend.map((month, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-8 bg-primary-100 rounded-t-lg" style={{ 
                  height: `${(month.sales / Math.max(...stats.monthlyTrend.map(m => m.sales))) * 100}%` 
                }} />
                <span className="mt-2 text-sm text-gray-500">{month.month}</span>
                <span className="text-xs text-gray-400">{month.year}</span>
              </div>
            ))}
=======
    <div className={classNames(
      "min-h-screen",
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={classNames(
            "text-3xl font-bold",
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className={classNames(
                "mr-2 text-sm",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>Light</span>
              <Switch
                checked={theme === 'dark'}
                onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                className={classNames(
                  theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200',
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                )}
              >
                <span
                  className={classNames(
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                  )}
                >
                  <span
                    className={classNames(
                      theme === 'dark'
                        ? 'opacity-0 duration-100 ease-out'
                        : 'opacity-100 duration-200 ease-in',
                      'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                    )}
                    aria-hidden="true"
                  >
                    <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                      <path
                        d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span
                    className={classNames(
                      theme === 'dark'
                        ? 'opacity-100 duration-200 ease-in'
                        : 'opacity-0 duration-100 ease-out',
                      'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                    )}
                    aria-hidden="true"
                  >
                    <svg className="h-3 w-3 text-primary-600" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  </span>
                </span>
              </Switch>
              <span className={classNames(
                "ml-2 text-sm",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>Dark</span>
            </div>
            
            {/* Profile Button */}
            <button
              onClick={() => navigate('/profile')}
              className={classNames(
                "flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}
            >
              <UserCircleIcon className="h-8 w-8" />
              <span className="text-sm font-medium">{state.user?.email || 'Profile'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className={classNames(
              "overflow-hidden shadow rounded-lg",
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            )}>
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CurrencyDollarIcon className={classNames(
                      "h-6 w-6",
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={classNames(
                        "text-sm font-medium truncate",
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      )}>Total Sales</dt>
                      <dd className={classNames(
                        "text-lg font-medium",
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>₹{stats.totalSales.toFixed(2)}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className={classNames(
              "overflow-hidden shadow rounded-lg",
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            )}>
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className={classNames(
                      "h-6 w-6",
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={classNames(
                        "text-sm font-medium truncate",
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      )}>Total Clients</dt>
                      <dd className={classNames(
                        "text-lg font-medium",
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>{stats.totalClients}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className={classNames(
              "overflow-hidden shadow rounded-lg",
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            )}>
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ShoppingCartIcon className={classNames(
                      "h-6 w-6",
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={classNames(
                        "text-sm font-medium truncate",
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      )}>Total Products</dt>
                      <dd className={classNames(
                        "text-lg font-medium",
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>{stats.totalProducts}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className={classNames(
              "overflow-hidden shadow rounded-lg",
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            )}>
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className={classNames(
                      "h-6 w-6",
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={classNames(
                        "text-sm font-medium truncate",
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      )}>Total Orders</dt>
                      <dd className={classNames(
                        "text-lg font-medium",
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>{stats.totalOrders}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className={classNames(
              "shadow rounded-lg",
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            )}>
              <div className="p-6">
                <h3 className={classNames(
                  "text-lg font-medium mb-4",
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>Financial Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={classNames(
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    )}>Total Sales</span>
                    <span className={classNames(
                      "font-medium",
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>₹{stats.totalSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={classNames(
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    )}>Total Expenses</span>
                    <span className={classNames(
                      "font-medium text-red-600",
                      theme === 'dark' ? 'text-white' : 'text-red-600'
                    )}>₹{stats.totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={classNames(
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    )}>Net Profit</span>
                    <span className={classNames(
                      "font-medium",
                      stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600',
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      ₹{stats.netProfit.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={classNames(
              "shadow rounded-lg",
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            )}>
              <div className="p-6">
                <h3 className={classNames(
                  "text-lg font-medium mb-4",
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>Invoice Status</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={classNames(
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    )}>Pending Invoices</span>
                    <span className={classNames(
                      "font-medium text-yellow-600",
                      theme === 'dark' ? 'text-white' : 'text-yellow-600'
                    )}>{stats.pendingInvoices}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={classNames(
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    )}>Overdue Invoices</span>
                    <span className={classNames(
                      "font-medium text-red-600",
                      theme === 'dark' ? 'text-white' : 'text-red-600'
                    )}>{stats.overdueInvoices}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className={classNames(
              "overflow-hidden shadow rounded-lg",
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            )}>
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ArrowUpIcon className={classNames(
                      "h-6 w-6 text-green-500",
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={classNames(
                        "text-sm font-medium truncate",
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      )}>Sales Growth</dt>
                      <dd className={classNames(
                        "text-lg font-medium",
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>{stats.salesGrowth}%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className={classNames(
              "overflow-hidden shadow rounded-lg",
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            )}>
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ArrowUpIcon className={classNames(
                      "h-6 w-6 text-green-500",
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={classNames(
                        "text-sm font-medium truncate",
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      )}>Client Growth</dt>
                      <dd className={classNames(
                        "text-lg font-medium",
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>{stats.clientGrowth}%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className={classNames(
            "shadow rounded-lg",
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          )}>
            <div className="p-6">
              <h3 className={classNames(
                "text-lg font-medium mb-4",
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className={classNames(
                  "min-w-full divide-y divide-gray-200",
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-900'
                )}>
                  <thead>
                    <tr>
                      <th className={classNames(
                        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      )}>Date</th>
                      <th className={classNames(
                        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      )}>Type</th>
                      <th className={classNames(
                        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      )}>Description</th>
                      <th className={classNames(
                        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      )}>Amount</th>
                    </tr>
                  </thead>
                  <tbody className={classNames(
                    "bg-white divide-y divide-gray-200",
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  )}>
                    {stats.recentTransactions.map((transaction, index) => (
                      <tr key={index}>
                        <td className={classNames(
                          "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-900'
                        )}>
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className={classNames(
                          "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-900'
                        )}>
                          {transaction.hasOwnProperty('client') ? 'Invoice' : 'Expense'}
                        </td>
                        <td className={classNames(
                          "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-900'
                        )}>
                          {transaction.hasOwnProperty('client') ? transaction.client : transaction.description}
                        </td>
                        <td className={classNames(
                          "px-6 py-4 whitespace-nowrap text-sm font-medium",
                          transaction.hasOwnProperty('client') ? 'text-green-600' : 'text-red-600',
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-900'
                        )}>
                          ₹{parseFloat(transaction.amount.replace(/[^0-9.-]+/g, '')).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Products and Sales by Category */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className={classNames(
              "shadow rounded-lg",
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            )}>
              <div className="p-6">
                <h3 className={classNames(
                  "text-lg font-medium mb-4",
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>Top Products</h3>
                <div className="space-y-4">
                  {stats.topProducts.map((product, index) => (
                    <div key={index} className={classNames(
                      "flex items-center justify-between",
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                    )}>
                      <span>{product.name}</span>
                      <span className={classNames(
                        "font-medium",
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>₹{product.totalSales.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={classNames(
              "shadow rounded-lg",
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            )}>
              <div className="p-6">
                <h3 className={classNames(
                  "text-lg font-medium mb-4",
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>Sales by Category</h3>
                <div className="space-y-4">
                  {stats.salesByCategory.map((category, index) => (
                    <div key={index} className={classNames(
                      "flex items-center justify-between",
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                    )}>
                      <span>{category.category}</span>
                      <span className={classNames(
                        "font-medium",
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>₹{category.sales.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Trend */}
          <div className={classNames(
            "shadow rounded-lg",
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          )}>
            <div className="p-6">
              <h3 className={classNames(
                "text-lg font-medium mb-4",
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>Monthly Sales Trend</h3>
              <div className="flex items-end justify-between h-48">
                {stats.monthlyTrend.map((month, index) => (
                  <div key={index} className={classNames(
                    "flex flex-col items-center",
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                  )}>
                    <div className={classNames(
                      "w-8 bg-primary-100 rounded-t-lg",
                      theme === 'dark' ? 'bg-gray-700' : 'bg-primary-100',
                      "h-full"
                    )} style={{ 
                      height: `${(month.sales / Math.max(...stats.monthlyTrend.map(m => m.sales))) * 100}%` 
                    }} />
                    <span className={classNames(
                      "mt-2 text-sm",
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    )}>{month.month}</span>
                    <span className={classNames(
                      "text-xs text-gray-400",
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )}>{month.year}</span>
                  </div>
                ))}
              </div>
            </div>
>>>>>>> c4b8260 (Initial commit)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 