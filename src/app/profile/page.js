'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { reservationService } from '@/services/reservationService';
import Loading from '@/components/Loading';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isLibrarian, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalReservations: 0,
    activeReservations: 0,
    returnedReservations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!isLibrarian) {
      fetchUserStats();
    } else {
      setLoading(false);
    }
  }, [user, isLibrarian]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const reservations = await reservationService.getUserReservations(user.id);
      
      setStats({
        totalReservations: reservations.length,
        activeReservations: reservations.filter(r => r.status === 'ACTIVE').length,
        returnedReservations: reservations.filter(r => r.status === 'RETURNED').length
      });
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;
  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-primary-600">
              {user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.email}</h2>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isLibrarian 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Email Address</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Account Type</p>
              <p className="font-medium text-gray-900">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      
      {!isLibrarian && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h3 className="text-lg font-semibold mb-4">My Library Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Total Reservations</p>
              <p className="text-3xl font-bold text-blue-900">{stats.totalReservations}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Active Reservations</p>
              <p className="text-3xl font-bold text-green-900">{stats.activeReservations}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Books Returned</p>
              <p className="text-3xl font-bold text-gray-900">{stats.returnedReservations}</p>
            </div>
          </div>
        </div>
      )}

     
    </div>
  );
}