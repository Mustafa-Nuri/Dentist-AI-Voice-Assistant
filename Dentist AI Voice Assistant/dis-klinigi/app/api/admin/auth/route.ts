import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Get credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

    if (username === adminUsername && password === adminPassword) {
      return NextResponse.json({
        success: true,
        message: 'Giriş başarılı'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Kullanıcı adı veya şifre hatalı' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Giriş işlemi başarısız' },
      { status: 500 }
    );
  }
}
