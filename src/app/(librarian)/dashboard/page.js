'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { bookService } from '@/services/bookService';
import { categoryService } from '@/services/categoryService';
import { userService } from '@/services/userService';
import { reservationService } from '@/services/reservationService';
import Loading from '@/components/Loading';

export default function DashboardPage() {
  const { user, isLibrarian } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    reservedBooks: 0,
    totalCategories: 0,
    totalUsers: 0,
    activeReservations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!isLibrarian) {
      router.push('/books');
      return;
    }
    fetchStats();
  }, [user, isLibrarian]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [books, categories, users, reservations] = await Promise.all([
        bookService.getAllBooks(),
        categoryService.getAllCategories(),
        userService.getAllUsers(),
        reservationService.getAllReservations(),
      ]);

      setStats({
        totalBooks: books.length,
        availableBooks: books.filter((b) => b.status === 'AVAILABLE').length,
        reservedBooks: books.filter((b) => b.status === 'RESERVED').length,
        totalCategories: categories.length,
        totalUsers: users.length,
        activeReservations: reservations.filter((r) => r.status === 'ACTIVE').length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isLibrarian) return null;
  if (loading) return <Loading />;

  const statCards = [
    { label: 'Total Books', value: stats.totalBooks, icon: '📚' },
    { label: 'Available Books', value: stats.availableBooks, icon: '✅'},
    { label: 'Reserved Books', value: stats.reservedBooks, icon: '🔖'},
    { label: 'Categories', value: stats.totalCategories, icon: '📂'},
    { label: 'Total Users', value: stats.totalUsers, icon: '👥'},
    { label: 'Active Reservations', value: stats.activeReservations, icon: '📅' },
  ];

  const quickActions = [
    { label: 'Manage Books', route: '/manage-books', color: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'Manage Categories', route: '/manage-categories', color: 'bg-purple-500 hover:bg-purple-600' },
    { label: 'Manage Users', route: '/manage-users', color: 'bg-indigo-500 hover:bg-indigo-600' },
    { label: 'View All Reservations', route: '/view-reservations', color: 'bg-orange-500 hover:bg-orange-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-12">Librarian Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl text-white shadow-md bg-gradient-to-br ${stat.color}`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Section */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => router.push(action.route)}
            className={`${action.color} text-white py-3 px-4 rounded-lg font-medium shadow-md 
                       hover:shadow-lg transition-transform transform hover:-translate-y-1`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
