import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { priceId, plan } = await request.json()

    if (!priceId || !plan) {
      return NextResponse.json(
        { error: 'Missing priceId or plan' },
        { status: 400 }
      )
    }

    // In production, create Stripe checkout session
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [
    //     {
    //       price: priceId,
    //       quantity: 1,
    //     },
    //   ],
    //   mode: 'subscription',
    //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    // })

    // For development, simulate payment
    return NextResponse.json(
      {
        sessionId: `sim_${Date.now()}`,
        clientSecret: `secret_${Date.now()}`,
        message: 'Checkout session created (simulated)',
        // In production, return: { url: session.url }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
