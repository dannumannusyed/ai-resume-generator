import { NextRequest, NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PRICING_PLANS } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId } = await request.json()

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      )
    }

    // --- SEC-001: Secure Price Lookup ---
    const plan = PRICING_PLANS.find(p => p.id === planId)
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    const secureAmount = plan.priceAmount
    // --- End Sec ---

    const options: any = {
      amount: Math.round(secureAmount * 100), // paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}_${planId}`,
      notes: {
        userId: session.user.id,
        planId: planId,
        userEmail: session.user.email
      }
    }

    const order = await razorpay.orders.create(options) as any

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    })
  } catch (error: any) {
    console.error('Razorpay order error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}
