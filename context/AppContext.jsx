'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCounts = useCallback(async (authToken) => {
    if (!authToken) return;
    try {
      const [cartRes, wishlistRes] = await Promise.all([
        fetch('/api/cart', { headers: { Authorization: `Bearer ${authToken}` } }),
        fetch('/api/wishlist', { headers: { Authorization: `Bearer ${authToken}` } })
      ]);
      if (cartRes.ok) {
        const cart = await cartRes.json();
        setCartCount(cart?.items?.length || 0);
      }
      if (wishlistRes.ok) {
        const wishlist = await wishlistRes.json();
        setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
      }
    } catch (err) {
      console.error('Error fetching counts:', err);
    }
  }, []);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('elmas_token');
      const storedUser = localStorage.getItem('elmas_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        fetchCounts(storedToken);
      }
    } catch (err) {
      console.error('Error loading auth state:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchCounts]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('elmas_token', authToken);
    localStorage.setItem('elmas_user', JSON.stringify(userData));
    fetchCounts(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCartCount(0);
    setWishlistCount(0);
    localStorage.removeItem('elmas_token');
    localStorage.removeItem('elmas_user');
  };

  const updateCartCount = (count) => setCartCount(count);
  const updateWishlistCount = (count) => setWishlistCount(count);

  return (
    <AppContext.Provider value={{
      user, token, cartCount, wishlistCount, loading,
      login, logout, updateCartCount, updateWishlistCount, fetchCounts
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
