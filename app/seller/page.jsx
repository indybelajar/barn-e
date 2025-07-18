'use client';
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const AdminDashboard = () => {
  // Removed getToken since using Clerk authentication
  const [activeTab, setActiveTab] = useState('product'); // 'product' or 'shop'

  // Product (Hewan) State
  const [productFiles, setProductFiles] = useState([]);
  const [productName, setProductName] = useState('');
  const [gender, setGender] = useState('Jantan');
  const [animalCategory, setAnimalCategory] = useState('Sapi');
  const [birthDate, setBirthDate] = useState('');
  const [totalVaccine, setTotalVaccine] = useState('');

  // Shop (Barang) State
  const [shopFiles, setShopFiles] = useState([]);
  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [shopCategory, setShopCategory] = useState('Makanan');

  // Reset Product Form
  const resetProductForm = () => {
    setProductFiles([]);
    setProductName('');
    setGender('Jantan');
    setAnimalCategory('Sapi');
    setBirthDate('');
    setTotalVaccine('');
  };

  // Reset Shop Form
  const resetShopForm = () => {
    setShopFiles([]);
    setShopName('');
    setDescription('');
    setPrice('');
    setOfferPrice('');
    setShopCategory('Makanan');
  };

  // Handle Product Submit
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('gender', gender);
    formData.append('category', animalCategory);
    formData.append('birthDate', birthDate);
    formData.append('totalVaccine', totalVaccine);

    // Only append files that are actually selected
    productFiles.forEach((file) => {
      if (file) {
        formData.append('images', file);
      }
    });

    try {
      const { data } = await axios.post('/api/product/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        toast.success(data.message);
        resetProductForm();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Handle Shop Submit
  const handleShopSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', shopName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('offerPrice', offerPrice);
    formData.append('category', shopCategory);

    // Only append files that are actually selected
    shopFiles.forEach((file) => {
      if (file) {
        formData.append('images', file);
      }
    });

    try {
      const { data } = await axios.post('/api/shop/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        toast.success(data.message);
        resetShopForm();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col">
      {/* Tab Navigation */}
      <div className="md:p-10 p-4 pb-0">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'product'
                ? 'border-[#F95959] text-[#F95959]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('product')}
          >
            Tambah Hewan
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'shop'
                ? 'border-[#F95959] text-[#F95959]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('shop')}
          >
            Tambah Barang
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="md:px-10 px-4 pb-10">
        {activeTab === 'product' ? (
          // Product Form (Hewan)
          <form onSubmit={handleProductSubmit} className="space-y-5 max-w-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tambah Hewan</h2>
            
            {/* Upload Gambar Hewan */}
            <div>
              <p className="text-base font-medium">Foto Hewan</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {[...Array(4)].map((_, index) => (
                  <label key={index} htmlFor={`productImage${index}`}>
                    <input
                      onChange={(e) => {
                        const updatedFiles = [...productFiles];
                        updatedFiles[index] = e.target.files[0];
                        setProductFiles(updatedFiles);
                      }}
                      type="file"
                      id={`productImage${index}`}
                      hidden
                      accept="image/*"
                    />
                    <Image
                      className="max-w-24 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-[#F95959]"
                      src={productFiles[index] ? URL.createObjectURL(productFiles[index]) : assets.upload_area}
                      alt=""
                      width={100}
                      height={100}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Nama Hewan */}
            <div className="flex flex-col gap-1 max-w-md">
              <label className="text-base font-medium">Nama Hewan</label>
              <input
                type="text"
                placeholder="Nama"
                className="outline-none py-2 px-3 rounded border border-gray-500/40 focus:border-[#F95959]"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            {/* Jenis Kelamin */}
            <div className="flex flex-col gap-1 max-w-md">
              <label className="text-base font-medium">Jenis Kelamin</label>
              <select
                className="outline-none py-2 px-3 rounded border border-gray-500/40 focus:border-[#F95959]"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Jantan">Jantan</option>
                <option value="Betina">Betina</option>
              </select>
            </div>

            {/* Kategori Hewan */}
            <div className="flex flex-col gap-1 max-w-md">
              <label className="text-base font-medium">Kategori</label>
              <select
                className="outline-none py-2 px-3 rounded border border-gray-500/40 focus:border-[#F95959]"
                value={animalCategory}
                onChange={(e) => setAnimalCategory(e.target.value)}
              >
                <option value="Sapi">Sapi</option>
                <option value="Kambing">Kambing</option>
                <option value="Ayam">Ayam</option>
                <option value="Domba">Domba</option>
              </select>
            </div>

            {/* Tanggal Lahir */}
            <div className="flex flex-col gap-1 max-w-md">
              <label className="text-base font-medium">Tanggal Lahir</label>
              <input
                type="date"
                className="outline-none py-2 px-3 rounded border border-gray-500/40 focus:border-[#F95959]"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>

            {/* Total Vaksin */}
            <div className="flex flex-col gap-1 max-w-md">
              <label className="text-base font-medium">Total Vaksin</label>
              <input
                type="number"
                placeholder="0"
                className="outline-none py-2 px-3 rounded border border-gray-500/40 focus:border-[#F95959]"
                value={totalVaccine}
                onChange={(e) => setTotalVaccine(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="px-8 py-2.5 bg-[#F95959] text-white font-medium rounded hover:bg-[#e04545] transition-colors"
            >
              Tambah Hewan
            </button>
          </form>
        ) : (
          // Shop Form (Barang)
          <form onSubmit={handleShopSubmit} className="space-y-5 max-w-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tambah Barang</h2>
            
            {/* Upload Gambar Barang */}
            <div>
              <p className="text-base font-medium">Foto Barang</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {[...Array(4)].map((_, index) => (
                  <label key={index} htmlFor={`shopImage${index}`}>
                    <input
                      onChange={(e) => {
                        const updatedFiles = [...shopFiles];
                        updatedFiles[index] = e.target.files[0];
                        setShopFiles(updatedFiles);
                      }}
                      type="file"
                      id={`shopImage${index}`}
                      hidden
                      accept="image/*"
                    />
                    <Image
                      className="max-w-24 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-[#F95959]"
                      src={shopFiles[index] ? URL.createObjectURL(shopFiles[index]) : assets.upload_area}
                      alt=""
                      width={100}
                      height={100}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Nama Barang */}
            <div className="flex flex-col gap-1 max-w-md">
              <label className="text-base font-medium">Nama Barang</label>
              <input
                type="text"
                placeholder="Nama barang"
                className="outline-none py-2 px-3 rounded border border-gray-500/40 focus:border-[#F95959]"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
              />
            </div>

            {/* Deskripsi */}
            <div className="flex flex-col gap-1 max-w-md">
              <label className="text-base font-medium">Deskripsi</label>
              <textarea
                placeholder="Deskripsi barang"
                className="outline-none py-2 px-3 rounded border border-gray-500/40 focus:border-[#F95959] resize-none"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Kategori Barang */}
            <div className="flex flex-col gap-1 max-w-md">
              <label className="text-base font-medium">Kategori</label>
              <select
                className="outline-none py-2 px-3 rounded border border-gray-500/40 focus:border-[#F95959]"
                value={shopCategory}
                onChange={(e) => setShopCategory(e.target.value)}
              >
                <option value="Makanan">Makanan</option>
                <option value="Peralatan">Peralatan</option>
                <option value="Obat-obatan">Obat-obatan</option>
                <option value="Aksesori">Aksesori</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Harga */}
            <div className="flex flex-col gap-1 max-w-md">
              <label className="text-base font-medium">Harga</label>
              <input
                type="number"
                placeholder="0"
                className="outline-none py-2 px-3 rounded border border-gray-500/40 focus:border-[#F95959]"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            {/* Harga Diskon (Opsional) */}
            <div className="flex flex-col gap-1 max-w-md">
              <label className="text-base font-medium">Harga Diskon (Opsional)</label>
              <input
                type="number"
                placeholder="0"
                className="outline-none py-2 px-3 rounded border border-gray-500/40 focus:border-[#F95959]"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="px-8 py-2.5 bg-[#F95959] text-white font-medium rounded hover:bg-[#e04545] transition-colors"
            >
              Tambah Barang
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;