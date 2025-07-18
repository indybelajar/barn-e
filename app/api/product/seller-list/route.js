import { getAuth } from '@clerk/nextjs/server';
import Product from '../../../../models/product';
import Shop from '../../../../models/shop';
import authSeller from '../../../../lib/authSeller';
import { NextResponse } from 'next/server';
import connectDB from '../../../../config/db';

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId); // Pastikan authSeller async jika perlu

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'not authorized' });
        }

        await connectDB();

        const products = await Product.find({});
        const shops = await Shop.find({});

        return NextResponse.json({
            success: true,
            products,
            shops
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        });
    }
}
