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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 px-4">
      <div className="max-w-6xl w-full text-center">
        <div className="mb-12">
          <h1 className="text-5xl font-extrabold text-primary-800 mb-4">
            Welcome to Library Management System
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Discover, reserve, and manage your favorite books all in one place
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-3 rounded-lg bg-primary-800 hover:bg-primary-700 text-white font-medium shadow-lg transition-all duration-200"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-8 py-3 rounded-lg border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-medium shadow transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Browse Books</h3>
            <p className="text-gray-600">
              Explore our extensive collection of books across various genres
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="text-5xl mb-4">🔖</div>
            <h3 className="text-xl font-semibold mb-2">Easy Reservations</h3>
            <p className="text-gray-600">
              Reserve books for 7, 14, or 21 days with just a few clicks
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="text-5xl mb-4">👤</div>
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
