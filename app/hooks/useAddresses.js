// hooks/useAddresses.js
import { useState, useEffect, useCallback } from 'react';

export const useAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/address', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setAddresses(data.data);
      } else {
        setError(data.message || 'Gagal mengambil alamat');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError('Terjadi kesalahan saat mengambil alamat');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return {
    addresses,
    loading,
    error,
    refetch: fetchAddresses
  };
};

// context/AddressContext.js
import React, { createContext, useContext } from 'react';
import { useAddresses } from '../hooks/useAddresses';

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const addressData = useAddresses();

  return (
    <AddressContext.Provider value={addressData}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddressContext = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddressContext must be used within AddressProvider');
  }
  return context;
};