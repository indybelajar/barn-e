// Assuming this is src/app/api/product/seller-list/route.js

import { getAuth } from '@clerk/nextjs/server';
import Product from '../../../../models/product';
import Shop from '../../../../models/shop';
import authSeller from '../../../../lib/authSeller';
import { NextResponse } from 'next/server';
import connectDB from '../../../../config/db';

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) { // Always check for userId first
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        await connectDB();

        // Fetch products associated with the userId
        // Assuming your Product model has a 'userId' field
        const products = await Product.find({ userId }); // <--- Fetch products by userId

        // Fetch shops associated with the userId
        // Assuming your Shop model also has a 'userId' field
        const shops = await Shop.find({ userId });       // <--- Fetch shops by userId

        // Return both products AND shops in the response
        return NextResponse.json({ success: true, products, shops });

    } catch (error) {
        console.error('API Error in /seller-list:', error); // Log the error for debugging
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
  try {
    const { productId } = params; // Get the product ID from the URL parameters
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const isSeller = await authSeller(userId); // Ensure the user is a seller
    if (!isSeller) {
      return NextResponse.json({ success: false, message: 'Not authorized as seller' }, { status: 403 });
    }

    await connectDB();

    // Find the product and check if it belongs to the current seller
    // IMPORTANT: Use the correct model (Product or Shop) based on your data structure
    const productToDelete = await Shop.findOne({ _id: productId, userId: userId }); // Using Shop model as per your component's data

    if (!productToDelete) {
      return NextResponse.json({ success: false, message: 'Product not found or you do not own it' }, { status: 404 });
    }

    // Delete the product
    await Shop.deleteOne({ _id: productId, userId: userId }); // Delete it from the database

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
