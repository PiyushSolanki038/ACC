import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, PrinterIcon, ChartBarIcon, DocumentArrowDownIcon, ClipboardDocumentListIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import FormModal from '../components/FormModal';

interface StockUpdate {
  productId: string;
  quantity: number;
  type: 'add' | 'remove';
  reason: string;
  date: string;
}

interface QuickStats {
  totalProducts: number;
  lowStockItems: number;
  totalValue: number;
  recentUpdates: number;
}

interface StockHistory {
  id: string;
  productId: string;
  date: string;
  type: 'add' | 'remove';
  quantity: number;
  reason: string;
  previousStock: number;
  newStock: number;
  unit: string;
}

const categoryStyles = {
  'Copper Wire': 'bg-blue-100 text-blue-800',
  'Copper Sheet': 'bg-green-100 text-green-800',
  'Copper Pipe': 'bg-purple-100 text-purple-800',
  'Copper Fitting': 'bg-yellow-100 text-yellow-800',
  'Copper Cotton Wire': 'bg-pink-100 text-pink-800',
  'Electric Items': 'bg-indigo-100 text-indigo-800',
  'Plastic Items': 'bg-orange-100 text-orange-800',
  'Tools': 'bg-red-100 text-red-800',
  'Other': 'bg-gray-100 text-gray-800',
};

const Inventory: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Copper Wire' as keyof typeof categoryStyles,
    unit: 'kg' as const,
    pricePerUnit: '',
    currentStock: 0,
    minimumStock: 0,
    gstRate: 18,
    supplier: '',
    location: '',
    reorderPoint: 0,
    lastPurchaseDate: '',
    lastPurchasePrice: '',
  });
  const [stockUpdate, setStockUpdate] = useState<StockUpdate>({
    productId: '',
    quantity: 0,
    type: 'add',
    reason: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printOptions, setPrintOptions] = useState({
    includeLowStock: true,
    includeMediumStock: true,
    includeInStock: true,
    includeAllCategories: true,
    selectedCategories: [] as string[],
  });
  const [quickStats, setQuickStats] = useState<QuickStats>({
    totalProducts: 0,
    lowStockItems: 0,
    totalValue: 0,
    recentUpdates: 0,
  });
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkUpdate, setBulkUpdate] = useState({
    quantity: 0,
    type: 'add' as 'add' | 'remove',
    reason: '',
  });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isStockHistoryModalOpen, setIsStockHistoryModalOpen] = useState(false);
  const [selectedProductHistory, setSelectedProductHistory] = useState<any>(null);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);

  // Filter products based on search query
  const filteredProducts = state.products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate quick stats
  useEffect(() => {
    const stats = {
      totalProducts: state.products.length,
      lowStockItems: state.products.filter(p => p.currentStock <= p.minimumStock).length,
      totalValue: state.products.reduce((sum, p) => sum + (p.currentStock * Number(p.pricePerUnit)), 0),
      recentUpdates: state.products.filter(p => {
        const lastUpdate = new Date(p.lastUpdated);
        const today = new Date();
        return (today.getTime() - lastUpdate.getTime()) <= 7 * 24 * 60 * 60 * 1000; // Last 7 days
      }).length,
    };
    setQuickStats(stats);
  }, [state.products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      dispatch({
        type: 'UPDATE_PRODUCT',
        payload: {
          ...editingProduct,
          ...formData,
          lastUpdated: new Date().toISOString().split('T')[0],
        },
      });
    } else {
      const newProduct = {
        id: `PRD${String(state.products.length + 1).padStart(3, '0')}`,
        ...formData,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      dispatch({
        type: 'ADD_PRODUCT',
        payload: newProduct,
      });
    }
    handleCloseModal();
  };

  const handleStockUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct) {
      const previousStock = selectedProduct.currentStock;
      const newStock = stockUpdate.type === 'add'
        ? selectedProduct.currentStock + stockUpdate.quantity
        : selectedProduct.currentStock - stockUpdate.quantity;

      const updatedProduct = {
        ...selectedProduct,
        currentStock: newStock,
        lastUpdated: new Date().toISOString().split('T')[0],
      };

      // Add to stock history
      const historyEntry: StockHistory = {
        id: `HIS${String(stockHistory.length + 1).padStart(3, '0')}`,
        productId: selectedProduct.id,
        date: stockUpdate.date,
        type: stockUpdate.type,
        quantity: stockUpdate.quantity,
        reason: stockUpdate.reason,
        previousStock,
        newStock,
        unit: selectedProduct.unit,
      };

      setStockHistory([...stockHistory, historyEntry]);
      dispatch({
        type: 'UPDATE_PRODUCT',
        payload: updatedProduct,
      });
      handleCloseStockModal();
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      unit: product.unit,
      pricePerUnit: product.pricePerUnit,
      currentStock: product.currentStock,
      minimumStock: product.minimumStock,
      gstRate: product.gstRate,
      supplier: product.supplier,
      location: product.location,
      reorderPoint: product.reorderPoint,
      lastPurchaseDate: product.lastPurchaseDate,
      lastPurchasePrice: product.lastPurchasePrice,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    }
  };

  const handleStockUpdateClick = (product: any) => {
    setSelectedProduct(product);
    setStockUpdate({
      ...stockUpdate,
      productId: product.id,
    });
    setIsStockModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: 'Copper Wire',
      unit: 'kg',
      pricePerUnit: '',
      currentStock: 0,
      minimumStock: 0,
      gstRate: 18,
      supplier: '',
      location: '',
      reorderPoint: 0,
      lastPurchaseDate: '',
      lastPurchasePrice: '',
    });
  };

  const handleCloseStockModal = () => {
    setIsStockModalOpen(false);
    setSelectedProduct(null);
    setStockUpdate({
      productId: '',
      quantity: 0,
      type: 'add',
      reason: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const getStockStatus = (currentStock: number, minimumStock: number) => {
    if (currentStock <= minimumStock) {
      return 'Low Stock';
    } else if (currentStock <= minimumStock * 1.5) {
      return 'Medium Stock';
    }
    return 'In Stock';
  };

  const getStockStatusStyle = (currentStock: number, minimumStock: number) => {
    if (currentStock <= minimumStock) {
      return 'bg-red-100 text-red-800';
    } else if (currentStock <= minimumStock * 1.5) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-green-100 text-green-800';
  };

  const handlePrint = () => {
    setIsPrintModalOpen(true);
  };

  const handlePrintSubmit = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      // Filter products based on print options
      let productsToPrint = filteredProducts;
      
      if (!printOptions.includeAllCategories) {
        productsToPrint = productsToPrint.filter(product => 
          printOptions.selectedCategories.includes(product.category)
        );
      }

      if (!printOptions.includeAllCategories) {
        productsToPrint = productsToPrint.filter(product => {
          const status = getStockStatus(product.currentStock, product.minimumStock);
          return (
            (status === 'Low Stock' && printOptions.includeLowStock) ||
            (status === 'Medium Stock' && printOptions.includeMediumStock) ||
            (status === 'In Stock' && printOptions.includeInStock)
          );
        });
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Inventory Report</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 8px; border: 1px solid #ddd; }
              th { background-color: #f5f5f5; }
              .header { text-align: center; margin-bottom: 20px; }
              .date { text-align: right; margin-bottom: 10px; }
              .summary { margin-bottom: 20px; }
              .low-stock { color: #dc2626; }
              .medium-stock { color: #d97706; }
              .in-stock { color: #059669; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Copper Shop Inventory Report</h1>
            </div>
            <div class="date">
              Generated on: ${new Date().toLocaleString()}
            </div>
            <div class="summary">
              <h3>Report Summary:</h3>
              <p>Total Products: ${productsToPrint.length}</p>
              <p>Low Stock Items: ${productsToPrint.filter(p => getStockStatus(p.currentStock, p.minimumStock) === 'Low Stock').length}</p>
              <p>Medium Stock Items: ${productsToPrint.filter(p => getStockStatus(p.currentStock, p.minimumStock) === 'Medium Stock').length}</p>
              <p>In Stock Items: ${productsToPrint.filter(p => getStockStatus(p.currentStock, p.minimumStock) === 'In Stock').length}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Minimum Stock</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                ${productsToPrint.map(product => `
                  <tr>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.currentStock} ${product.unit}</td>
                    <td>${product.minimumStock} ${product.unit}</td>
                    <td class="${getStockStatus(product.currentStock, product.minimumStock).toLowerCase().replace(' ', '-')}">
                      ${getStockStatus(product.currentStock, product.minimumStock)}
                    </td>
                    <td>${product.lastUpdated}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
    setIsPrintModalOpen(false);
  };

  const handleBulkUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    selectedProducts.forEach(productId => {
      const product = state.products.find(p => p.id === productId);
      if (product) {
        const updatedProduct = {
          ...product,
          currentStock: bulkUpdate.type === 'add'
            ? product.currentStock + bulkUpdate.quantity
            : product.currentStock - bulkUpdate.quantity,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
        dispatch({
          type: 'UPDATE_PRODUCT',
          payload: updatedProduct,
        });
      }
    });
    setIsBulkUpdateModalOpen(false);
    setSelectedProducts([]);
    setBulkUpdate({ quantity: 0, type: 'add', reason: '' });
  };

  const handleExport = (format: 'csv' | 'excel') => {
    const headers = ['Product', 'Category', 'Current Stock', 'Minimum Stock', 'Status', 'Last Updated', 'Price per Unit'];
    const data = filteredProducts.map(product => [
      product.name,
      product.category,
      `${product.currentStock} ${product.unit}`,
      `${product.minimumStock} ${product.unit}`,
      getStockStatus(product.currentStock, product.minimumStock),
      product.lastUpdated,
      product.pricePerUnit,
    ]);

    if (format === 'csv') {
      const csvContent = [
        headers.join(','),
        ...data.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      // For Excel, we'll create a simple HTML table that Excel can open
      const excelContent = `
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              table { border-collapse: collapse; }
              th, td { border: 1px solid black; padding: 8px; }
            </style>
          </head>
          <body>
            <table>
              <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
              ${data.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </table>
          </body>
        </html>
      `;
      
      const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.xls`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handleViewHistory = (product: any) => {
    setSelectedProductHistory(product);
    setIsStockHistoryModalOpen(true);
  };

  return (
    <div>
      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="text-lg font-medium text-gray-900">{quickStats.totalProducts}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Low Stock Items</dt>
                  <dd className="text-lg font-medium text-gray-900">{quickStats.lowStockItems}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardDocumentListIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Value</dt>
                  <dd className="text-lg font-medium text-gray-900">₹{quickStats.totalValue.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Recent Updates</dt>
                  <dd className="text-lg font-medium text-gray-900">{quickStats.recentUpdates}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your copper product inventory and stock levels.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm w-64"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </span>
            </div>
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
                onClick={() => setIsBulkUpdateModalOpen(true)}
                disabled={selectedProducts.length === filteredProducts.length}
              >
                <ClipboardDocumentListIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Bulk Update
              </button>
            </div>
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
                onClick={handlePrint}
              >
                <PrinterIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Print
              </button>
            </div>
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
                onClick={() => setIsModalOpen(true)}
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Product
              </button>
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
                    <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 sm:left-6"
                        checked={selectedProducts.length === filteredProducts.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts(filteredProducts.map(p => p.id));
                          } else {
                            setSelectedProducts([]);
                          }
                        }}
                      />
                    </th>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Product
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Current Stock
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Minimum Stock
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Last Updated
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 sm:left-6"
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts([...selectedProducts, product.id]);
                            } else {
                              setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                            }
                          }}
                        />
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {product.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            categoryStyles[product.category as keyof typeof categoryStyles]
                          }`}
                        >
                          {product.category}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {product.currentStock} {product.unit}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {product.minimumStock} {product.unit}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            getStockStatusStyle(product.currentStock, product.minimumStock)
                          }`}
                        >
                          {getStockStatus(product.currentStock, product.minimumStock)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {product.lastUpdated}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleViewHistory(product)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="View History"
                        >
                          <ClockIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleStockUpdateClick(product)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                          title="Update Stock"
                        >
                          {stockUpdate.type === 'add' ? (
                            <ArrowTrendingUpIcon className="h-5 w-5" />
                          ) : (
                            <ArrowTrendingDownIcon className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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
        title={editingProduct ? 'Edit Product' : 'New Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              rows={3}
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as keyof typeof categoryStyles })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            >
              {Object.keys(categoryStyles).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <select
              id="unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value as typeof formData.unit })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            >
              <option value="kg">Kilogram (kg)</option>
              <option value="meter">Meter</option>
              <option value="piece">Piece</option>
              <option value="roll">Roll</option>
            </select>
          </div>
          <div>
            <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700">
              Price per Unit (₹)
            </label>
            <input
              type="number"
              id="pricePerUnit"
              value={formData.pricePerUnit}
              onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="currentStock" className="block text-sm font-medium text-gray-700">
              Current Stock
            </label>
            <input
              type="number"
              id="currentStock"
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="minimumStock" className="block text-sm font-medium text-gray-700">
              Minimum Stock
            </label>
            <input
              type="number"
              id="minimumStock"
              value={formData.minimumStock}
              onChange={(e) => setFormData({ ...formData, minimumStock: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="gstRate" className="block text-sm font-medium text-gray-700">
              GST Rate (%)
            </label>
            <input
              type="number"
              id="gstRate"
              value={formData.gstRate}
              onChange={(e) => setFormData({ ...formData, gstRate: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
              Supplier
            </label>
            <input
              type="text"
              id="supplier"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Storage Location
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="reorderPoint" className="block text-sm font-medium text-gray-700">
              Reorder Point
            </label>
            <input
              type="number"
              id="reorderPoint"
              value={formData.reorderPoint}
              onChange={(e) => setFormData({ ...formData, reorderPoint: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="lastPurchaseDate" className="block text-sm font-medium text-gray-700">
              Last Purchase Date
            </label>
            <input
              type="date"
              id="lastPurchaseDate"
              value={formData.lastPurchaseDate}
              onChange={(e) => setFormData({ ...formData, lastPurchaseDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="lastPurchasePrice" className="block text-sm font-medium text-gray-700">
              Last Purchase Price
            </label>
            <input
              type="number"
              id="lastPurchasePrice"
              value={formData.lastPurchasePrice}
              onChange={(e) => setFormData({ ...formData, lastPurchasePrice: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:text-sm"
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </FormModal>

      <FormModal
        isOpen={isStockModalOpen}
        onClose={handleCloseStockModal}
        title="Update Stock"
      >
        <form onSubmit={handleStockUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product
            </label>
            <input
              type="text"
              value={selectedProduct?.name || ''}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Stock
            </label>
            <input
              type="text"
              value={`${selectedProduct?.currentStock || 0} ${selectedProduct?.unit || ''}`}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Update Type
            </label>
            <select
              id="type"
              value={stockUpdate.type}
              onChange={(e) => setStockUpdate({ ...stockUpdate, type: e.target.value as 'add' | 'remove' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="add">Add Stock</option>
              <option value="remove">Remove Stock</option>
            </select>
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={stockUpdate.quantity}
              onChange={(e) => setStockUpdate({ ...stockUpdate, quantity: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Reason
            </label>
            <textarea
              id="reason"
              value={stockUpdate.reason}
              onChange={(e) => setStockUpdate({ ...stockUpdate, reason: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              rows={3}
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={stockUpdate.date}
              onChange={(e) => setStockUpdate({ ...stockUpdate, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:text-sm"
            >
              Update Stock
            </button>
          </div>
        </form>
      </FormModal>

      <FormModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Print Options"
      >
        <form onSubmit={(e) => { e.preventDefault(); handlePrintSubmit(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock Status
            </label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={printOptions.includeLowStock}
                  onChange={(e) => setPrintOptions({ ...printOptions, includeLowStock: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include Low Stock Items</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={printOptions.includeMediumStock}
                  onChange={(e) => setPrintOptions({ ...printOptions, includeMediumStock: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include Medium Stock Items</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={printOptions.includeInStock}
                  onChange={(e) => setPrintOptions({ ...printOptions, includeInStock: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include In Stock Items</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categories
            </label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={printOptions.includeAllCategories}
                  onChange={(e) => setPrintOptions({ ...printOptions, includeAllCategories: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include All Categories</span>
              </label>
              {!printOptions.includeAllCategories && (
                <div className="mt-2 space-y-2">
                  {Object.keys(categoryStyles).map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={printOptions.selectedCategories.includes(category)}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...printOptions.selectedCategories, category]
                            : printOptions.selectedCategories.filter(c => c !== category);
                          setPrintOptions({ ...printOptions, selectedCategories: newCategories });
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 sm:mt-6">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:text-sm"
            >
              Print Report
            </button>
          </div>
        </form>
      </FormModal>

      <FormModal
        isOpen={isBulkUpdateModalOpen}
        onClose={() => {
          setIsBulkUpdateModalOpen(false);
          setSelectedProducts([]);
          setBulkUpdate({ quantity: 0, type: 'add', reason: '' });
        }}
        title="Bulk Update Stock"
      >
        <form onSubmit={handleBulkUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Update Type
            </label>
            <select
              value={bulkUpdate.type}
              onChange={(e) => setBulkUpdate({ ...bulkUpdate, type: e.target.value as 'add' | 'remove' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="add">Add Stock</option>
              <option value="remove">Remove Stock</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              value={bulkUpdate.quantity}
              onChange={(e) => setBulkUpdate({ ...bulkUpdate, quantity: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reason
            </label>
            <textarea
              value={bulkUpdate.reason}
              onChange={(e) => setBulkUpdate({ ...bulkUpdate, reason: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              rows={3}
              required
            />
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:text-sm"
            >
              Update {selectedProducts.length} Products
            </button>
          </div>
        </form>
      </FormModal>

      <FormModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Inventory"
      >
        <div className="space-y-4">
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => handleExport('csv')}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <DocumentArrowDownIcon className="-ml-1 mr-2 h-5 w-5" />
              Export as CSV
            </button>
            <button
              type="button"
              onClick={() => handleExport('excel')}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <DocumentArrowDownIcon className="-ml-1 mr-2 h-5 w-5" />
              Export as Excel
            </button>
          </div>
        </div>
      </FormModal>

      <FormModal
        isOpen={isStockHistoryModalOpen}
        onClose={() => {
          setIsStockHistoryModalOpen(false);
          setSelectedProductHistory(null);
        }}
        title={`Stock History - ${selectedProductHistory?.name}`}
      >
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Previous Stock</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">New Stock</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {stockHistory
                  .filter(entry => entry.productId === selectedProductHistory?.id)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(entry => (
                    <tr key={entry.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {entry.date}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          entry.type === 'add' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {entry.type === 'add' ? 'Added' : 'Removed'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {entry.quantity} {entry.unit}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {entry.previousStock} {entry.unit}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {entry.newStock} {entry.unit}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {entry.reason}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default Inventory; 