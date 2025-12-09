'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { bookService } from '@/services/bookService';
import { reservationService } from '@/services/reservationService';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import { RESERVATION_DAYS } from '@/utils/constants';

// UI Components & Icons
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Calendar, 
  BookOpen, 
  Globe, 
  Tag, 
  Barcode, 
  User, 
  CheckCircle2, 
  XCircle,
  Layers 
} from "lucide-react";

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
      if (!user || !user.id) {
        setMessage({ type: 'error', text: 'Please log in again to reserve books.' });
        return;
      }

      setReserving(true);
      setMessage({ type: '', text: '' });

      await reservationService.createReservation({
        userId: user.id,
        bookId: book.id,
        days: selectedDays
      });

      setMessage({ type: 'success', text: 'Book reserved successfully!' });
      setShowReserveModal(false);
      await fetchBook();

      setTimeout(() => {
        router.push('/reservations');
      }, 2000);

    } catch (error) {
      console.error(error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data || 'Failed to reserve book.' 
      });
    } finally {
      setReserving(false);
    }
  };

  if (!user) return null;
  if (loading) return <Loading />;
  if (!book) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Book not found</h2>
      <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
    </div>
  );

  const imageUrl = book.imageUrl 
    ? `http://localhost:8082${book.imageUrl}` 
    : '/images/placeholder-book.png';

  // Helper for status badge styles
  const isAvailable = book.status === 'AVAILABLE';
  const statusColor = isAvailable ? "text-green-700 bg-green-50 border-green-200" : "text-amber-700 bg-amber-50 border-amber-200";
  const StatusIcon = isAvailable ? CheckCircle2 : XCircle;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Header / Back Button */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="pl-0 hover:pl-2 transition-all text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Books
        </Button>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center border ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="mr-2 h-5 w-5"/> : <XCircle className="mr-2 h-5 w-5"/>}
          {message.text}
        </div>
      )}

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-12 gap-0">
          
          {/* Left Column: Image */}
          <div className="md:col-span-4 lg:col-span-5 bg-gray-50 relative min-h-[400px] md:min-h-full">
            <img
              src={imageUrl}
              alt={book.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { e.target.src = '/images/placeholder-book.png'; }}
            />
          </div>

          {/* Right Column: Details */}
          <div className="md:col-span-8 lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between">
            <div>
              {/* Header Info */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-start justify-between">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold tracking-wide uppercase ${statusColor}`}>
                    <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                    {book.status}
                  </div>
                </div>
                
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                    {book.title}
                  </h1>
                  <div className="flex items-center text-gray-600 text-lg">
                    <User className="w-5 h-5 mr-2 text-gray-400" />
                    <span>{book.author}</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 my-6" />

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                {book.category && (
                  <div className="flex items-start space-x-3">
                    <Layers className="w-5 h-5 text-primary-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Category</p>
                      <p className="text-gray-900 font-medium">{book.category.name}</p>
                    </div>
                  </div>
                )}
                {book.genre && (
                  <div className="flex items-start space-x-3">
                    <Tag className="w-5 h-5 text-primary-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Genre</p>
                      <p className="text-gray-900 font-medium">{book.genre}</p>
                    </div>
                  </div>
                )}
                {book.language && (
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-primary-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Language</p>
                      <p className="text-gray-900 font-medium">{book.language}</p>
                    </div>
                  </div>
                )}
                {book.isbn && (
                  <div className="flex items-start space-x-3">
                    <Barcode className="w-5 h-5 text-primary-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">ISBN</p>
                      <p className="text-gray-900 font-medium font-mono text-sm">{book.isbn}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Area */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              {isAvailable && !user.isLibrarian ? (
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-primary-50/50 p-4 rounded-xl border border-primary-100">
                  <div className="text-sm text-primary-900">
                    <span className="font-semibold block text-base">Want to read this?</span>
                    Reserve it now to pick it up later.
                  </div>
                  <Button 
                    onClick={() => setShowReserveModal(true)}
                    size="lg"
                    className="w-full sm:w-auto bg-primary-700 hover:bg-primary-800 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Reserve Book
                  </Button>
                </div>
              ) : book.status === 'RESERVED' ? (
                <div className="bg-amber-50 text-amber-800 px-4 py-3 rounded-lg border border-amber-100 text-sm flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Currently reserved.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Modernized Modal Content */}
      <Modal
        isOpen={showReserveModal}
        onClose={() => setShowReserveModal(false)}
        title="Reserve Book"
      >
        <div className="space-y-6 pt-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{book.title}</h3>
            <p className="text-gray-500 text-sm">Select reservation duration</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {RESERVATION_DAYS.map((option) => (
              <label 
                key={option.value} 
                className={`
                  relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all duration-200
                  ${selectedDays === option.value 
                    ? 'border-primary-600 bg-primary-50/30 ring-1 ring-primary-600' 
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    name="days"
                    value={option.value}
                    checked={selectedDays === option.value}
                    onChange={(e) => setSelectedDays(Number(e.target.value))}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 flex flex-col">
                  <span className={`block text-sm font-medium ${selectedDays === option.value ? 'text-primary-900' : 'text-gray-900'}`}>
                    {option.label}
                  </span>
                  <span className={`block text-xs ${selectedDays === option.value ? 'text-primary-700' : 'text-gray-500'}`}>
                     Return by {new Date(Date.now() + option.value * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={() => setShowReserveModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReserve}
              disabled={reserving}
              className="flex-1 bg-primary-700 hover:bg-primary-800"
            >
              {reserving ? (
                <>Loading...</>
              ) : (
                <>Confirm Reservation</>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}