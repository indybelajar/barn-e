"use client"
import { useEffect, useState } from "react";
import { assets } from "../../../assets/assets";
import ProductCard from "../../../components/ProductCard";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "../../../components/Loading";
import { useAppContext } from "../../../context/AppContext";
import React from "react";

const Product = () => {

    const { id } = useParams();

    const { products, router, addToCart } = useAppContext()

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);

    const fetchProductData = async () => {
        const product = products.find(product => product._id === id);
        setProductData(product);
    }

    useEffect(() => {
        fetchProductData();
    }, [id, products.length])

    // delete product
    const handleDelete = async (productId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      return; // Stop if user cancels
    }

    try {
      const token = await getToken();
      // Make a DELETE request to your backend API
      const response = await axios.delete(`/api/product/${productId}`, { // <--- New API endpoint for DELETE
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        // Update local state: remove the deleted product from the 'shops' array
        setShops((prevShops) => prevShops.filter((shop) => shop._id !== productId));
        alert("Produk berhasil dihapus!"); // Or use a toast notification
      } else {
        alert(`Gagal menghapus produk: ${response.data.message}`); // Or use a toast notification
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Terjadi kesalahan saat menghapus produk."); // Or use a toast notification
    }
  };
  

    return productData ? (<>
        <Navbar />
        <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="px-5 lg:px-16 xl:px-20">
                    <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
                        <Image
                            src={mainImage || productData.image[0]}
                            alt="alt"
                            className="w-full h-auto object-cover mix-blend-multiply"
                            width={1280}
                            height={720}
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {productData.image.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setMainImage(image)}
                                className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                            >
                                <Image
                                    src={image}
                                    alt="alt"
                                    className="w-full h-auto object-cover mix-blend-multiply"
                                    width={1280}
                                    height={720}
                                />
                            </div>

                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
                        {productData.name}
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                            <Image
                                className="h-4 w-4"
                                src={assets.kandank_icon}
                                alt="kandank_icon"
                            />
                        </div>
                        <p>Kandang 1</p>
                    </div>
                    <p className="text-gray-600 mt-3">
                        {productData.description}
                    </p>
                    <hr className="bg-gray-600 my-6" />
                    <div className="overflow-x-auto">
                        <table className="table-auto border-collapse w-full max-w-72">
                            <tbody>
                                <tr>
                                    <td className="text-gray-600 font-medium">Bobot</td>
                                    <td className="text-gray-800/50 ">50 Kg</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Jenis Kelamin</td>
                                    <td className="text-gray-800/50 ">Jantan</td>
                                </tr>
                                     <tr>
                                    <td className="text-gray-600 font-medium">Jenis Ternak</td>
                                    <td className="text-gray-800/50 ">Kambing</td>
                                </tr>
                                     <tr>
                                    <td className="text-gray-600 font-medium">Umur</td>
                                    <td className="text-gray-800/50 ">2 Tahun</td>
                                </tr>
                                     <tr>
                                    <td className="text-gray-600 font-medium">Tanggal Lahir</td>
                                    <td className="text-gray-800/50 ">11/06/2023</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Category</td>
                                    <td className="text-gray-800/50">
                                        {productData.category}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center mt-10 gap-4">
                        <button onClick={() => router.push('/qrcode')} className="w-full py-3.5 bg-[#F95959] text-[#FFFFFF] rounded-xl hover:bg-gray-400 transition">
                            Cetak QR Code
                        </button>
                        <button
                        onClick={() => handleDelete(productData._id)} // <--- Change this line
                        className="w-full py-3.5 bg-gray-200 text-gray rounded-xl hover:bg-[#F95959] transition" // <--- Optionally, change hover color to red for delete
                        >
                        Hapus
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 mt-16">
                    <p className="text-3xl font-medium">Featured <span className="font-medium text-[#F95959]">Products</span></p>
                    <div className="w-28 h-0.5 bg-[#F95959] mt-2"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
                    {products.slice(0, 5).map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
                <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                    Lihat Semua
                </button>
            </div>
        </div>
        <Footer />
    </>
    ) : <Loading />
};

export default Product;