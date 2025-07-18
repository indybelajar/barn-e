// components/Navbar.jsx
"use client";

import React from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon, } from "../assets/assets";
import Link from "next/link";
import { useAppContext } from "../context/AppContext";
import Image from "next/image";
 // Assuming you have a TextImage component
// Import useClerk, useUser, and UserButton from @clerk/nextjs
import { useClerk, useUser, UserButton } from "@clerk/nextjs"; // <--- Add useUser and UserButton here!


const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser(); // <--- Use the useUser hook here
  const { openSignIn } = useClerk();
  const { isSeller, router } = useAppContext(); // Assuming 'router' is from useAppContext or 'next/navigation'

  // You might want to handle loading state from Clerk
  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
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
        <Link href="/" className="hover:text-gray-900 transition">
          Jadwal & Ternak
        </Link>

        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Dashboard Admin</button>}

      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        {
          // Now 'user' and 'UserButton' are defined
          user
            ? <>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action label="Home"labelIcon={<HomeIcon />} onClick={()=> router.push('/')} />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="Produtcs"labelIcon={<BoxIcon />} onClick={()=> router.push('/all-products')} />
              </UserButton.MenuItems>
               <UserButton.MenuItems>
                <UserButton.Action label="Cart"labelIcon={<CartIcon />} onClick={()=> router.push('cart')} />
              </UserButton.MenuItems>
                     <UserButton.MenuItems>
                <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={()=> router.push('my-orders')} />
              </UserButton.MenuItems>
            </UserButton>
            </>
            : (
              <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
                <Image src={assets.user_icon} alt="user icon" />
                Account
              </button>
            )
        }
      </ul>

      {/* This block also needs the same conditional logic if it's for mobile/small screens */}
      <div className="flex items-center md:hidden gap-3">
        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Dashboard Admin</button>}
        {
          user
            ? (
              <>
                <UserButton afterSignOutUrl="/" />
              </>
            )
            : (
              <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
                <Image src={assets.user_icon} alt="user icon" />
                Account
              </button>
            )
        }
      </div>
    </nav>
  );
};

export default Navbar;