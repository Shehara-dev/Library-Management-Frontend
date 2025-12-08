'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import Loading from '@/components/Loading';

export default function ManageUsersPage() {
  const { user, isLibrarian } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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
    fetchUsers();
  }, [user, isLibrarian]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setMessage({ type: 'error', text: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  const handleBlacklist = async (userId) => {
    if (!confirm('Are you sure you want to blacklist this user?')) return;

    try {
      await userService.blacklistUser(userId);
      setMessage({ type: 'success', text: 'User blacklisted successfully!' });
      fetchUsers();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to blacklist user' });
    }
  };

  const handleUnblacklist = async (userId) => {
    try {
      await userService.unblacklistUser(userId);
      setMessage({ type: 'success', text: 'User unblacklisted successfully!' });
      fetchUsers();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to unblacklist user' });
    }
  };

  if (!user || !isLibrarian) return null;
  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Users</h1>

      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id} className={u.isBlacklisted ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {u.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{u.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    u.role === 'LIBRARIAN' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    u.isBlacklisted 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {u.isBlacklisted ? 'Blacklisted' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {u.role !== 'LIBRARIAN' && (
                    <>
                      {u.isBlacklisted ? (
                        <button
                          onClick={() => handleUnblacklist(u.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Unblacklist
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlacklist(u.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Blacklist
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-blue-900">{users.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 mb-1">Active Users</p>
            <p className="text-2xl font-bold text-green-900">
              {users.filter(u => !u.isBlacklisted).length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 mb-1">Blacklisted Users</p>
            <p className="text-2xl font-bold text-red-900">
              {users.filter(u => u.isBlacklisted).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}