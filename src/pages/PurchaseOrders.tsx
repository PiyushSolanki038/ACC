import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import FormModal from '../components/FormModal';

interface PurchaseOrder {
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

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const PurchaseOrders: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierContact: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    status: 'Pending' as PurchaseOrder['status'],
    items: [{ productId: '', quantity: 0, unitPrice: 0, amount: 0 }],
    totalAmount: 0,
    gstAmount: 0,
    grandTotal: 0,
    notes: '',
    date: '',
  });

  // Filter purchase orders based on search query
  const filteredOrders = state.purchaseOrders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateAmounts = (items: typeof formData.items) => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    const gst = total * 0.18; // Assuming 18% GST
    return {
      totalAmount: total,
      gstAmount: gst,
      grandTotal: total + gst,
    };
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };

    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(newItems[index].quantity.toString());
      const unitPrice = parseFloat(newItems[index].unitPrice.toString());
      newItems[index].amount = quantity * unitPrice;
    }

    const amounts = calculateAmounts(newItems);
    setFormData({
      ...formData,
      items: newItems,
      ...amounts,
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 0, unitPrice: 0, amount: 0 }],
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const amounts = calculateAmounts(newItems);
    setFormData({
      ...formData,
      items: newItems,
      ...amounts,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
      dispatch({
        type: 'UPDATE_PURCHASE_ORDER',
        payload: {
          ...editingOrder,
          ...formData,
          date: new Date().toISOString().split('T')[0],
        },
      });
    } else {
      const newOrder: PurchaseOrder = {
        id: `PO${String(state.purchaseOrders.length + 1).padStart(3, '0')}`,
        ...formData,
        date: new Date().toISOString().split('T')[0],
      };
      dispatch({
        type: 'ADD_PURCHASE_ORDER',
        payload: newOrder,
      });
    }
    handleCloseModal();
  };

  const handleEdit = (order: PurchaseOrder) => {
    setEditingOrder(order);
    setFormData({
      supplierName: order.supplierName,
      supplierContact: order.supplierContact,
      orderDate: order.orderDate,
      expectedDeliveryDate: order.expectedDeliveryDate,
      status: order.status,
      items: order.items,
      totalAmount: order.totalAmount,
      gstAmount: order.gstAmount,
      grandTotal: order.grandTotal,
      notes: order.notes,
      date: order.date,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      dispatch({ type: 'DELETE_PURCHASE_ORDER', payload: id });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
    setFormData({
      supplierName: '',
      supplierContact: '',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: '',
      status: 'Pending',
      items: [{ productId: '', quantity: 0, unitPrice: 0, amount: 0 }],
      totalAmount: 0,
      gstAmount: 0,
      grandTotal: 0,
      notes: '',
      date: '',
    });
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Purchase Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your copper material purchase orders and track deliveries.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
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
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Purchase Order
            </button>
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
                      Order ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Supplier
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Order Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Expected Delivery
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Total Amount
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {order.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {order.supplierName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {order.orderDate}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {order.expectedDeliveryDate}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            statusStyles[order.status]
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ₹{order.grandTotal.toFixed(2)}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(order)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
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
        title={editingOrder ? 'Edit Purchase Order' : 'New Purchase Order'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700">
              Supplier Name
            </label>
            <input
              type="text"
              id="supplierName"
              value={formData.supplierName}
              onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="supplierContact" className="block text-sm font-medium text-gray-700">
              Supplier Contact
            </label>
            <input
              type="text"
              id="supplierContact"
              value={formData.supplierContact}
              onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700">
              Order Date
            </label>
            <input
              type="date"
              id="orderDate"
              value={formData.orderDate}
              onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="expectedDeliveryDate" className="block text-sm font-medium text-gray-700">
              Expected Delivery Date
            </label>
            <input
              type="date"
              id="expectedDeliveryDate"
              value={formData.expectedDeliveryDate}
              onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, status: e.target.value as PurchaseOrder['status'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Order Items</label>
              <button
                type="button"
                onClick={addItem}
                className="text-sm text-primary-600 hover:text-primary-900"
              >
                + Add Item
              </button>
            </div>
            {formData.items.map((item, index) => (
              <div key={index} className="mb-4 p-4 border rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Item {index + 1}</h4>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-sm text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product</label>
                    <select
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="">Select a product</option>
                      {state.products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Unit Price (₹)</label>
                    <input
                      type="text"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Amount (₹)</label>
                    <input
                      type="text"
                      value={item.amount}
                      readOnly
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sub Total (₹)</label>
              <input
                type="text"
                value={formData.totalAmount}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">GST (₹)</label>
              <input
                type="text"
                value={formData.gstAmount}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Grand Total (₹)</label>
              <input
                type="text"
                value={formData.grandTotal}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
              />
            </div>
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

          <div className="mt-5 sm:mt-6">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:text-sm"
            >
              {editingOrder ? 'Update Purchase Order' : 'Create Purchase Order'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};

export default PurchaseOrders; 