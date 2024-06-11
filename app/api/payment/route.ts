import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';

// Ensure environment variables are correctly named and accessed
const razorpay = new Razorpay({
 key_id: process.env.RAZORPAY_KEY_ID!,
 key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
 try {
  const { amount, currency } = await request.json();

  // Validate input
  if (!amount || !currency) {
   return NextResponse.json(
    { error: 'Amount and currency are required' },
    { status: 400 }
   );
  }

  const options = {
   amount: parseInt(amount, 10), // Amount should be in smallest currency unit
   currency: currency,
   receipt: 'receipt#1',
  };

  const order = await razorpay.orders.create(options);
  console.log(order);

  return NextResponse.json({ orderId: order.id }, { status: 200 });
 } catch (error) {
  console.error('Error creating Razorpay order:', error);
  return NextResponse.json(
   { error: 'Error creating Razorpay order' },
   { status: 500 }
  );
 }
}
