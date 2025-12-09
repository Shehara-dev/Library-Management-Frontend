'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { reservationService } from '@/services/reservationService';
import Loading from '@/components/Loading';

export default function ViewReservationsPage() {
  const { user, isLibrarian } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, RETURNED
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!isLibrarian) {
      router.push('/books');
      return;
    }
    fetchReservations();
  }, [user, isLibrarian]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getAllReservations();
      setReservations(data);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
      setMessage({ type: 'error', text: 'Failed to load reservations' });
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (reservationId) => {
    if (!confirm('Mark this book as returned?')) return;

    try {
      await reservationService.returnBook(reservationId);
      setMessage({ type: 'success', text: 'Book marked as returned!' });
      fetchReservations();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to process return' });
    }
  };

  
const filteredReservations = reservations.filter(reservation => {
  
  if (reservation.user?.role === 'LIBRARIAN') return false;

  
  if (filter === 'ACTIVE' && reservation.status !== 'ACTIVE') return false;
  if (filter === 'RETURNED' && reservation.status !== 'RETURNED') return false;

  
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    const matchesUser = reservation.user?.email?.toLowerCase().includes(searchLower);
    const matchesBook = reservation.book?.title?.toLowerCase().includes(searchLower);
    if (!matchesUser && !matchesBook) return false;
  }

  return true;
});

  // Calculate statistics
  const stats = {
    total: reservations.length,
    active: reservations.filter(r => r.status === 'ACTIVE').length,
    returned: reservations.filter(r => r.status === 'RETURNED').length,
  };

  if (!user || !isLibrarian) return null;
  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Reservations</h1>

      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-900 mb-1">Total Reservations</p>
          <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 mb-1">Active Reservations</p>
          <p className="text-3xl font-bold text-green-900">{stats.active}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Returned</p>
          <p className="text-3xl font-bold text-gray-900">{stats.returned}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 rounded-md font-medium ${
                  filter === 'ALL'
                    ? 'bg-primary-800 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('ACTIVE')}
                className={`px-4 py-2 rounded-md font-medium ${
                  filter === 'ACTIVE'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('RETURNED')}
                className={`px-4 py-2 rounded-md font-medium ${
                  filter === 'RETURNED'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Returned
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by User or Book
            </label>
            <input
              type="text"
              placeholder="Search user email or book title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      {filteredReservations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No reservations found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reserved Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation) => {
                  const dueDate = new Date(reservation.dueDate);
                  const today = new Date();
                  const isOverdue = dueDate < today && reservation.status === 'ACTIVE';

                  return (
                    <tr key={reservation.id} className={isOverdue ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {reservation.user?.email || 'N/A'}
                          </div>
                          <div className="text-gray-500">
                            ID: {reservation.user?.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {reservation.book?.title || 'N/A'}
                          </div>
                          <div className="text-gray-500">
                            by {reservation.book?.author || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(reservation.reservationDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className={isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}>
                          {dueDate.toLocaleDateString()}
                          {isOverdue && <div className="text-xs">OVERDUE!</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          reservation.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {reservation.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleReturn(reservation.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Mark as Returned
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}