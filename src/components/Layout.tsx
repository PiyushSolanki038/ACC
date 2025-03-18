import React from 'react';
<<<<<<< HEAD
import { Link, useLocation } from 'react-router-dom';
=======
import { Link, useLocation, useNavigate } from 'react-router-dom';
>>>>>>> c4b8260 (Initial commit)
import {
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ReceiptPercentIcon,
  ChartBarIcon,
  DocumentIcon,
  CubeIcon,
  UsersIcon,
  Cog6ToothIcon,
<<<<<<< HEAD
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/AppContext';
=======
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
>>>>>>> c4b8260 (Initial commit)

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Invoices', href: '/invoices', icon: DocumentTextIcon },
  { name: 'Clients', href: '/clients', icon: UserGroupIcon },
  { name: 'Expenses', href: '/expenses', icon: ReceiptPercentIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  { name: 'Bills', href: '/bills', icon: DocumentIcon },
  { name: 'Inventory', href: '/inventory', icon: CubeIcon },
  { name: 'Workers', href: '/workers', icon: UsersIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
<<<<<<< HEAD
  const { theme } = useTheme();
=======
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { state: authState } = useAuth();
>>>>>>> c4b8260 (Initial commit)

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`} style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex min-h-0 flex-1 flex-col border-r" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
<<<<<<< HEAD
              <div className="flex flex-shrink-0 items-center px-4">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>Copper Shop</h1>
=======
              <div className="flex flex-shrink-0 items-center justify-between px-4">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>Copper Shop</h1>
                <button
                  onClick={() => navigate('/profile')}
                  className="p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  style={{
                    backgroundColor: location.pathname === '/profile' ? 'var(--hover)' : 'transparent',
                    color: location.pathname === '/profile' ? 'var(--text)' : 'var(--text-secondary)',
                  }}
                >
                  <UserCircleIcon className="h-6 w-6" />
                </button>
>>>>>>> c4b8260 (Initial commit)
              </div>
              <nav className="mt-5 flex-1 space-y-1 px-2" style={{ backgroundColor: 'var(--surface)' }}>
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
<<<<<<< HEAD
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
=======
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800`}
>>>>>>> c4b8260 (Initial commit)
                      style={{
                        backgroundColor: isActive ? 'var(--hover)' : 'transparent',
                        color: isActive ? 'var(--text)' : 'var(--text-secondary)',
                      }}
                    >
                      <item.icon
                        className={`mr-3 h-6 w-6 flex-shrink-0 transition-colors`}
                        style={{
                          color: isActive ? 'var(--text)' : 'var(--text-secondary)',
                        }}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout; 