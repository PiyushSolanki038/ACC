import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
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
} from '@heroicons/react/24/outline';

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
}

const Dashboard: React.FC = () => {
  const { state } = useApp();
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
    });
  }, [state]);

  return (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 