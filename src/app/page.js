'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const { user, isLibrarian } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (isLibrarian) {
        router.push('/dashboard');
      } else {
        router.push('/books');
      }
    }
  }, [user, isLibrarian, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to Library Management System
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Discover, reserve, and manage your favorite books all in one place
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link
            href="/login"
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-white hover:bg-gray-50 text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            Sign Up
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Browse Books</h3>
            <p className="text-gray-600">
              Explore our extensive collection of books across various genres
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🔖</div>
            <h3 className="text-xl font-semibold mb-2">Easy Reservations</h3>
            <p className="text-gray-600">
              Reserve books for 7, 14, or 21 days with just a few clicks
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold mb-2">Manage Your Library</h3>
            <p className="text-gray-600">
              Track your reservations and reading history
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}