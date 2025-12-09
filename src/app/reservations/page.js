'use client';

import { useState, useEffect } from 'react';
import { reservationService } from '@/services/reservationService';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  
  const { user, isLibrarian } = useAuth();
  const router = useRouter();

  useEffect(() => {
    
    if (!user) {
      router.push('/login');
      return;
    }

    
    if (isLibrarian) {
      router.push('/dashboard');
      return;
    }

    
    if (user.id) {
      fetchReservations(user.id);
    }
  }, [user, isLibrarian]); 

    const fetchReservations = async (userId) => {
    try {
      setLoading(true);
      
      
      const data = await reservationService.getUserReservations(userId);
      setReservations(data);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
      setMessage({ type: 'error', text: 'Failed to load reservations' });
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (reservationId) => {
    if (!confirm('Are you sure you want to return this book?')) return;

    try {
      await reservationService.returnBook(reservationId);
      setMessage({ type: 'success', text: 'Book returned successfully!' });
      
      
      if (user && user.id) {
          fetchReservations(user.id);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to return book' });
    }
  };

  
  if (!user || isLibrarian) return null;
  
  
  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Reservations</h1>

      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-600 border border-green-200' 
            : 'bg-red-50 text-red-600 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg mb-4">No reservations found</p>
          <button
            onClick={() => router.push('/books')}
            className="bg-primary-700 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Browse Books
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {reservation.book.title}
                  </h3>
                  <p className="text-gray-600 mb-4">by {reservation.book.author}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Reserved:</span>
                      <p className="font-medium">
                        {new Date(reservation.reservationDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <p className="font-medium">
                        {new Date(reservation.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ml-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    reservation.status === 'ACTIVE'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {reservation.status}
                  </span>

                  {reservation.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleReturn(reservation.id)}
                      className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Return Book
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}