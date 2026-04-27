import Razorpay from 'razorpay'

// Use fallbacks for build time to prevent crashes
const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'

export const razorpay = new Razorpay({
  key_id: key_id,
  key_secret: key_secret,
})

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are missing! Payment features will not work.')
}

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
