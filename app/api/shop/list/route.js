// app/api/shop/list/route.js (example content)
import { NextResponse } from 'next/server';
import Shop from '../../../../models/shop';
import connectDB from '../../../../config/db';

export async function GET(request) { // <--- This function must be present and correctly exported
  try {
    await connectDB();
    const shops = await Shop.find({}).limit(6); // Example fetch
    return NextResponse.json({ success: true, shops });
  } catch (error) {
    console.error('Error in /api/shop/list:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}