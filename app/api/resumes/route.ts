import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/resumes - list all resumes for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const db = createServerSupabaseClient()

    if (id) {
      // Fetch single resume
      const { data, error } = await db
        .from('resumes')
        .select('*')
        .eq('id', id)
        .eq('user_id', session.user.id)
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      return NextResponse.json({ data })
    }

    // Get all resumes for this user
    const { data: resumes, error } = await db
      .from('resumes')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data: resumes })
  } catch (error: any) {
    console.error('GET /api/resumes error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch resumes', details: error },
      { status: 500 }
    )
  }
}

// POST /api/resumes - save a new resume
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, content, resumeData, atsScore, jobRole, isTailored, template } = body

    console.log('[SAVE RESUME]: User ID:', session.user.id, 'Data Name:', name)

    if (!content) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 })
    }

    const db = createServerSupabaseClient()

    const { data: resume, error } = await db
      .from('resumes')
      .insert([
        {
          user_id: session.user.id,
          name: name || 'Tailored Resume',
          content,
          resume_data: resumeData || null,
          ats_score: atsScore || 0,
          job_role: jobRole || null,
          is_tailored: isTailored || false,
          template: template || 'classic'
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('[DATABASE ERROR]: Failed to insert resume:', error)
      throw error
    }

    return NextResponse.json({ data: resume })
  } catch (error: any) {
    console.error('POST /api/resumes error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save resume', details: error },
      { status: 500 }
    )
  }
}

// PATCH /api/resumes?id=... - update an existing resume (e.g. template, name)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 })
    }

    const body = await req.json()
    const db = createServerSupabaseClient()

    const { data, error } = await db
      .from('resumes')
      .update(body)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('PATCH /api/resumes error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/resumes?id=... - delete a resume
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 })
    }

    const db = createServerSupabaseClient()
    
    // Ensure the resume belongs to the user before deleting
    const { error } = await db
      .from('resumes')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('DELETE /api/resumes error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
