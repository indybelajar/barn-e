"use client"; // Make sure this is the very first line

import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets"; // Assuming this path is correct, consider using '@/assets' alias
import Image from "next/image";
import axios from "axios";
import { useAppContext } from "../../context/AppContext"; // Assuming this path is correct, consider using '@/context' alias
import Navbar from "../../components/Navbar"; // Assuming this path is correct, consider using '@/components' alias
import { useRouter } from "next/navigation";

// Remove this hardcoded 'products' array (if still present)
// const products = [ ... ];

const FeaturedProduct = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAppContext();
  const router = useRouter();

  const fetchShopData = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/shop/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setShops(data.shops ?? []); // Use nullish coalescing for safety
      } else {
        console.error("Failed to fetch shop data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopData();
  }, []);

  if (loading) {
    // You might want to include the Navbar even during loading,
    // or wrap the whole page layout with Navbar in layout.js/tsx.
    return (
      <>
        <Navbar /> {/* You can place it here too */}
        <div>Loading featured products...</div>
      </>
    );
  }

  if (shops.length === 0) {
    return (
      <>
        <Navbar /> {/* You can place it here too */}
        <div className="mt-14 text-center text-gray-500">No featured products available.</div>
      </>
    );
  }

  return (
    <> {/* Use a React Fragment if you're returning multiple top-level elements */}
      <Navbar /> {/* <--- Add the Navbar component here */}
      <div className="mt-14">
        <div className="flex flex-col items-center">
          <p className="text-3xl font-medium">Semua Produk</p>
          <div className="w-28 h-0.5 bg-[#F95959] mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
          {shops.map((shopItem) => (
            <div key={shopItem._id} className="relative group">
              <Image
                src={shopItem.image[0]}
                alt={shopItem.name}
                className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover"
                width={500}
                height={300}
              />
              <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 space-y-2">
                <p className="font-medium text-xl lg:text-2xl">{shopItem.name}</p>
                <p className="text-sm lg:text-base leading-5 max-w-60">
                  {shopItem.description}
                </p>
                <button
                 onClick={() => router.push('/cart')} // <--- Corrected syntax
                className="flex items-center gap-1.5 bg-[#F95959] px-4 py-2 rounded">
                  Beli Sekarang <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FeaturedProduct;