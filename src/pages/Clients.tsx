import React, { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  DocumentTextIcon,
  DocumentDuplicateIcon,
<<<<<<< HEAD
  CreditCardIcon
=======
  CreditCardIcon,
  ShareIcon
>>>>>>> c4b8260 (Initial commit)
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import FormModal from '../components/FormModal';
import { useNavigate, Link } from 'react-router-dom';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  totalInvoices: number;
  totalAmount: string;
<<<<<<< HEAD
=======
  unpaidBills: number;
  overdueAmount: string;
>>>>>>> c4b8260 (Initial commit)
}

const Clients: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
<<<<<<< HEAD
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active' as 'Active' | 'Inactive',
  });
=======
  const [formData, setFormData] = useState<Omit<Client, 'id'>>({
    name: '',
    email: '',
    phone: '',
    status: 'Active',
    totalInvoices: 0,
    totalAmount: '₹0.00',
    unpaidBills: 0,
    overdueAmount: '₹0.00'
  });
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
>>>>>>> c4b8260 (Initial commit)

  // Filter clients based on search query
  const filteredClients = state.clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      dispatch({
        type: 'UPDATE_CLIENT',
        payload: {
          ...editingClient,
<<<<<<< HEAD
          ...formData,
        },
      });
      handleCloseModal();
    } else {
      const newClient: Client = {
        id: `CLT${String(state.clients.length + 1).padStart(3, '0')}`,
        ...formData,
        totalInvoices: 0,
        totalAmount: '₹0.00',
      };
      dispatch({
        type: 'ADD_CLIENT',
        payload: newClient,
      });
      handleCloseModal();
    }
=======
          ...formData
        }
      });
    } else {
      dispatch({
        type: 'ADD_CLIENT',
        payload: {
          id: `CLT${String(state.clients.length + 1).padStart(3, '0')}`,
          ...formData
        }
      });
    }
    handleCloseModal();
>>>>>>> c4b8260 (Initial commit)
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      status: client.status,
<<<<<<< HEAD
=======
      totalInvoices: client.totalInvoices,
      totalAmount: client.totalAmount,
      unpaidBills: client.unpaidBills || 0,
      overdueAmount: client.overdueAmount || '₹0.00'
>>>>>>> c4b8260 (Initial commit)
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      dispatch({ type: 'DELETE_CLIENT', payload: id });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      status: 'Active',
<<<<<<< HEAD
    });
  };

=======
      totalInvoices: 0,
      totalAmount: '₹0.00',
      unpaidBills: 0,
      overdueAmount: '₹0.00'
    });
  };

  const handleShare = (client: Client, type: 'bills' | 'unpaid') => {
    let message = '';
    
    if (type === 'bills') {
      message = `Dear ${client.name},\n\nYour payment status:\nTotal Bills: ${client.totalInvoices}\nTotal Amount: ${client.totalAmount}\n\nThank you for your business!`;
    } else {
      message = `Dear ${client.name},\n\nPayment Reminder:\nYou have ${client.unpaidBills} unpaid bills\nOverdue Amount: ${client.overdueAmount}\n\nPlease settle your payment at your earliest convenience.`;
    }

    if (navigator.share) {
      navigator.share({
        title: 'Payment Status',
        text: message,
      }).catch(console.error);
    } else {
      setShareModalOpen(true);
      setShareMessage(message);
    }
  };

>>>>>>> c4b8260 (Initial commit)
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your client information and create invoices or bills.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Client
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="relative flex flex-col rounded-lg border border-gray-300 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <EnvelopeIcon className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  {client.email}
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <PhoneIcon className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  {client.phone}
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  client.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {client.status}
              </span>
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Total Invoices</p>
                  <p className="mt-1 font-medium text-gray-900">{client.totalInvoices}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="mt-1 font-medium text-gray-900">{client.totalAmount}</p>
                </div>
<<<<<<< HEAD
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <Link
                to={`/invoices?client=${client.id}`}
                className="inline-flex items-center p-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                title="Create Invoice"
              >
                <DocumentTextIcon className="h-5 w-5" />
              </Link>
              <Link
                to={`/bills?client=${client.id}`}
                className="inline-flex items-center p-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                title="Create Bill"
              >
                <CreditCardIcon className="h-5 w-5" />
              </Link>
              <button
                onClick={() => handleEdit(client)}
                className="inline-flex items-center p-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                title="Edit Client"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(client.id)}
                className="inline-flex items-center p-1 border border-red-300 rounded-md text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                title="Delete Client"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
=======
                <div>
                  <p className="text-gray-500">Unpaid Bills</p>
                  <p className="mt-1 font-medium text-red-600">{client.unpaidBills}</p>
                </div>
                <div>
                  <p className="text-gray-500">Overdue Amount</p>
                  <p className="mt-1 font-medium text-red-600">{client.overdueAmount}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleShare(client, 'bills')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ShareIcon className="h-4 w-4 mr-1" />
                Share Bills
              </button>
              {client.unpaidBills > 0 && (
                <button
                  onClick={() => handleShare(client, 'unpaid')}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <ShareIcon className="h-4 w-4 mr-1" />
                  Share Unpaid
                </button>
              )}
>>>>>>> c4b8260 (Initial commit)
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Client Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingClient ? 'Edit Client' : 'New Client'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="mt-5">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
            >
              {editingClient ? 'Update Client' : 'Add Client'}
            </button>
          </div>
        </form>
      </FormModal>
<<<<<<< HEAD
=======

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Share Message</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                <p className="text-gray-900 dark:text-white whitespace-pre-line">{shareMessage}</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
>>>>>>> c4b8260 (Initial commit)
    </div>
  );
};

export default Clients; 