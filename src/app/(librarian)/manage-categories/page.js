'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { categoryService } from '@/services/categoryService';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';

export default function ManageCategoriesPage() {
  const { user, isLibrarian } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!isLibrarian) {
      router.push('/books');
      return;
    }
    fetchCategories();
  }, [user, isLibrarian]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
    } else {
      setEditingCategory(null);
      setCategoryName('');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setCategoryName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!categoryName.trim()) {
      setMessage({ type: 'error', text: 'Category name is required' });
      return;
    }

    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, { name: categoryName });
        setMessage({ type: 'success', text: 'Category updated successfully!' });
      } else {
        await categoryService.createCategory({ name: categoryName });
        setMessage({ type: 'success', text: 'Category created successfully!' });
      }
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data || 'Failed to save category' 
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoryService.deleteCategory(id);
      setMessage({ type: 'success', text: 'Category deleted successfully!' });
      fetchCategories();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete category' });
    }
  };

  if (!user || !isLibrarian) return null;
  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary-800 hover:bg-primary-900 text-white px-6 py-2 rounded-md font-medium"
        >
          Add New Category
        </button>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No categories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {category.id}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="text-primary-600 hover:text-primary-800 p-2"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Fiction, Science, History"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-800 hover:bg-primary-900 text-white py-2 rounded-md font-medium"
          >
            {editingCategory ? 'Update Category' : 'Add Category'}
          </button>
        </form>
      </Modal>
    </div>
  );
}