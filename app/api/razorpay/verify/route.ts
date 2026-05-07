import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { razorpay } from '@/lib/razorpay'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
    }

    // --- SEC-004: Verify against official order data ---
    let order;
    try {
      order = await razorpay.orders.fetch(razorpay_order_id)
    } catch (err) {
      console.error('Failed to fetch order:', err)
      return NextResponse.json({ error: 'Could not verify order with payment provider' }, { status: 400 })
    }

    if (!order || !order.notes) {
      return NextResponse.json({ error: 'Order details missing metadata' }, { status: 400 })
    }

    const { planId, userId } = order.notes
    
    if (!planId || !userId) {
      return NextResponse.json({ error: 'Order metadata incomplete' }, { status: 400 })
    }

    // Verify signature
    const text = razorpay_order_id + '|' + razorpay_payment_id
    const generated_signature = crypto
      .createHmac('sha256', 'tyUkPYIB1ZK4OiQ8Do3bXXWb')
      .update(text)
      .digest('hex')

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Update user subscription in Supabase
    const supabase = createServerSupabaseClient()
    
    // Calculate period end based on plan
    const periodEnd = new Date()
    if (planId === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    } else if (planId === 'weekly') {
      periodEnd.setDate(periodEnd.getDate() + 7)
    } else if (planId === 'yearly' || planId === 'lifetime') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1) // Or 10 years for lifetime
    } else {
      periodEnd.setDate(periodEnd.getDate() + 3) // Default trial logic
    }

    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        razorpay_order_id,
        razorpay_payment_id,
        status: 'active',
        plan: planId,
        current_period_end: periodEnd.toISOString()
      }, { onConflict: 'user_id' })

    if (error) {
      console.error('Supabase subscription error:', error)
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Payment verified and subscription activated' })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
