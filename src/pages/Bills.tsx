import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, PrinterIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import FormModal from '../components/FormModal';
import { useSearchParams } from 'react-router-dom';

interface BillItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  gstAmount: number;
  totalAmount: number;
}

interface Bill {
  id: string;
  billNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  dueDate: string;
  items: BillItem[];
  status: 'Pending' | 'Paid' | 'Overdue';
  notes: string;
  subTotal: number;
  totalGST: number;
  grandTotal: number;
}

type BillFormData = Omit<Bill, 'id' | 'billNumber'>;

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Paid: 'bg-green-100 text-green-800',
  Overdue: 'bg-red-100 text-red-800',
};

interface BillsProps {
  clientName?: string;
  isModal?: boolean;
  onClose?: () => void;
}

const Bills: React.FC<BillsProps> = ({ clientName, isModal, onClose }) => {
  const { state, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<BillFormData>({
    customerName: clientName || '',
    customerPhone: '',
    customerEmail: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [],
    status: 'Pending',
    subTotal: 0,
    totalGST: 0,
    grandTotal: 0,
    notes: ''
  });

  // Handle URL parameters for pre-filling the form
  useEffect(() => {
    const invoiceId = searchParams.get('invoice');
    const clientId = searchParams.get('client');

    if (invoiceId) {
      const invoice = state.invoices.find(inv => inv.id === invoiceId);
      if (invoice) {
        const client = state.clients.find(c => c.name === invoice.client);
        const amount = parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ''));
        const gstRate = 18; // Default GST rate
        const gstAmount = amount * (gstRate / 100);
        const totalAmount = amount + gstAmount;
        
        setFormData({
          ...formData,
          customerName: invoice.client,
          customerPhone: client?.phone || '',
          customerEmail: client?.email || '',
          items: [{
            productId: '',
            quantity: 1,
            unitPrice: amount,
            amount: amount,
            gstAmount: gstAmount,
            totalAmount: totalAmount
          }],
          status: invoice.status,
          subTotal: amount,
          totalGST: gstAmount,
          grandTotal: totalAmount,
          notes: ''
        });
        setIsModalOpen(true);
      }
    }

    if (clientId) {
      const client = state.clients.find(c => c.id === clientId);
      if (client) {
        setFormData({
          ...formData,
          customerName: client.name,
          items: [{ productId: '', quantity: 0, unitPrice: 0, amount: 0, gstAmount: 0, totalAmount: 0 }],
        });
        setIsModalOpen(true);
      }
    }
  }, [searchParams, state.invoices, state.clients]);

  // Filter bills based on search query
  const filteredBills = state.bills.filter(bill =>
    bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bill.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bill.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateItemAmounts = (productId: string, quantity: number, unitPrice: number): Partial<BillItem> => {
    const product = state.products.find(p => p.id === productId);
    const gstRate = product?.gstRate || 0;
    const amount = quantity * unitPrice;
    const gstAmount = (amount * gstRate) / 100;
    const totalAmount = amount + gstAmount;
    return { amount, gstAmount, totalAmount };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBillData: Bill = {
      id: Date.now().toString(),
      billNumber: `BILL-${Date.now()}`,
      ...formData,
      subTotal: formData.subTotal,
      totalGST: formData.totalGST,
      grandTotal: formData.grandTotal
    };
    dispatch({ type: 'ADD_BILL', payload: finalBillData });
    if (onClose) onClose();
  };

  const handleItemChange = (index: number, field: keyof BillItem, value: string | number) => {
    const newItems = [...formData.items];
    const item = newItems[index];
    
    if (field === 'productId') {
      const product = state.products.find(p => p.id === value);
      const unitPrice = product?.pricePerUnit ? Number(product.pricePerUnit) : 0;
      const quantity = item?.quantity || 0;
      const amounts = calculateItemAmounts(value as string, quantity, unitPrice);
      
      newItems[index] = {
        ...item,
        productId: value as string,
        quantity,
        unitPrice,
        ...amounts
      };
    } else if (field === 'quantity' || field === 'unitPrice') {
      const numValue = Number(value);
      const amounts = calculateItemAmounts(
        item.productId,
        field === 'quantity' ? numValue : item.quantity,
        field === 'unitPrice' ? numValue : item.unitPrice
      );
      
      newItems[index] = {
        ...item,
        [field]: numValue,
        ...amounts
      };
    }

    const subTotal = newItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalGST = newItems.reduce((sum, item) => sum + (item.gstAmount || 0), 0);
    const grandTotal = subTotal + totalGST;

    setFormData(prev => ({
      ...prev,
      items: newItems,
      subTotal,
      totalGST,
      grandTotal
    }));
  };

  const addItem = () => {
    const newItem: BillItem = {
      productId: '',
      quantity: 0,
      unitPrice: 0,
      amount: 0,
      gstAmount: 0,
      totalAmount: 0
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => {
      const newItems = prev.items.filter((_, i) => i !== index);
      const subTotal = newItems.reduce((sum, item) => sum + (item.amount || 0), 0);
      const totalGST = newItems.reduce((sum, item) => sum + (item.gstAmount || 0), 0);
      const grandTotal = subTotal + totalGST;
      
      return {
        ...prev,
        items: newItems,
        subTotal,
        totalGST,
        grandTotal
      };
    });
  };

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
    setFormData({
      customerName: bill.customerName,
      customerPhone: bill.customerPhone,
      customerEmail: bill.customerEmail,
      status: bill.status,
      date: bill.date,
      dueDate: bill.dueDate,
      items: bill.items,
      subTotal: bill.subTotal,
      totalGST: bill.totalGST,
      grandTotal: bill.grandTotal,
      notes: bill.notes
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      dispatch({ type: 'DELETE_BILL', payload: id });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBill(null);
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      items: [{ productId: '', quantity: 0, unitPrice: 0, amount: 0, gstAmount: 0, totalAmount: 0 }],
      subTotal: 0,
      totalGST: 0,
      grandTotal: 0,
      notes: ''
    });
  };

  const handlePrint = (bill: Bill) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Bill ${bill.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .bill-info { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
              .totals { margin-top: 20px; }
              .notes { margin-top: 20px; }
              @media print {
                body { padding: 0; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Bill</h1>
              <h2>${bill.id}</h2>
            </div>
            
            <div class="bill-info">
              <p><strong>Customer:</strong> ${bill.customerName}</p>
              <p><strong>Date:</strong> ${bill.date}</p>
              <p><strong>Due Date:</strong> ${bill.dueDate}</p>
              <p><strong>Status:</strong> ${bill.status}</p>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                  <th>GST</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${bill.items.map(item => {
                  const product = state.products.find(p => p.id === item.productId);
                  return `
                    <tr>
                      <td>${product?.name || 'Unknown Product'}</td>
                      <td>${item.quantity}</td>
                      <td>₹${item.unitPrice.toFixed(2)}</td>
                      <td>₹${item.amount.toFixed(2)}</td>
                      <td>₹${(item.unitPrice * 0.18).toFixed(2)}</td>
                      <td>₹${item.totalAmount.toFixed(2)}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>

            <div class="totals">
              <p><strong>Sub Total:</strong> ₹${bill.subTotal.toFixed(2)}</p>
              <p><strong>Total GST:</strong> ₹${bill.totalGST.toFixed(2)}</p>
              <p><strong>Grand Total:</strong> ₹${bill.grandTotal.toFixed(2)}</p>
            </div>

            ${bill.items.length > 0 ? `
              <div class="notes">
                <h3>Items:</h3>
                <ul>
                  ${bill.items.map(item => `<li>${item.productId} - ${item.quantity} x ₹${item.unitPrice.toFixed(2)} = ₹${item.amount.toFixed(2)}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background-color: #4F46E5; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print Bill
            </button>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (isModal) {
    return (
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bill Items */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Items</label>
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-2">
                <select
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                  className="col-span-2 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                >
                  <option value="">Select Product</option>
                  {state.products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ₹{product.pricePerUnit}/{product.unit}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                  min="1"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                  className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                  min="0"
                  step="0.01"
                />
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Item
            </button>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'Pending' | 'Paid' | 'Overdue' }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Create Bill
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Regular bills view (when not in modal)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Bills</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your bills and expenses
          </p>
        </div>
      </div>

      {/* Bills table */}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                Bill ID
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Due Date
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Amount
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {state.bills
              .filter(bill => !clientName || bill.customerName === clientName)
              .map((bill) => (
                <tr key={bill.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {bill.id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {bill.date}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {bill.dueDate}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    ₹{bill.grandTotal.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        bill.status === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : bill.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {bill.status}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      onClick={() => handlePrint(bill)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                      title="Print Bill"
                    >
                      <PrinterIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(bill)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(bill.id)}
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
  );
};

export default Bills; 