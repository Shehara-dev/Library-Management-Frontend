'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { bookService } from '@/services/bookService';
import { reservationService } from '@/services/reservationService';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import { RESERVATION_DAYS } from '@/utils/constants';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState(7);
  const [reserving, setReserving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchBook();
  }, [params.id, user]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const data = await bookService.getBookById(params.id);
      setBook(data);
    } catch (error) {
      console.error('Failed to fetch book:', error);
      setMessage({ type: 'error', text: 'Failed to load book details' });
    } finally {
      setLoading(false);
    }
  };

const handleReserve = async () => {
    try {
      // 1. DEBUG: Check what the user object actually looks like
      console.log("Current User Object:", user);

      // 2. SAFETY CHECK: Stop if user or user.id is missing
      if (!user || !user.id) {
        console.error("User ID is missing!");
        setMessage({ 
          type: 'error', 
          text: 'User profile not fully loaded. Please refresh the page or log in again.' 
        });
        return;
      }

      setReserving(true);
      setMessage({ type: '', text: '' });

      // 3. Send the request with the validated ID
      await reservationService.createReservation({
        userId: user.id, 
        bookId: book.id,
        days: selectedDays
      });

      setMessage({ type: 'success', text: 'Book reserved successfully!' });
      setShowReserveModal(false);
      
      // Refresh book data
      await fetchBook();

      setTimeout(() => {
        router.push('/reservations');
      }, 2000);

    } catch (error) {
      console.error("Reservation Error:", error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data || 'Failed to reserve book. Please try again.' 
      });
    } finally {
      setReserving(false);
    }
  };

  if (!user) return null;
  if (loading) return <Loading />;
  if (!book) return <div className="text-center py-12">Book not found</div>;

  const imageUrl = book.imageUrl 
    ? `http://localhost:8082${book.imageUrl}` 
    : '/images/placeholder-book.png';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
      onClick={() => router.back()}
      className="mb-6 text-primary-900 hover:text-primary-700 font-bold"
    >
      ← Back
    </button>

      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={imageUrl}
              alt={book.title}
              className="w-full h-96 object-cover"
              onError={(e) => {
                e.target.src = '/images/placeholder-book.png';
              }}
            />
          </div>

          <div className="md:w-2/3 p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                book.status === 'AVAILABLE'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {book.status}
              </span>
            </div>

            <p className="text-xl text-gray-700 mb-6">by {book.author}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {book.category && (
                <div>
                  <span className="text-sm text-gray-500">Category:</span>
                  <p className="font-medium">{book.category.name}</p>
                </div>
              )}
              {book.genre && (
                <div>
                  <span className="text-sm text-gray-500">Genre:</span>
                  <p className="font-medium">{book.genre}</p>
                </div>
              )}
              {book.language && (
                <div>
                  <span className="text-sm text-gray-500">Language:</span>
                  <p className="font-medium">{book.language}</p>
                </div>
              )}
              {book.isbn && (
                <div>
                  <span className="text-sm text-gray-500">ISBN:</span>
                  <p className="font-medium">{book.isbn}</p>
                </div>
              )}
            </div>

            {book.status === 'AVAILABLE' && !user.isLibrarian && (
              <button
                onClick={() => setShowReserveModal(true)}
                className="w-full md:w-auto bg-primary-700 hover:bg-primary-700 text-white px-8 py-3 rounded-md font-medium text-lg"
              >
                Reserve This Book
              </button>
            )}

            {book.status === 'RESERVED' && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
                This book is currently reserved by another member
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reserve Modal */}
      <Modal
        isOpen={showReserveModal}
        onClose={() => setShowReserveModal(false)}
        title="Reserve Book"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            How long would you like to reserve <strong>{book.title}</strong>?
          </p>

          <div className="space-y-2">
            {RESERVATION_DAYS.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="days"
                  value={option.value}
                  checked={selectedDays === option.value}
                  onChange={(e) => setSelectedDays(Number(e.target.value))}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleReserve}
            disabled={reserving}
            className="w-full bg-primary-700 hover:bg-primary-700 text-white py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reserving ? 'Reserving...' : 'Confirm Reservation'}
          </button>
        </div>
      </Modal>
    </div>
  );
}