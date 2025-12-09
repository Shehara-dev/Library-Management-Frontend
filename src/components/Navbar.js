'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout, isLibrarian } = useAuth();
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* LEFT SECTION */}
          <div className="flex items-center space-x-10">
            <Link
              href="/"
              className="text-3xl font-extrabold text-blue-900 tracking-wide"
            >
              E-Library
            </Link>

            {user && (
              <div className="hidden md:flex space-x-2">

                {/* Librarian Links */}
                {isLibrarian ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive('/dashboard')
                          ? 'bg-blue-100 text-blue-900 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-900'
                      }`}
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/manage-books"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive('/manage-books')
                          ? 'bg-blue-100 text-blue-900 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-900'
                      }`}
                    >
                      Manage Books
                    </Link>

                    <Link
                      href="/manage-categories"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive('/manage-categories')
                          ? 'bg-blue-100 text-blue-900 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-900'
                      }`}
                    >
                      Categories
                    </Link>

                    <Link
                      href="/manage-users"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive('/manage-users')
                          ? 'bg-blue-100 text-blue-900 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-900'
                      }`}
                    >
                      Users
                    </Link>

                    <Link
                      href="/view-reservations"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive('/view-reservations')
                          ? 'bg-blue-100 text-blue-900 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-900'
                      }`}
                    >
                      Reservations
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Normal User Links */}
                    <Link
                      href="/books"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive('/books')
                          ? 'bg-blue-100 text-blue-900 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-900'
                      }`}
                    >
                      Browse Books
                    </Link>

                    <Link
                      href="/reservations"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive('/reservations')
                          ? 'bg-blue-100 text-blue-900 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-900'
                      }`}
                    >
                      My Reservations
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 transition"
                >
                  <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                    {user.email.charAt(0).toUpperCase()}
                  </div>

                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-gray-900">
                      {user.email.split('@')[0]}
                    </div>
                    <div className="text-xs text-amber-600 font-medium">
                      {user.role}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-900 px-3 py-2 text-sm font-medium transition"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition"
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
