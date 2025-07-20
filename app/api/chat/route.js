// app\api\chat\route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages } = await request.json(); // Ambil messages dari body request

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const httpReferer = process.env.HTTP_REFERER_DOMAIN || 'https://barn-e.vercel.app';
    const xTitle = process.env.X_TITLE || 'Barn-e';



    console.log('=== ENV DEBUG ===');
    console.log('CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY);
    console.log('MONGODB_URL:', process.env.MONGODB_URL);
    console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY);
    console.log('================');


    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': `https://${process.env.HTTP_REFERER_DOMAIN}`,
        'X-Title': process.env.X_TITLE,
        'Content-Type': 'application/json',
    },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: messages,
        }),
      }
    );

    const data = await response.json();
    console.log("OpenRouter API Response:", data);

    if (response.status !== 200) {
      // Tangani error dari OpenRouter API
      console.error("OpenRouter API Error:", data);
      return NextResponse.json({
        success: false,
        message: data.error?.message || 'Error from OpenRouter API',
        details: data // Kirim detail error untuk debugging
      }, { status: response.status });
    }

    const markdownText = data.choices?.[0]?.message?.content || 'No response received.';

    return NextResponse.json({ success: true, response: markdownText });

  } catch (error) {
    console.error('Server-side error when calling OpenRouter:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}