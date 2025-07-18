'use client'
import Navbar from '../../components/Navbar'
import React from 'react'
import Sidebar from '../../components/seller/Sidebar'

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className='flex w-full'>
        <Sidebar />
        {children}
      </div>
    </div>
  )
}

export default Layout