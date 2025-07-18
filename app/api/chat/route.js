// app\api\chat\route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages } = await request.json(); // Ambil messages dari body request

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const httpReferer = process.env.HTTP_REFERER_DOMAIN || 'https://www.yourdomain.com';
    const xTitle = process.env.X_TITLE || 'YourAppName';

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openRouterApiKey}`,
          'HTTP-Referer': httpReferer,
          'X-Title': xTitle,
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