// app/api/address/route.js
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Address from '../../../models/address';
import connectDB from '../../../config/db';

export async function POST(request) {
    try {
        // Get user authentication
        const { userId } = getAuth(request);
        
        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: 'Unauthorized - Please login' 
            }, { status: 401 });
        }

        // Parse request body
        const body = await request.json();
        const { fullName, phoneNumber, pincode, area, city, state, isDefault } = body;

        // Validasi input
        if (!fullName || !phoneNumber || !pincode || !area || !city || !state) {
            return NextResponse.json({ 
                success: false, 
                message: 'Semua field harus diisi' 
            }, { status: 400 });
        }

        // Connect to database
        await connectDB();

        // Jika alamat ini akan dijadikan default, set alamat lain menjadi false
        if (isDefault) {
            await Address.updateMany(
                { userId, isDefault: true },
                { isDefault: false }
            );
        }

        // Create new address
        const newAddress = await Address.create({
            userId,
            fullName,
            phoneNumber,
            pincode,
            area,
            city,
            state,
            isDefault: isDefault || false,
            date: Date.now()
        });

        return NextResponse.json({
            success: true,
            message: 'Alamat berhasil disimpan',
            data: newAddress
        }, { status: 201 });

    } catch (error) {
        console.error('Error saving address:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Terjadi kesalahan server'
        }, { status: 500 });
    }
}

// GET untuk mengambil semua alamat user
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        
        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: 'Unauthorized - Please login' 
            }, { status: 401 });
        }

        await connectDB();

        const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: addresses
        });

    } catch (error) {
        console.error('Error fetching addresses:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Terjadi kesalahan server'
        }, { status: 500 });
    }
}