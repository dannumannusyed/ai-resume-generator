import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    // Create user in Supabase Auth using ADMIN to bypass rate limits and auto-confirm
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: name.split(' ')[0] || name,
        last_name: name.split(' ').slice(1).join(' ') || '',
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 400 })
    }

    return NextResponse.json(
      {
        user: {
          id: authData.user.id,
          name: name,
          email: authData.user.email,
        },
        message: 'User created successfully. Please check your email for verification.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error signing up:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
