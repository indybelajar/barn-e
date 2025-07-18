"use client";

import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Image from "next/image";
import axios from "axios";
import { useAppContext } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";

const FeaturedProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getToken } = useAppContext();

    const fetchProductData = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const { data } = await axios.get("/api/product/list", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setProducts(data.products ?? []);
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
        fetchProductData();
    }, []);

    if (loading) {
        return (
            <>
                <Navbar />
                <div>Loading semua hewan...</div>
            </>
        );
    }

    if (products.length === 0) {
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </>
    );
};

export default FeaturedProduct;