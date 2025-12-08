'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout, isLibrarian } = useAuth();
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Library
            </Link>

            {user && (
              <div className="hidden md:flex space-x-4">
                {isLibrarian ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/dashboard')
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/manage-books"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/manage-books')
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Manage Books
                    </Link>
                    <Link
                      href="/manage-categories"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/manage-categories')
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Categories
                    </Link>
                    <Link
                      href="/manage-users"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/manage-users')
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Users
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/books"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/books')
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Browse Books
                    </Link>
                    <Link
                      href="/reservations"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/reservations')
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      My Reservations
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  {user.email} <span className="text-primary-600">({user.role})</span>
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}