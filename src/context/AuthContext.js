'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount (reads from localStorage)
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      
      // FIX: Ensure we capture the ID from the response
      // We check for 'userId' (backend usually sends this) or 'id'
      const userId = data.userId || data.id;

      setUser({ 
        id: userId, 
        email: data.email, 
        role: data.role 
      }); 
      
      // Redirect based on role
      if (data.role === 'LIBRARIAN') {
        router.push('/dashboard');
      } else {
        router.push('/books');
      }
      
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      return { 
        success: false, 
        error: error.response?.data || 'Login failed' 
      };
    }
  };

  const signup = async (userData) => {
    try {
      await authService.signup(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Signup failed' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isLibrarian: user?.role === 'LIBRARIAN'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}