import Razorpay from 'razorpay'

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('[RAZORPAY] RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are not set in .env.local! Payment will not work.')
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function createRazorpayOrder(amount: number, currency: string = 'INR', receipt: string) {
  const options = {
    amount: Math.round(amount * 100), // Razorpay expects amount in smallest currency unit (cents/paise)
    currency,
    receipt,
  }

  try {
    const order = await razorpay.orders.create(options)
    return order
  } catch (error) {
    console.error('Razorpay order creation failed:', error)
    throw error
  }
}
