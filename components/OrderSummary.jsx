"use client"; // Make sure this is the very first line

import React, { useEffect, useState, useCallback } from "react"; // <-- Import useCallback
import { useAppContext } from "../context/AppContext";
// import { assets } from "../../assets/assets"; // Only if you use assets directly here
// import Image from "next/image"; // Only if you use Image directly here
import axios from "axios"; // For API calls
import toast from "react-hot-toast"; // For notifications, if you want

const OrderSummary = () => {
  const { currency, router, getCartCount, getCartAmount } = useAppContext();

  // State for address selection and dropdown
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State for user addresses and their loading/error states (moved here)
  const [userAddresses, setUserAddresses] = useState([]); // This will hold the fetched addresses
  const [loadingAddresses, setLoadingAddresses] = useState(true); // Specific loading for addresses
  const [addressError, setAddressError] = useState(''); // Specific error for addresses

  // --- Address Fetching Logic (Refactored & Integrated) ---
  const fetchUserAddresses = useCallback(async () => { // Renamed from fetchAddresses for clarity
    try {
      setLoadingAddresses(true); // Use specific loading state
      setAddressError(''); // Use specific error state

      const response = await fetch('/api/address', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // If you need authentication for /api/address,
          // you'll need to get the token here from useAppContext
          // 'Authorization': `Bearer ${await getToken()}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) { // Check response.ok for HTTP status and data.success for API logic
        setUserAddresses(data.data ?? []); // Set userAddresses state
        // Optionally, if there's only one address or first one should be default
        if (data.data && data.data.length > 0) {
          setSelectedAddress(data.data[0]);
        }
      } else {
        const errorMessage = data.message || 'Gagal mengambil alamat';
        setAddressError(errorMessage);
        // toast.error(errorMessage); // Use toast if desired
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddressError('Terjadi kesalahan saat mengambil alamat');
      // toast.error('Terjadi kesalahan saat mengambil alamat'); // Use toast if desired
    } finally {
      setLoadingAddresses(false);
    }
  }, []); // Dependencies for useCallback. Add getToken() if used.

  useEffect(() => {
    fetchUserAddresses(); // Call the fetching function when component mounts
  }, [fetchUserAddresses]); // Dependency on useCallback's stable function

  // --- End Address Fetching Logic ---

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    // Your order creation logic here
    // You'll need to send selectedAddress._id, cartItems, etc. to your order API
    // router.push('/order-confirmation'); // Example navigation
    console.log("Creating order with:", selectedAddress, "Cart amount:", getCartAmount());
    toast.success("Order creation logic would go here!");
  };


  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Ringkasan Pembelian
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Pilih Alamat
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Pilih Alamat"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Loading/Error state for addresses dropdown */}
            {loadingAddresses ? (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5 text-center text-gray-500">
                <li>Memuat alamat...</li>
              </ul>
            ) : addressError ? (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5 text-center text-red-500">
                <li>Error: {addressError}</li>
              </ul>
            ) : isDropdownOpen && userAddresses.length > 0 ? (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={address._id || index} // Use _id if available, fallback to index
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Tambah Alamat Baru
                </li>
              </ul>
            ) : isDropdownOpen && userAddresses.length === 0 ? (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5 text-center text-gray-500">
                <li>Tidak ada alamat ditemukan.</li>
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Tambah Alamat Baru
                </li>
              </ul>
            ) : null}
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Kode Promo
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Tulis Kode Promo"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button className="bg-[#F95959] rounded-lg text-white px-9 py-2 hover:bg-gray-200">
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">{currency}{getCartAmount()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.02)}</p>
          </div>
        </div>
      </div>

      <button onClick={createOrder} className="w-full bg-[#F95959] rounded-lg text-white py-3 mt-5 hover:bg-gray-200">
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;