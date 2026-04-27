import { NextRequest, NextResponse } from 'next/server'

// Simulate OAuth callback from GitHub
// In production, this would exchange code for access token
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/auth/login?error=no_code', request.url))
  }

  try {
    // In production, exchange code for access token with GitHub API
    // const response = await fetch('https://github.com/login/oauth/access_token', {
    //   method: 'POST',
    //   headers: { 'Accept': 'application/json' },
    //   body: JSON.stringify({
    //     client_id: process.env.GITHUB_ID,
    //     client_secret: process.env.GITHUB_SECRET,
    //     code,
    //   }),
    // })
    // const data = await response.json()
    // const access_token = data.access_token

    // For now, simulate successful login
    const response = NextResponse.redirect(new URL('/dashboard', request.url))
    response.cookies.set('auth_token', `github_${Date.now()}`, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error('GitHub OAuth error:', error)
    return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url))
  }
}
