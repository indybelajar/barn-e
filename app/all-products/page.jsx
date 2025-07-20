"use client"; // Make sure this is the very first line

import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets"; // Assuming this path is correct, consider using '@/assets' alias
import Image from "next/image";
import axios from "axios";
import { useAppContext } from "../../context/AppContext"; // Assuming this path is correct, consider using '@/context' alias
import Navbar from "../../components/Navbar"; // Assuming this path is correct, consider using '@/components' alias
import { useRouter } from "next/navigation";

const FeaturedProduct = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAppContext();
  const router = useRouter();

  // Function to format price to Indonesian Rupiah
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Function to calculate discount percentage
  const calculateDiscount = (originalPrice, offerPrice) => {
    if (!originalPrice || !offerPrice || offerPrice >= originalPrice) return 0;
    return Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
  };

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
    return (
      <>
        <Navbar />
        <div className="mt-14 flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F95959]"></div>
        </div>
      </>
    );
  }

  if (shops.length === 0) {
    return (
      <>
        <Navbar />
        <div className="mt-14 text-center text-gray-500">No featured products available.</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mt-14">
        <div className="flex flex-col items-center">
          <p className="text-3xl font-medium">Semua Produk</p>
          <div className="w-28 h-0.5 bg-[#F95959] mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
          {shops.map((shopItem) => {
            const hasDiscount = shopItem.offerPrice && shopItem.offerPrice < shopItem.price;
            const discountPercentage = calculateDiscount(shopItem.price, shopItem.offerPrice);
            
            return (
              <div key={shopItem._id} className="relative group cursor-pointer">
                {/* Discount Badge */}
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium z-10">
                    -{discountPercentage}%
                  </div>
                )}

                <Image
                  src={shopItem.image[0]}
                  alt={shopItem.name}
                  className="group-hover:brightness-50 transition duration-300 w-full h-auto object-cover rounded-lg"
                  width={500}
                  height={300}
                />
                
                <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 space-y-3">
                  <div className="space-y-2">
                    <p className="font-medium text-xl lg:text-2xl text-[#FFFFFF]">
                      {shopItem.name}
                    </p>
                    <p className="text-sm lg:text-base leading-5 max-w-60 text-[#FFFFFF]">
                      {shopItem.description}
                    </p>
                    
                    {/* Price Display */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {hasDiscount ? (
                        <>
                          <span className="text-lg lg:text-xl font-bold text-[#F95959] bg-white px-2 py-1 rounded">
                            {formatPrice(shopItem.offerPrice)}
                          </span>
                          <span className="text-sm text-gray-300 line-through">
                            {formatPrice(shopItem.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg lg:text-xl font-bold text-[#FFFFFF] bg-[#F95959] px-2 py-1 rounded">
                          {formatPrice(shopItem.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => router.push(`/product/${shopItem._id}`)} // Navigate to product detail page
                    className="flex items-center gap-1.5 bg-[#F95959] hover:bg-[#e74c4c] transition-colors px-4 py-2 rounded text-[#FFFFFF] font-medium"
                  >
                    Beli Sekarang 
                    <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
                  </button>
                </div>

                {/* Alternative: Price overlay for better visibility */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2">
                  {hasDiscount ? (
                    <div className="text-center">
                      <div className="text-sm font-bold text-[#F95959]">
                        {formatPrice(shopItem.offerPrice)}
                      </div>
                      <div className="text-xs text-gray-500 line-through">
                        {formatPrice(shopItem.price)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-gray-800">
                      {formatPrice(shopItem.price)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default FeaturedProduct;