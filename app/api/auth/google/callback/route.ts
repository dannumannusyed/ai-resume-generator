import { NextRequest, NextResponse } from 'next/server'

// Simulate OAuth callback from Google
// In production, this would exchange code for access token
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/auth/login?error=no_code', request.url))
  }

  try {
    // In production, exchange code for access token with Google API
    // const response = await fetch('https://oauth2.googleapis.com/token', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   body: new URLSearchParams({
    //     client_id: process.env.GOOGLE_CLIENT_ID!,
    //     client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    //     code,
    //     grant_type: 'authorization_code',
    //     redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
    //   }).toString(),
    // })
    // const data = await response.json()
    // const access_token = data.access_token

    // For now, simulate successful login
    const response = NextResponse.redirect(new URL('/dashboard', request.url))
    response.cookies.set('auth_token', `google_${Date.now()}`, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url))
  }
}
