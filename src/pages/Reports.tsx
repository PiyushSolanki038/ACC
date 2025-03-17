import React from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

const reports = [
  {
    name: 'Revenue Overview',
    description: 'Monthly revenue breakdown and trends',
    icon: CurrencyDollarIcon,
    trend: '+12.5%',
    trendType: 'increase',
  },
  {
    name: 'Expense Analysis',
    description: 'Detailed breakdown of expenses by category',
    icon: ChartBarIcon,
    trend: '-3.2%',
    trendType: 'decrease',
  },
  {
    name: 'Profit Margin',
    description: 'Monthly profit margin analysis',
    icon: ArrowTrendingUpIcon,
    trend: '+5.8%',
    trendType: 'increase',
  },
  {
    name: 'Cash Flow',
    description: 'Monthly cash flow statement',
    icon: ArrowTrendingDownIcon,
    trend: '-2.1%',
    trendType: 'decrease',
  },
];

const Reports: React.FC = () => {
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <p className="mt-2 text-sm text-gray-700">
            Comprehensive financial reports and analytics for your business.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reports.map((report) => (
          <div
            key={report.name}
            className="relative overflow-hidden rounded-lg bg-white px-6 py-5 shadow hover:shadow-md transition-shadow duration-200"
          >
            <dt>
              <div className="absolute rounded-md bg-primary-500 p-3">
                <report.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-900">{report.name}</p>
            </dt>
            <dd className="ml-16 flex flex-wrap flex-col">
              <p className="mt-2 text-sm text-gray-500">{report.description}</p>
              <div className="mt-4 flex items-center">
                <p
                  className={`text-sm font-medium ${
                    report.trendType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {report.trend}
                </p>
                <p className="ml-2 text-sm text-gray-500">vs last month</p>
              </div>
            </dd>
          </div>
        ))}
      </div>

      {/* Placeholder for charts */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
          <div className="mt-4 h-64 bg-gray-50 rounded flex items-center justify-center">
            <p className="text-gray-500">Chart placeholder</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Expense Distribution</h3>
          <div className="mt-4 h-64 bg-gray-50 rounded flex items-center justify-center">
            <p className="text-gray-500">Chart placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 