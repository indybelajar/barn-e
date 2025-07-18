"use client"; // Make sure this is the very first line

import React, { useEffect, useState } from "react"; // Import useEffect and useState
import { assets } from "../assets/assets";
import Image from "next/image";
import axios from "axios"; // Import axios for API calls
import { useAppContext } from "../context/AppContext";

// Remove this hardcoded 'proWducts' array
// const products = [ ... ];

const FeaturedProduct = () => {
  const [shops, setShops] = useState([]); // State to store shop data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const { getToken } = useAppContext(); // Get getToken from your AppContext

  // Function to fetch shop data
  const fetchShopData = async () => {
    setLoading(true);
    try {
      const token = await getToken(); // Get the token if authentication is required for this endpoint
      const { data } = await axios.get("/api/shop/list", { // <--- Adjust this API endpoint to your actual shop listing API
        headers: { Authorization: `Bearer ${token}` }, // Add headers if endpoint requires authentication
      });

      if (data.success) {
        setShops(data.shops); // Assuming your API returns { success: true, shops: [...] }
      } else {
        console.error("Failed to fetch shop data:", data.message);
        // Optionally, show a toast error here
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
      // Optionally, show a toast error here
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchShopData();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div>Loading featured products...</div>; // Or a proper Loading component
  }

  // If no shops are found, you might want to show a message
  if (shops.length === 0) {
    return <div className="mt-14 text-center text-gray-500">No featured products available.</div>;
  }

  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Penawaran Terbatas</p>
        <div className="w-28 h-0.5 bg-[#F95959] mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {shops.map((shopItem) => ( // Change 'products.map' to 'shops.map' and 'shopItem' for clarity
          <div key={shopItem._id} className="relative group"> {/* Use shopItem._id as key */}
            <Image
              src={shopItem.image[0]} // Assuming image is an array and you want the first one
              alt={shopItem.name} // Use shopItem.name for alt text
              className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover"
              width={500} // Provide appropriate width for next/image
              height={300} // Provide appropriate height for next/image
            />
            <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 space-y-2">
              <p className="font-medium text-xl lg:text-2xl">{shopItem.name}</p> {/* Use shopItem.name for title */}
              <p className="text-sm lg:text-base leading-5 max-w-60">
                {shopItem.description} {/* Use shopItem.description */}
              </p>
              <button className="flex items-center gap-1.5 bg-[#F95959] px-4 py-2 rounded">
                Beli Sekarang <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;