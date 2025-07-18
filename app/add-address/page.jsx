'use client'
import { assets } from "../../assets/assets";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";
import { useState } from "react";

const AddAddress = () => {
    const [address, setAddress] = useState({
        fullName: '',
        phoneNumber: '',
        pincode: '',
        area: '',
        city: '',
        state: '',
        isDefault: false,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(address),
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Alamat berhasil disimpan!');
                // Reset form
                setAddress({
                    fullName: '',
                    phoneNumber: '',
                    pincode: '',
                    area: '',
                    city: '',
                    state: '',
                    isDefault: false,
                });
            } else {
                setMessage(data.message || 'Terjadi kesalahan');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Terjadi kesalahan saat menyimpan alamat');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
                <form onSubmit={onSubmitHandler} className="w-full">
                    <p className="text-2xl md:text-3xl text-gray-500">
                        Tambah <span className="font-semibold text-[#F95959]">Alamat</span>
                    </p>
                    
                    {message && (
                        <div className={`mt-4 p-3 rounded max-w-sm ${
                            message.includes('berhasil') 
                                ? 'bg-green-100 text-green-700 border border-green-300' 
                                : 'bg-red-100 text-red-700 border border-red-300'
                        }`}>
                            {message}
                        </div>
                    )}

                    <div className="space-y-3 max-w-sm mt-10">
                        <input
                            className="px-2 py-2.5 focus:border-[#F95959] transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="text"
                            placeholder="Nama Lengkap"
                            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                            value={address.fullName}
                            required
                        />
                        <input
                            className="px-2 py-2.5 focus:border-[#F95959] transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="text"
                            placeholder="Nomor Telepon"
                            onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                            value={address.phoneNumber}
                            required
                        />
                        <input
                            className="px-2 py-2.5 focus:border-[#F95959] transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="text"
                            placeholder="Kode Pos"
                            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                            value={address.pincode}
                            required
                        />
                        <textarea
                            className="px-2 py-2.5 focus:border-[#F95959] transition border border-gray-500/30 rounded outline-none w-full text-gray-500 resize-none"
                            rows={4}
                            placeholder="Alamat (Jalan atau Kelurahan)"
                            onChange={(e) => setAddress({ ...address, area: e.target.value })}
                            value={address.area}
                            required
                        ></textarea>
                        <div className="flex space-x-3">
                            <input
                                className="px-2 py-2.5 focus:border-[#F95959] transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                                type="text"
                                placeholder="Kota/Kabupaten"
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                value={address.city}
                                required
                            />
                            <input
                                className="px-2 py-2.5 focus:border-[#F95959] transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                                type="text"
                                placeholder="Provinsi"
                                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                value={address.state}
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isDefault"
                                checked={address.isDefault}
                                onChange={(e) => setAddress({ ...address, isDefault: e.target.checked })}
                                className="w-4 h-4 text-[#F95959] border-gray-300 rounded focus:ring-[#F95959]"
                            />
                            <label htmlFor="isDefault" className="text-sm text-gray-500">
                                Jadikan alamat utama
                            </label>
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="max-w-sm w-full mt-6 bg-[#F95959] text-white py-3 hover:bg-gray-400 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Alamat'}
                    </button>
                </form>
                <Image
                    className="md:mr-16 mt-16 md:mt-0"
                    src={assets.my_location_image}
                    alt="my_location_image"
                />
            </div>
            <Footer />
        </>
    );
};

export default AddAddress;