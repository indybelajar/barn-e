"use client"; // Make sure this is the very first line

import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import Image from "next/image";
import { useClerk, SignedOut } from "@clerk/nextjs"; // Import useClerk and SignedOut

const HeaderSlider = () => {
  // Destructure openSignIn and openSignUp from useClerk()
  const { openSignIn, openSignUp } = useClerk();

  const sliderData = [
    {
      id: 1,
      title: "Barn-E Solusi Terintegrasi untuk Manajemen Peternakan",
      offer: "Ayo! Mulai Beternak Sekarang Juga!",
      buttonText1: "Lewati",
      buttonText2: "Selanjutnya",
      imgSrc: assets.Farmer_girl,
    },
    {
      id: 2,
      title: "Barn-E Catat dan Pantau Kondisi Ternak Secara Terstruktur",
      offer: "Kelola jadwal perawatan dan kesehatan ternak dengan lebih praktis.",
      buttonText1: "Lewati",
      buttonText2: "Selanjutnya",
      imgSrc: assets.slides2, // Make sure this path is correct or in public folder
    },
    {
      id: 3,
      title: "Barn-E Kebutuhan ternak dalam genggaman",
      offer: "Temukan berbagai produk dan perlengkapan peternakan langsung dari Barn-E. Praktis, cepat, dan tanpa ribet.",
      buttonText1: "Login", // This will trigger openSignIn()
      buttonText2: "Daftar", // This will trigger openSignUp()
      imgSrc: assets.slides3, // Make sure this path is correct or in public folder
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 3000); // Auto-advances every 3 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index); // Allows manual slide change via dots
  };

  return (
    <div className="overflow-hidden relative w-full">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            // Applying the gradient background as requested
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-gradient-to-b from-[#F95959] to-[#FFFFFF] py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full"
          >
            <div className="md:pl-8 mt-10 md:mt-0">
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold text-[#FFFFFF]">
                {slide.title}
              </h1>
              <p className="text-sm md:text-base text-[#F95959] pb-1 max-w-[90%] md:max-w-md break-words">
                 {slide.offer}
              </p>


              <div className="flex items-center mt-4 md:mt-6 ">
                {/* Conditionally render buttons based on signed-out status */}
                <SignedOut>
                  {/* Button 1: Login / Lewati */}
                  {/* If slide.id is 3, it's Login, otherwise it's Lewati */}
                  {slide.id === 3 ? (
                    <button
                      onClick={() => openSignIn()} // Clerk's SignIn modal
                      className="md:px-10 px-7 md:py-2.5 py-2 bg-[#F95959] rounded-full text-white font-medium"
                    >
                      {slide.buttonText1} {/* Should be "Login" for slide 3 */}
                    </button>
                  ) : (
                    <button className="md:px-10 px-7 md:py-2.5 py-2 bg-[#F95959] rounded-full text-white font-medium">
                      {slide.buttonText1} {/* Should be "Lewati" for other slides */}
                    </button>
                  )}

                  {/* Button 2: Daftar / Selanjutnya */}
                  {/* If slide.id is 3, it's Daftar, otherwise it's Selanjutnya */}
                  {slide.id === 3 ? (
                    <button
                      onClick={() => openSignUp()} // Clerk's SignUp modal
                      className="group flex items-center gap-2 px-6 py-2.5 font-medium text-[#F95959]"
                    >
                      {slide.buttonText2} {/* Should be "Daftar" for slide 3 */}
                      <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon} alt="arrow_icon" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSlideChange((index + 1) % sliderData.length)} // Moves to next slide
                      className="group flex items-center gap-2 px-6 py-2.5 font-medium text-[#F95959]"
                    >
                      {slide.buttonText2} {/* Should be "Selanjutnya" for other slides */}
                      <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon} alt="arrow_icon" />
                    </button>
                  )}
                </SignedOut>

                {/* You might want to render different content if the user is SignedIn */}
                {/* For example: */}
                {/*
                <SignedIn>
                  <button className="md:px-10 px-7 md:py-2.5 py-2 bg-green-600 rounded-full text-white font-medium">
                    Go to Dashboard
                  </button>
                </SignedIn>
                */}
              </div>
            </div>
            <div className="flex items-center flex-1 justify-center">
              <Image
                className="md:w-72 w-48"
                src={slide.imgSrc} // Ensure this path is valid for next/image
                alt={`Slide ${index + 1}`}
                width={288} // Add explicit width and height for Next.js Image component
                height={192} // Adjust these based on your image dimensions and desired aspect ratio
                priority={index === currentSlide} // Optimize current slide image loading
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-[#F95959]" : "bg-gray-500/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;