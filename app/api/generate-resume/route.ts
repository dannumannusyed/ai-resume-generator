import { NextRequest, NextResponse } from 'next/server'
import { generateTailoredResume } from '@/lib/ai'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkSubscriptionAccess } from '@/lib/subscription-server'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const access = await checkSubscriptionAccess(session.user.id, session.user.email)
    if (!access.hasAccess) {
      return NextResponse.json({ 
        error: 'TRIAL_EXPIRED', 
        message: 'Your 3-day free trial has expired or you do not have an active subscription.' 
      }, { status: 403 })
    }

    const { resumeData, jobAnalysis } = await request.json()

    if (!resumeData || !jobAnalysis) {
      return NextResponse.json({ error: 'Resume data and job analysis are required' }, { status: 400 })
    }

    // Call the real AI tailoring engine
    const tailoredResume = await generateTailoredResume(resumeData, jobAnalysis)

    return NextResponse.json(tailoredResume)
  } catch (error: any) {
    console.error('Error generating resume:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate resume' }, { status: 500 })
  }
}
