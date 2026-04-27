import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkSubscriptionAccess } from '@/lib/subscription-server'

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const access = await checkSubscriptionAccess(session.user.id, session.user.email)

    return NextResponse.json({
      data: {
        plan_id: access.plan,
        status: access.status,
        has_access: access.hasAccess,
        is_trial: access.isTrial
      }
    })
  } catch (error: any) {
    console.error('GET /api/user/subscription error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
