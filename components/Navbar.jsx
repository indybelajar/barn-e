// components/Navbar.jsx
"use client";

import React, { useState } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon, } from "../assets/assets";
import Link from "next/link";
import { useAppContext } from "../context/AppContext";
import Image from "next/image";
import { useClerk, useUser, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const { isSeller, router } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle loading state from Clerk
  if (!isLoaded) {
    return (
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
        <div className="animate-pulse flex items-center gap-2">
          <div className="w-10 md:w-16 h-10 md:h-16 bg-gray-300 rounded"></div>
          <div className="w-10 md:w-16 h-10 md:h-16 bg-gray-300 rounded"></div>
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image
          src={assets.logo}
          alt="logo"
          className="w-10 md:w-16"
        />
        <Image
          src={assets.text_icon}
          alt="text icon"
          className="w-10 md:w-16"
        />
      </div>

      {/* Desktop Menu */}
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/chat" className="text-gray-700 hover:text-blue-600">
          Barn-E AI
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Toko Ternak
        </Link>
        <Link href="/jadwal-ternak" className="hover:text-gray-900 transition">
          Jadwal & Ternak
        </Link>

        {(
          <button 
            onClick={() => router.push('/seller')} 
            className="text-xs border px-4 py-1.5 rounded-full hover:bg-gray-100 transition"
          >
            Dashboard
          </button>
        )}
      </div>

      {/* Desktop User Actions */}
      <div className="hidden md:flex items-center gap-4">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Home" 
                labelIcon={<HomeIcon />} 
                onClick={() => router.push('/')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Products" 
                labelIcon={<BoxIcon />} 
                onClick={() => router.push('/all-products')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Cart" 
                labelIcon={<CartIcon />} 
                onClick={() => router.push('/cart')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="My Orders" 
                labelIcon={<BagIcon />} 
                onClick={() => router.push('/my-orders')} 
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button 
            onClick={openSignIn} 
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button 
            onClick={() => router.push('/seller')} 
            className="text-xs border px-3 py-1 rounded-full hover:bg-gray-100 transition"
          >
            Admin
          </button>
        )}
        
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Home" 
                labelIcon={<HomeIcon />} 
                onClick={() => router.push('/')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Barn-E AI" 
                labelIcon={<BoxIcon />} 
                onClick={() => router.push('/chat')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Products" 
                labelIcon={<BoxIcon />} 
                onClick={() => router.push('/all-products')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="Cart" 
                labelIcon={<CartIcon />} 
                onClick={() => router.push('/cart')} 
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action 
                label="My Orders" 
                labelIcon={<BagIcon />} 
                onClick={() => router.push('/my-orders')} 
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button 
            onClick={openSignIn} 
            className="flex items-center gap-1 hover:text-gray-900 transition"
          >
            <Image src={assets.user_icon} alt="user icon" className="w-6 h-6" />
            <span className="text-sm">Account</span>
          </button>
        )}

        {/* Mobile Menu Toggle */}

      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-300 md:hidden z-50">
          <div className="flex flex-col px-6 py-4 gap-4">
            <Link 
              href="/" 
              className="hover:text-gray-900 transition py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/chat" 
              className="text-gray-700 hover:text-blue-600 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Barn-E AI
            </Link>
            <Link 
              href="/all-products" 
              className="hover:text-gray-900 transition py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Toko Ternak
            </Link>
            <Link 
              href="/" 
              className="hover:text-gray-900 transition py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Jadwal & Ternak
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;