import Link from 'next/link';
import { API_URL } from '@/utils/constants';

export default function BookCard({ book }) {
  const imageUrl = book.imageUrl 
    ? `http://localhost:8082${book.imageUrl}` 
    : '/images/placeholder-book.png';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-64 bg-gray-200 relative">
        <img
          src={imageUrl}
          alt={book.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/images/placeholder-book.png';
          }}
        />
        <span
          className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${
            book.status === 'AVAILABLE'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {book.status}
        </span>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {book.category && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
              {book.category.name}
            </span>
          )}
          {book.genre && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {book.genre}
            </span>
          )}
          {book.language && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {book.language}
            </span>
          )}
        </div>

        <Link
          href={`/books/${book.id}`}
          className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-md text-sm font-medium transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}