import { NextRequest, NextResponse } from 'next/server'

export async function POST(_request: NextRequest) {
  try {
    // const body = await request.json()

    // Verify webhook signature from Stripe
    // const sig = request.headers.get('stripe-signature')
    // if (!sig) {
    //   return NextResponse.json({ error: 'No signature' }, { status: 400 })
    // }

    // const event = stripe.webhooks.constructEvent(
    //   body,
    //   sig,
    //   process.env.STRIPE_WEBHOOK_SECRET!
    // )

    // Handle different event types
    // if (event.type === 'checkout.session.completed') {
    //   const session = event.data.object
    //   // Update user subscription in database
    // }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}
