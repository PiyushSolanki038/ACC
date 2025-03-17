import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import FormModal from '../components/FormModal';

interface Product {
  id: string;
  name: string;
  description: string;
  category: 'Copper Wire' | 'Copper Sheet' | 'Copper Pipe' | 'Copper Fitting' | 'Copper Cotton Wire' | 'Electric Items' | 'Plastic Items' | 'Tools' | 'Other';
  unit: 'kg' | 'meter' | 'piece' | 'roll';
  pricePerUnit: string;
  currentStock: number;
  minimumStock: number;
  gstRate: number;
  lastUpdated: string;
  supplier?: string;
  location?: string;
  reorderPoint?: number;
  lastPurchaseDate?: string;
  lastPurchasePrice?: string;
}

const Products: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Copper Wire' as Product['category'],
    unit: 'kg' as Product['unit'],
    pricePerUnit: '',
    currentStock: 0,
    minimumStock: 0,
    gstRate: 18,
  });

  // Filter products based on search query
  const filteredProducts = state.products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      const newProduct: Product = {
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

  const handleEdit = (product: Product) => {
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
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    }
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
    });
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your copper products, inventory, and pricing.
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

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Product Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Stock
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Price/Unit
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      GST
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {product.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {product.category}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={product.currentStock <= product.minimumStock ? 'text-red-600' : 'text-green-600'}>
                          {product.currentStock} {product.unit}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ₹{product.pricePerUnit}/{product.unit}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {product.gstRate}%
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
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
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Product['category'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="Copper Wire">Copper Wire</option>
              <option value="Copper Sheet">Copper Sheet</option>
              <option value="Copper Pipe">Copper Pipe</option>
              <option value="Copper Fitting">Copper Fitting</option>
              <option value="Copper Cotton Wire">Copper Cotton Wire</option>
              <option value="Electric Items">Electric Items</option>
              <option value="Plastic Items">Plastic Items</option>
              <option value="Tools">Tools</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <select
              id="unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value as Product['unit'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
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
              type="text"
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
              Minimum Stock Level
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
            <select
              id="gstRate"
              value={formData.gstRate}
              onChange={(e) => setFormData({ ...formData, gstRate: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>
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
    </div>
  );
};

export default Products; 