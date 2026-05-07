import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')
    
    // In production, you would ideally use a separate WEBHOOK_SECRET. 
    // Here we use the key secret to match standard Razorpay webhook setups if they share the same secret.
    // It is highly recommended to set a specific WEBHOOK_SECRET in Razorpay Dashboard.
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'tyUkPYIB1ZK4OiQ8Do3bXXWb'

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex')

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(rawBody)

    // We only care about successful payments or orders
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const paymentEntity = event.payload.payment?.entity || event.payload.order?.entity
      const orderNotes = paymentEntity?.notes || {}
      
      const { planId, userId } = orderNotes

      if (planId && userId) {
        const supabase = createServerSupabaseClient()
        
        // Calculate period end based on plan
        const periodEnd = new Date()
        if (planId === 'monthly') {
          periodEnd.setMonth(periodEnd.getMonth() + 1)
        } else if (planId === 'weekly') {
          periodEnd.setDate(periodEnd.getDate() + 7)
        } else if (planId === 'yearly' || planId === 'lifetime') {
          periodEnd.setFullYear(periodEnd.getFullYear() + 1)
        } else {
          periodEnd.setDate(periodEnd.getDate() + 3) // trial
        }

        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            razorpay_order_id: paymentEntity.order_id || null,
            razorpay_payment_id: paymentEntity.id || null,
            status: 'active',
            plan: planId,
            current_period_end: periodEnd.toISOString()
          }, { onConflict: 'user_id' })

        if (error) {
          console.error('[WEBHOOK] Supabase Error:', error)
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
        }
        
        console.log(`[WEBHOOK] Successfully activated ${planId} plan for user ${userId}`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[WEBHOOK ERROR]:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
