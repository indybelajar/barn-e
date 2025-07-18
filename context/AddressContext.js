// context/AddressContext.js
"use client"; // Make sure context provider is client-side if it uses client hooks

import React, { createContext, useContext } from 'react';
import { useAddresses } from '../hooks/useAddresses'; // <--- Correct import path for the hook

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const addressData = useAddresses(); // <-- useAddresses is used here correctly

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