'use client';

import { useState, useEffect } from 'react';
import { bookService } from '@/services/bookService';
import { categoryService } from '@/services/categoryService';
import BookCard from '@/components/BookCard';
import Loading from '@/components/Loading';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    author: '',
    genre: '',
    language: ''
  });
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCategories();
    fetchBooks();
  }, [user]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const cleanFilters = {};
      Object.keys(filters).forEach(key => {
        if (filters[key]) cleanFilters[key] = filters[key];
      });

      if (Object.keys(cleanFilters).length === 0) {
        await fetchBooks();
      } else {
        const data = await bookService.filterBooks(cleanFilters);
        setBooks(data);
      }
    } catch (error) {
      console.error('Failed to filter books:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      author: '',
      genre: '',
      language: ''
    });
    fetchBooks();
  };

  if (!user) return null;
  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Books</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">Filter Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={filters.author}
              onChange={handleFilterChange}
              placeholder="Search by author"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <input
              type="text"
              name="genre"
              value={filters.genre}
              onChange={handleFilterChange}
              placeholder="Search by genre"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <input
              type="text"
              name="language"
              value={filters.language}
              onChange={handleFilterChange}
              placeholder="Search by language"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="flex space-x-4 mt-4">
          <button
            onClick={applyFilters}
            className="bg-primary-700 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Books Grid */}
      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
  <p className="text-red-600 text-xl font-bold">No books found</p>
  <p className="text-gray-500 mt-2">Please try searching again or check.</p>
</div>

      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}