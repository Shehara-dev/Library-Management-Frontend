'use client';

import { useState, useEffect } from 'react';
import { bookService } from '@/services/bookService';
import { categoryService } from '@/services/categoryService';
import BookCard from '@/components/BookCard';
import Loading from '@/components/Loading';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// 1. Import Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  // Standard handler for Text Inputs
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // Special handler for Shadcn Select (returns value directly, not event)
  const handleCategoryChange = (value) => {
    setFilters({
      ...filters,
      category: value === "all" ? "" : value // Handle "all" case
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
    // We can also trigger a refetch immediately
    fetchBooks(); 
  };

  if (!user) return null;
  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Books</h1>

      {/* Filters Container */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Filter Books</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Category Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Category
            </label>
            <Select 
              value={filters.category || "all"} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Author Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Author
            </label>
            <Input
              type="text"
              name="author"
              value={filters.author}
              onChange={handleFilterChange}
              placeholder="Search by author"
            />
          </div>

          {/* Genre Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Genre
            </label>
            <Input
              type="text"
              name="genre"
              value={filters.genre}
              onChange={handleFilterChange}
              placeholder="Search by genre"
            />
          </div>

          {/* Language Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Language
            </label>
            <Input
              type="text"
              name="language"
              value={filters.language}
              onChange={handleFilterChange}
              placeholder="Search by language"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-6">
          <Button 
            onClick={applyFilters}
            className="bg-primary-700 hover:bg-primary-800"
          >
            Apply Filters
          </Button>
          
          <Button 
            variant="outline" 
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Books Grid */}
      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-900 text-xl font-semibold">No books found</p>
          <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria.</p>
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