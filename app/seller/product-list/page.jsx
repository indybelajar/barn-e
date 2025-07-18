'use client';

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {
  const { router, getToken, user } = useAppContext();

  const [products, setProducts] = useState([]); // This will hold 'Hewan Saya' data
  const [shops, setShops] = useState([]);     // This will hold 'Produk Saya' data
  const [loading, setLoading] = useState(true);

  const fetchSellerProduct = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/product/seller-list", {
        headers: { Authorization: `Bearer ${token}` }, // Corrected 'header' to 'headers'
      });

      if (data.success) {
        // Assuming your API returns distinct 'products' and 'shops' arrays
        setProducts(data.products ?? []); // Data for "Hewan Saya"
        setShops(data.shops ?? []);       // Data for "Produk Saya"
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user]);

  // Renamed the first parameter from `products` to `dataList`
  // And removed the `shops` parameter as it's not needed inside this function
  const renderTable = (dataList, title) => (
    <>
      <h2 className="pt-8 pb-4 text-lg font-medium">{title}</h2>
      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
        <table className="table-fixed w-full overflow-hidden">
          <thead className="text-gray-900 text-sm text-left">
            <tr>
              <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
              <th className="px-4 py-3 font-medium truncate max-sm:hidden">Category</th>
              <th className="px-4 py-3 font-medium truncate max-sm:hidden">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-500">
            {/* Map over `dataList` instead of `products` */}
            {dataList.map((item, index) => ( // Renamed the mapped item to `item` for clarity
            <tr key={index} className="border-t border-gray-500/20"><td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate"><div className="bg-gray-500/10 rounded p-2"><Image src={item.image[0]} alt="product Image" className="w-16" width={1280} height={720}/></div><span className="truncate w-full">{item.name}</span></td><td className="px-4 py-3 max-sm:hidden">{item.category}</td><td className="px-4 py-3 max-sm:hidden"><button onClick={() => router.push(`/product/${item._id}`)} className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md"><span className="hidden md:block">Visit</span><Image className="h-3.5" src={assets.redirect_icon} alt="redirect_icon"/></button></td></tr> 
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          {/* Pass `products` for "Hewan Saya" */}
          {products.length > 0 && renderTable(products, "Hewan Saya")} 
          {/* Pass `shops` for "Produk Saya" */}
          {shops.length > 0 && renderTable(shops, "Produk Saya")}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;