import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, DocumentTextIcon, UserIcon, MagnifyingGlassIcon, DocumentDuplicateIcon, ArrowDownTrayIcon, FunnelIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import FormModal from '../components/FormModal';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const statusStyles = {
  Paid: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Overdue: 'bg-red-100 text-red-800',
};

interface InvoiceItem {
  description: string;
  quantity: number;
  price: string;
  amount: string;
}

interface InvoiceFormData {
  client: string;
  amount: string;
  status: 'Pending' | 'Paid' | 'Overdue';
  date: string;
  dueDate: string;
  notes: string;
  items: InvoiceItem[];
}

interface InvoicesProps {
  clientName?: string;
  isModal?: boolean;
  onClose?: () => void;
}

interface InvoiceSummary {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  averageInvoiceAmount: number;
}

interface FilterOptions {
  status: 'all' | 'Pending' | 'Paid' | 'Overdue';
  dateRange: {
    start: string;
    end: string;
  };
  amountRange: {
    min: string;
    max: string;
  };
  searchQuery: string;
}

interface PaymentStatus {
  paid: number;
  pending: number;
  overdue: number;
}

interface FinancialSummary {
  dailySales: {
    date: string;
    amount: number;
    count: number;
  }[];
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  taxSummary: {
    totalGST: number;
    totalCGST: number;
    totalSGST: number;
    totalIGST: number;
  };
  paymentStatus: PaymentStatus;
}

const Invoices: React.FC<InvoicesProps> = ({ clientName, isModal, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useSearchParams()[0];
  const { state, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [newClientName, setNewClientName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'invoice' | 'client'>('invoice');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Pending' | 'Paid' | 'Overdue'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [invoiceSummary, setInvoiceSummary] = useState<InvoiceSummary>({
    totalInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    averageInvoiceAmount: 0,
  });
  const [formData, setFormData] = useState<InvoiceFormData>({
    client: '',
    amount: '',
    status: 'Pending',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
    items: [{ description: '', quantity: 1, price: '', amount: '' }],
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: 'all',
    dateRange: { start: '', end: '' },
    amountRange: { min: '', max: '' },
    searchQuery: '',
  });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    dailySales: [],
    totalSales: 0,
    totalExpenses: 0,
    netProfit: 0,
    taxSummary: {
      totalGST: 0,
      totalCGST: 0,
      totalSGST: 0,
      totalIGST: 0,
    },
    paymentStatus: {
      paid: 0,
      pending: 0,
      overdue: 0,
    },
  });
  const [showBillPrompt, setShowBillPrompt] = useState(false);
  const [newInvoice, setNewInvoice] = useState<any>(null);

  // Handle client pre-selection from navigation
  useEffect(() => {
    const locationState = location.state as { selectedClient?: string } | null;
    if (locationState?.selectedClient) {
      const clientName = locationState.selectedClient;
      setSelectedClient(clientName);
      setFormData(prevState => ({
        ...prevState,
        client: clientName
      }));
      setIsModalOpen(true);
      // Clear the navigation state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  // Use provided clientName if available
  useEffect(() => {
    if (clientName) {
      setSelectedClient(clientName);
      setFormData(prevState => ({
        ...prevState,
        client: clientName
      }));
    }
  }, [clientName]);

  // Calculate invoice summary
  useEffect(() => {
    const summary = state.invoices.reduce((acc, invoice) => {
      const amount = parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ''));
      acc.totalInvoices++;
      acc.totalAmount += amount;
      
      switch (invoice.status) {
        case 'Paid':
          acc.paidAmount += amount;
          break;
        case 'Pending':
          acc.pendingAmount += amount;
          break;
        case 'Overdue':
          acc.overdueAmount += amount;
          break;
      }
      
      return acc;
    }, {
      totalInvoices: 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      averageInvoiceAmount: 0,
    });

    summary.averageInvoiceAmount = summary.totalInvoices > 0 
      ? summary.totalAmount / summary.totalInvoices 
      : 0;

    setInvoiceSummary(summary);
  }, [state.invoices]);

  // Calculate financial summary
  useEffect(() => {
    // Calculate daily sales
    const dailySalesMap = new Map<string, { amount: number; count: number }>();
    state.invoices.forEach(invoice => {
      const date = invoice.date;
      const amount = parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ''));
      const current = dailySalesMap.get(date) || { amount: 0, count: 0 };
      dailySalesMap.set(date, {
        amount: current.amount + amount,
        count: current.count + 1
      });
    });

    const dailySales = Array.from(dailySalesMap.entries()).map(([date, data]) => ({
      date,
      amount: data.amount,
      count: data.count
    })).sort((a, b) => b.date.localeCompare(a.date));

    // Calculate total sales and payment status
    const totalSales = state.invoices.reduce((sum, invoice) => {
      return sum + parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ''));
    }, 0);

    const paymentStatus: PaymentStatus = state.invoices.reduce((acc, invoice) => {
      const status = invoice.status.toLowerCase() as keyof PaymentStatus;
      acc[status]++;
      return acc;
    }, { paid: 0, pending: 0, overdue: 0 });

    // Calculate tax summary
    const taxSummary = state.invoices.reduce((acc, invoice) => {
      const amount = parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ''));
      const gstRate = 18; // Assuming 18% GST rate
      const gstAmount = (amount * gstRate) / 100;
      
      acc.totalGST += gstAmount;
      // Assuming equal split between CGST and SGST
      acc.totalCGST += gstAmount / 2;
      acc.totalSGST += gstAmount / 2;
      acc.totalIGST += 0; // IGST would be calculated based on state

      return acc;
    }, { totalGST: 0, totalCGST: 0, totalSGST: 0, totalIGST: 0 });

    // Calculate total expenses from state.expenses
    const totalExpenses = state.expenses.reduce((sum, expense) => {
      return sum + parseFloat(expense.amount.replace(/[^0-9.-]+/g, ''));
    }, 0);

    setFinancialSummary({
      dailySales,
      totalSales,
      totalExpenses,
      netProfit: totalSales - totalExpenses,
      taxSummary,
      paymentStatus,
    });
  }, [state.invoices, state.expenses]);

  // Handle URL parameters for pre-filling the form
  useEffect(() => {
    const clientId = searchParams.get('client');
    if (clientId) {
      const client = state.clients.find(c => c.id === clientId);
      if (client) {
        setFormData(prev => ({
          ...prev,
          client: client.name,
          items: [{ description: '', quantity: 1, price: '', amount: '' }],
        }));
        setIsModalOpen(true);
      }
    }
  }, [searchParams, state.clients]);

  // Filter invoices based on search query, client name, status, and date range
  const filteredInvoices = state.invoices.filter(invoice => {
    const matchesClientName = clientName ? invoice.client === clientName : true;
    const matchesSearch = filterOptions.searchQuery === '' || 
      invoice.id.toLowerCase().includes(filterOptions.searchQuery.toLowerCase()) ||
      invoice.amount.toLowerCase().includes(filterOptions.searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(filterOptions.searchQuery.toLowerCase());
    
    const matchesStatus = filterOptions.status === 'all' || invoice.status === filterOptions.status;
    
    const matchesDateRange = (!filterOptions.dateRange.start || invoice.date >= filterOptions.dateRange.start) &&
                           (!filterOptions.dateRange.end || invoice.date <= filterOptions.dateRange.end);
    
    const invoiceAmount = parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ''));
    const matchesAmountRange = (!filterOptions.amountRange.min || invoiceAmount >= parseFloat(filterOptions.amountRange.min)) &&
                             (!filterOptions.amountRange.max || invoiceAmount <= parseFloat(filterOptions.amountRange.max));
    
    return matchesClientName && matchesSearch && matchesStatus && matchesDateRange && matchesAmountRange;
  });

  const handleExport = () => {
    const csvContent = [
      ['Invoice ID', 'Client', 'Amount', 'Status', 'Date', 'Due Date', 'Notes'],
      ...filteredInvoices.map(invoice => [
        invoice.id,
        invoice.client,
        invoice.amount,
        invoice.status,
        invoice.date,
        invoice.dueDate || '',
        invoice.notes || '',
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `invoices_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invoiceData = {
      id: editingInvoice ? editingInvoice.id : `INV${String(state.invoices.length + 1).padStart(3, '0')}`,
      ...formData,
      total: formData.items.reduce((sum, item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        return sum + (item.quantity * (price || 0));
      }, 0),
    };

    if (editingInvoice) {
      dispatch({
        type: 'UPDATE_INVOICE',
        payload: invoiceData,
      });
    } else {
      dispatch({
        type: 'ADD_INVOICE',
        payload: invoiceData,
      });
    }
    handleCloseModal();
    if (isModal && onClose) {
      onClose();
    }
  };

  const handleEdit = (invoice: any) => {
    setEditingInvoice(invoice);
    setFormData({
      client: invoice.client,
      amount: invoice.amount,
      status: invoice.status,
      date: invoice.date,
      dueDate: invoice.dueDate,
      notes: invoice.notes,
      items: invoice.items,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingInvoice(null);
    setSelectedClient('');
    setNewClientName('');
    setFormData({
      client: '',
      amount: '',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      notes: '',
      items: [{ description: '', quantity: 1, price: '', amount: '' }],
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

  const handleFilterChange = (field: keyof FilterOptions, value: any) => {
    setFilterOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResetFilters = () => {
    setFilterOptions({
      status: 'all',
      dateRange: { start: '', end: '' },
      amountRange: { min: '', max: '' },
      searchQuery: '',
    });
  };

  const handleCreateBill = () => {
    if (newInvoice) {
      navigate('/bills', {
        state: {
          createFromInvoice: true,
          invoiceData: newInvoice,
        },
      });
    }
    setShowBillPrompt(false);
  };

  const handleAddItem = () => {
    setFormData(prevState => ({
      ...prevState,
      items: [...prevState.items, { description: '', quantity: 1, price: '', amount: '' }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prevState => ({
      ...prevState,
      items: prevState.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setFormData(prevState => {
      const newItems = [...prevState.items];
      newItems[index] = { 
        ...newItems[index], 
        [field]: value
      };

      // Calculate amount only if both quantity and price are valid numbers
      if (field === 'price' || field === 'quantity') {
        const quantity = field === 'quantity' ? Number(value) : Number(newItems[index].quantity);
        const price = field === 'price' ? Number(value) : Number(newItems[index].price);
        
        if (!isNaN(quantity) && !isNaN(price)) {
          newItems[index].amount = `₹${(quantity * price).toFixed(2)}`;
        }
      }

      return { ...prevState, items: newItems };
    });
  };

  if (isModal) {
    return (
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="client" className="block text-sm font-medium text-gray-700">
              Client
            </label>
            {clientName ? (
              <input
                type="text"
                value={clientName}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
              />
            ) : (
              <select
                id="client"
                value={formData.client}
                onChange={(e) => setFormData(prevState => ({ ...prevState, client: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                required
              >
                <option value="">Select a client</option>
                {state.clients
                  .filter(client => client.status === 'Active')
                  .map((client) => (
                    <option key={client.id} value={client.name}>
                      {client.name}
                    </option>
                  ))}
              </select>
            )}
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="text"
              id="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Pending' | 'Paid' | 'Overdue' })}
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
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              rows={3}
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Items</h3>
            <div className="grid grid-cols-4 gap-2 mb-2">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Description</label>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Unit Price (₹)</label>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
              </div>
            </div>
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Enter item description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="col-span-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                  aria-label="Item Description"
                />
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  className="col-span-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                  min="1"
                  aria-label="Quantity"
                />
                <input
                  type="number"
                  placeholder="Enter price"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  className="col-span-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                  min="0"
                  step="0.01"
                  aria-label="Unit Price"
                />
                <div className="col-span-1 flex items-center">
                  <span className="flex-1 text-sm text-gray-900">₹{item.amount}</span>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-800 ml-2"
                      title="Remove Item"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="mt-2 grid grid-cols-4 gap-2 text-sm text-gray-500">
              <div className="col-span-2"></div>
              <div>
                <p className="font-medium">Sub Total: ₹{formData.items.reduce((sum, item) => {
                  const amount = parseFloat(item.amount?.replace(/[^0-9.-]+/g, '') || '0');
                  return sum + (isNaN(amount) ? 0 : amount);
                }, 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="font-medium">GST (18%): ₹{(formData.items.reduce((sum, item) => {
                  const amount = parseFloat(item.amount?.replace(/[^0-9.-]+/g, '') || '0');
                  return sum + (isNaN(amount) ? 0 : amount);
                }, 0) * 0.18).toFixed(2)}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="col-span-2"></div>
              <div className="col-span-2">
                <p className="font-medium text-lg text-gray-900">Total Amount: ₹{(formData.items.reduce((sum, item) => {
                  const amount = parseFloat(item.amount?.replace(/[^0-9.-]+/g, '') || '0');
                  return sum + (isNaN(amount) ? 0 : amount);
                }, 0) * 1.18).toFixed(2)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="mt-4 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Another Item
            </button>
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
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            {clientName ? `Invoices for ${clientName}` : 'Invoices'}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {clientName 
              ? `A list of all invoices for ${clientName}.`
              : 'A list of all invoices in your account including their status and amount.'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm w-64"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </span>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
            >
              <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Export
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Summary Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Invoices</dt>
                  <dd className="text-lg font-medium text-gray-900">{invoiceSummary.totalInvoices}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Amount</dt>
                  <dd className="text-lg font-medium text-gray-900">₹{invoiceSummary.totalAmount.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Invoice</dt>
                  <dd className="text-lg font-medium text-gray-900">₹{invoiceSummary.averageInvoiceAmount.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Amount</dt>
                  <dd className="text-lg font-medium text-yellow-600">₹{invoiceSummary.pendingAmount.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary Section */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Summary</h3>
          
          {/* Daily Sales Chart */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Daily Sales</h4>
            <div className="h-64 bg-gray-50 rounded-lg p-4">
              <div className="flex flex-col h-full">
                {financialSummary.dailySales.slice(0, 7).map((day, index) => (
                  <div key={day.date} className="flex items-center mb-2">
                    <div className="w-24 text-sm text-gray-600">{day.date}</div>
                    <div className="flex-1">
                      <div className="h-4 bg-primary-100 rounded-full">
                        <div
                          className="h-full bg-primary-600 rounded-full"
                          style={{ width: `${(day.amount / financialSummary.totalSales) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ₹{day.amount.toFixed(2)} ({day.count} invoices)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Metrics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700">Total Sales</h4>
              <p className="mt-2 text-2xl font-semibold text-gray-900">₹{financialSummary.totalSales.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700">Total Expenses</h4>
              <p className="mt-2 text-2xl font-semibold text-red-600">₹{financialSummary.totalExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700">Net Profit</h4>
              <p className="mt-2 text-2xl font-semibold text-green-600">₹{financialSummary.netProfit.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700">Total GST</h4>
              <p className="mt-2 text-2xl font-semibold text-gray-900">₹{financialSummary.taxSummary.totalGST.toFixed(2)}</p>
            </div>
          </div>

          {/* Tax Breakdown */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tax Breakdown</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-700">CGST</h5>
                <p className="mt-1 text-lg font-semibold text-gray-900">₹{financialSummary.taxSummary.totalCGST.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-700">SGST</h5>
                <p className="mt-1 text-lg font-semibold text-gray-900">₹{financialSummary.taxSummary.totalSGST.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-700">IGST</h5>
                <p className="mt-1 text-lg font-semibold text-gray-900">₹{financialSummary.taxSummary.totalIGST.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-700">Total GST</h5>
                <p className="mt-1 text-lg font-semibold text-gray-900">₹{financialSummary.taxSummary.totalGST.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Status</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-green-50 rounded-lg p-4">
                <h5 className="text-sm font-medium text-green-700">Paid</h5>
                <p className="mt-1 text-lg font-semibold text-green-700">{financialSummary.paymentStatus.paid}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <h5 className="text-sm font-medium text-yellow-700">Pending</h5>
                <p className="mt-1 text-lg font-semibold text-yellow-700">{financialSummary.paymentStatus.pending}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <h5 className="text-sm font-medium text-red-700">Overdue</h5>
                <p className="mt-1 text-lg font-semibold text-red-700">{financialSummary.paymentStatus.overdue}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Filter Options</h3>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-sm text-primary-600 hover:text-primary-900"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={filterOptions.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date Range
              </label>
              <div className="mt-1 flex space-x-2">
                <input
                  type="date"
                  value={filterOptions.dateRange.start}
                  onChange={(e) => handleFilterChange('dateRange', { ...filterOptions.dateRange, start: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                <input
                  type="date"
                  value={filterOptions.dateRange.end}
                  onChange={(e) => handleFilterChange('dateRange', { ...filterOptions.dateRange, end: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Amount Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount Range
              </label>
              <div className="mt-1 flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filterOptions.amountRange.min}
                  onChange={(e) => handleFilterChange('amountRange', { ...filterOptions.amountRange, min: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filterOptions.amountRange.max}
                  onChange={(e) => handleFilterChange('amountRange', { ...filterOptions.amountRange, max: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Search Filter */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="search"
                  value={filterOptions.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  placeholder="Search invoices..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {filterOptions.status !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  Status: {filterOptions.status}
                </span>
              )}
              {filterOptions.dateRange.start && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  From: {filterOptions.dateRange.start}
                </span>
              )}
              {filterOptions.dateRange.end && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  To: {filterOptions.dateRange.end}
                </span>
              )}
              {filterOptions.amountRange.min && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  Min: ₹{filterOptions.amountRange.min}
                </span>
              )}
              {filterOptions.amountRange.max && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  Max: ₹{filterOptions.amountRange.max}
                </span>
              )}
              {filterOptions.searchQuery && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  Search: {filterOptions.searchQuery}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Invoice ID
                    </th>
                    {!clientName && (
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Client
                      </th>
                    )}
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {invoice.id}
                      </td>
                      {!clientName && (
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <Link
                            to={`/clients`}
                            className="inline-flex items-center text-primary-600 hover:text-primary-900"
                          >
                            <UserIcon className="h-5 w-5 mr-1" />
                            {invoice.client}
                          </Link>
                        </td>
                      )}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {invoice.amount}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            statusStyles[invoice.status as keyof typeof statusStyles]
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {invoice.date}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          to={`/bills?invoice=${invoice.id}`}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                          title="View/Create Bill"
                        >
                          <DocumentDuplicateIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.id)}
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
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingInvoice ? 'Edit Invoice' : 'New Invoice'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="client" className="block text-sm font-medium text-gray-700">
              Client
            </label>
            {clientName ? (
              <input
                type="text"
                value={clientName}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
              />
            ) : (
              <select
                id="client"
                value={formData.client}
                onChange={(e) => setFormData(prevState => ({ ...prevState, client: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                required
              >
                <option value="">Select a client</option>
                {state.clients
                  .filter(client => client.status === 'Active')
                  .map((client) => (
                    <option key={client.id} value={client.name}>
                      {client.name}
                    </option>
                  ))}
              </select>
            )}
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="text"
              id="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Pending' | 'Paid' | 'Overdue' })}
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
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              rows={3}
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Items</h3>
            <div className="grid grid-cols-4 gap-2 mb-2">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Description</label>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Unit Price (₹)</label>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
              </div>
            </div>
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Enter item description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="col-span-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                  aria-label="Item Description"
                />
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  className="col-span-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                  min="1"
                  aria-label="Quantity"
                />
                <input
                  type="number"
                  placeholder="Enter price"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  className="col-span-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                  min="0"
                  step="0.01"
                  aria-label="Unit Price"
                />
                <div className="col-span-1 flex items-center">
                  <span className="flex-1 text-sm text-gray-900">₹{item.amount}</span>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-800 ml-2"
                      title="Remove Item"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="mt-2 grid grid-cols-4 gap-2 text-sm text-gray-500">
              <div className="col-span-2"></div>
              <div>
                <p className="font-medium">Sub Total: ₹{formData.items.reduce((sum, item) => {
                  const amount = parseFloat(item.amount?.replace(/[^0-9.-]+/g, '') || '0');
                  return sum + (isNaN(amount) ? 0 : amount);
                }, 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="font-medium">GST (18%): ₹{(formData.items.reduce((sum, item) => {
                  const amount = parseFloat(item.amount?.replace(/[^0-9.-]+/g, '') || '0');
                  return sum + (isNaN(amount) ? 0 : amount);
                }, 0) * 0.18).toFixed(2)}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="col-span-2"></div>
              <div className="col-span-2">
                <p className="font-medium text-lg text-gray-900">Total Amount: ₹{(formData.items.reduce((sum, item) => {
                  const amount = parseFloat(item.amount?.replace(/[^0-9.-]+/g, '') || '0');
                  return sum + (isNaN(amount) ? 0 : amount);
                }, 0) * 1.18).toFixed(2)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="mt-4 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Another Item
            </button>
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

      {/* Bill Creation Prompt */}
      <FormModal
        isOpen={showBillPrompt}
        onClose={() => setShowBillPrompt(false)}
        title="Create Bill"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Would you like to create a bill for this invoice?
          </p>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleCreateBill}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Create Bill
            </button>
            <button
              type="button"
              onClick={() => setShowBillPrompt(false)}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Skip for Now
            </button>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default Invoices; 