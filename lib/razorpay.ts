import Razorpay from 'razorpay'

const key_id = process.env.RAZORPAY_KEY_ID
const key_secret = process.env.RAZORPAY_KEY_SECRET

export const razorpay = key_id && key_secret 
  ? new Razorpay({ key_id, key_secret })
  : null as unknown as Razorpay

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
