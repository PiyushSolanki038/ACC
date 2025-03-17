import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, DocumentTextIcon, ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import FormModal from '../components/FormModal';
import { Link } from 'react-router-dom';

const statusStyles = {
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-gray-100 text-gray-800',
  Paid: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Overdue: 'bg-red-100 text-red-800',
};

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  totalInvoices: number;
  totalAmount: string;
}

const ClientInvoices: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [clientFormData, setClientFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active' as 'Active' | 'Inactive',
  });
  const [invoiceFormData, setInvoiceFormData] = useState({
    client: '',
    amount: '',
    status: 'Pending' as 'Pending' | 'Paid' | 'Overdue',
    date: new Date().toISOString().split('T')[0],
  });

  // Filter clients based on search query
  const filteredClients = state.clients.filter(client =>
    client.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    client.phone.toLowerCase().includes(clientSearchQuery.toLowerCase())
  );

  // Filter invoices based on search query
  const getFilteredInvoices = (clientName: string) => {
    return state.invoices
      .filter(invoice => invoice.client === clientName)
      .filter(invoice =>
        invoice.id.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
        invoice.amount.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
        invoice.status.toLowerCase().includes(invoiceSearchQuery.toLowerCase())
      );
  };

  // Client handlers
  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      dispatch({
        type: 'UPDATE_CLIENT',
        payload: {
          ...editingClient,
          ...clientFormData,
        },
      });
      handleCloseClientModal();
    } else {
      const newClient: Client = {
        id: `CLT${String(state.clients.length + 1).padStart(3, '0')}`,
        ...clientFormData,
        totalInvoices: 0,
        totalAmount: '₹0.00',
      };
      dispatch({
        type: 'ADD_CLIENT',
        payload: newClient,
      });
      handleCloseClientModal();
      
      // Set the selected client and open invoice modal
      setSelectedClient(newClient);
      setInvoiceFormData(prev => ({
        ...prev,
        client: newClient.name,
      }));
      setIsInvoiceModalOpen(true);
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setClientFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      status: client.status,
    });
    setIsClientModalOpen(true);
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      dispatch({ type: 'DELETE_CLIENT', payload: id });
    }
  };

  const handleCloseClientModal = () => {
    setIsClientModalOpen(false);
    setEditingClient(null);
    setClientFormData({
      name: '',
      email: '',
      phone: '',
      status: 'Active',
    });
  };

  // Invoice handlers
  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInvoice) {
      dispatch({
        type: 'UPDATE_INVOICE',
        payload: {
          ...editingInvoice,
          ...invoiceFormData,
        },
      });
    } else {
      const newInvoice = {
        id: `INV${String(state.invoices.length + 1).padStart(3, '0')}`,
        ...invoiceFormData,
        status: invoiceFormData.status as 'Pending' | 'Paid' | 'Overdue',
      };

      // Update client's total invoices and amount
      const client = state.clients.find(c => c.name === invoiceFormData.client);
      if (client) {
        const amount = parseFloat(invoiceFormData.amount.replace(/[^0-9.-]+/g, ''));
        dispatch({
          type: 'UPDATE_CLIENT',
          payload: {
            ...client,
            totalInvoices: client.totalInvoices + 1,
            totalAmount: `₹${(parseFloat(client.totalAmount.replace(/[^0-9.-]+/g, '')) + amount).toFixed(2)}`,
          },
        });
      }

      dispatch({
        type: 'ADD_INVOICE',
        payload: newInvoice,
      });
    }
    handleCloseInvoiceModal();
  };

  const handleEditInvoice = (invoice: any) => {
    setEditingInvoice(invoice);
    setInvoiceFormData({
      client: invoice.client,
      amount: invoice.amount,
      status: invoice.status,
      date: invoice.date,
    });
    setIsInvoiceModalOpen(true);
  };

  const handleDeleteInvoice = (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      const invoice = state.invoices.find(inv => inv.id === id);
      if (invoice) {
        // Update client's total invoices and amount
        const client = state.clients.find(c => c.name === invoice.client);
        if (client) {
          const amount = parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ''));
          dispatch({
            type: 'UPDATE_CLIENT',
            payload: {
              ...client,
              totalInvoices: client.totalInvoices - 1,
              totalAmount: `₹${(parseFloat(client.totalAmount.replace(/[^0-9.-]+/g, '')) - amount).toFixed(2)}`,
            },
          });
        }
      }
      dispatch({ type: 'DELETE_INVOICE', payload: id });
    }
  };

  const handleCloseInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
    setEditingInvoice(null);
    setInvoiceFormData({
      client: selectedClient?.name || '',
      amount: '',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handlePrint = (invoice: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoice.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .invoice-details { margin-bottom: 30px; }
              .amount { font-size: 24px; font-weight: bold; }
              .status { padding: 5px 10px; border-radius: 15px; }
              .status-paid { background: #d1fae5; color: #065f46; }
              .status-pending { background: #fef3c7; color: #92400e; }
              .status-overdue { background: #fee2e2; color: #991b1b; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Invoice ${invoice.id}</h1>
              <p>Date: ${invoice.date}</p>
            </div>
            <div class="invoice-details">
              <p><strong>Client:</strong> ${invoice.client}</p>
              <p><strong>Amount:</strong> ${invoice.amount}</p>
              <p><strong>Status:</strong> <span class="status status-${invoice.status.toLowerCase()}">${invoice.status}</span></p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Clients & Invoices</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your clients and their associated invoices in one place.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search clients..."
                value={clientSearchQuery}
                onChange={(e) => setClientSearchQuery(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm w-64"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </span>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
              onClick={() => setIsClientModalOpen(true)}
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Client
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {filteredClients.map((client) => (
                <div key={client.id} className="border-b border-gray-200">
                  <div className="px-6 py-4">
                    <div className="flex items-center">
                      <button
                        onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}
                        className="mr-4 text-gray-400 hover:text-gray-500"
                      >
                        {expandedClient === client.id ? (
                          <ChevronUpIcon className="h-5 w-5" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                        <p className="text-sm text-gray-500">{client.email}</p>
                        <p className="text-sm text-gray-500">{client.phone}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            statusStyles[client.status]
                          }`}
                        >
                          {client.status}
                        </span>
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">{client.totalInvoices}</span> invoices
                        </div>
                        <div className="text-sm text-gray-500">
                          Total: <span className="font-medium">{client.totalAmount}</span>
                        </div>
                        <Link
                          to={`/bills?client=${client.id}`}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                          title="View/Create Bill"
                        >
                          <DocumentDuplicateIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleEditClient(client)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {expandedClient === client.id && (
                    <div className="border-t border-gray-200">
                      <div className="px-6 py-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-medium text-gray-900">Invoices</h4>
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Search invoices..."
                                value={invoiceSearchQuery}
                                onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm w-64"
                              />
                              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <MagnifyingGlassIcon className="h-5 w-5" />
                              </span>
                            </div>
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              onClick={() => {
                                setSelectedClient(client);
                                setInvoiceFormData(prev => ({
                                  ...prev,
                                  client: client.name,
                                }));
                                setIsInvoiceModalOpen(true);
                              }}
                            >
                              <PlusIcon className="h-4 w-4 mr-1" />
                              New Invoice
                            </button>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Invoice ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {getFilteredInvoices(client.name).map(invoice => (
                                <tr key={invoice.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {invoice.id}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {invoice.amount}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                        statusStyles[invoice.status]
                                      }`}
                                    >
                                      {invoice.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {invoice.date}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                      onClick={() => handleEditInvoice(invoice)}
                                      className="text-primary-600 hover:text-primary-900 mr-4"
                                    >
                                      <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteInvoice(invoice.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <TrashIcon className="h-5 w-5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FormModal
        isOpen={isClientModalOpen}
        onClose={handleCloseClientModal}
        title={editingClient ? 'Edit Client' : 'New Client'}
      >
        <form onSubmit={handleClientSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={clientFormData.name}
              onChange={(e) => setClientFormData({ ...clientFormData, name: e.target.value })}
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
              value={clientFormData.email}
              onChange={(e) => setClientFormData({ ...clientFormData, email: e.target.value })}
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
              value={clientFormData.phone}
              onChange={(e) => setClientFormData({ ...clientFormData, phone: e.target.value })}
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
              value={clientFormData.status}
              onChange={(e) => setClientFormData({ ...clientFormData, status: e.target.value as 'Active' | 'Inactive' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:text-sm"
            >
              {editingClient ? 'Update Client' : 'Create Client'}
            </button>
          </div>
        </form>
      </FormModal>

      <FormModal
        isOpen={isInvoiceModalOpen}
        onClose={handleCloseInvoiceModal}
        title={editingInvoice ? 'Edit Invoice' : 'New Invoice'}
      >
        <form onSubmit={handleInvoiceSubmit} className="space-y-4">
          <div>
            <label htmlFor="client" className="block text-sm font-medium text-gray-700">
              Client
            </label>
            <input
              type="text"
              id="client"
              value={invoiceFormData.client}
              onChange={(e) => setInvoiceFormData({ ...invoiceFormData, client: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
              readOnly
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="text"
              id="amount"
              value={invoiceFormData.amount}
              onChange={(e) => setInvoiceFormData({ ...invoiceFormData, amount: e.target.value })}
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
              value={invoiceFormData.status}
              onChange={(e) => setInvoiceFormData({ ...invoiceFormData, status: e.target.value as 'Pending' | 'Paid' | 'Overdue' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={invoiceFormData.date}
              onChange={(e) => setInvoiceFormData({ ...invoiceFormData, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:text-sm"
            >
              {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};

export default ClientInvoices; 