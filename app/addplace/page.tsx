'use client';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import axios from 'axios';

const AddPlace = () => {
 const [name, setName] = useState<string>('vishal kumar');
 const [email, setEmail] = useState<string>('vishalkr2291981121@gmail.com');
 const [amount, setAmount] = useState<string>('1');
 const [currency, setCurrency] = useState<string>('INR');
 const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

 useEffect(() => {
  const script = document.getElementById('razorpay-checkout-js');
  if (script) {
   script.onload = () => {
    setScriptLoaded(true);
   };
  }
 }, []);

 const createOrderId = async () => {
  try {
   const response = await axios.post('/api/payment', {
    amount: parseFloat(amount) * 100,
    currency: currency,
   });

   if (response.status !== 200) {
    throw new Error('Network response was not ok');
   }

   const data = response.data;
   return data.orderId;
  } catch (error) {
   console.error('There was a problem with your fetch operation:', error);
   return null;
  }
 };

 const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!scriptLoaded) {
   alert('Razorpay script is not loaded yet. Please try again.');
   return;
  }
  try {
   const orderId = await createOrderId();
   if (!orderId) {
    alert('Failed to create order ID');
    return;
   }

   const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use NEXT_PUBLIC_ prefix for client-side
    amount: parseFloat(amount) * 100,
    currency: currency,
    name: 'feedkaro',
    description: 'description',
    order_id: orderId,
    handler: async (response: any) => {
     const data = {
      orderCreationId: orderId,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpayOrderId: response.razorpay_order_id,
      razorpaySignature: response.razorpay_signature,
     };

     const result = await axios.post('/api/verify', data);

     if (result.data.isOk) {
      alert('Payment succeeded');
     } else {
      alert(result.data.message);
     }
    },
    prefill: {
     name: name,
     email: email,
    },
    theme: {
     color: '#3399cc',
    },
   };
   const paymentObject = new (window as any).Razorpay(options);
   paymentObject.on('payment.failed', (response: any) => {
    alert(response.error.description);
   });
   paymentObject.open();
  } catch (error) {
   console.log(error);
  }
 };

 return (
  <>
   <Script
    id="razorpay-checkout-js"
    src="https://checkout.razorpay.com/v1/checkout.js"
    onLoad={() => setScriptLoaded(true)}
   />

   <section className="min-h-[94vh] flex flex-col gap-6 h-14 mx-5 sm:mx-10 2xl:mx-auto 2xl:w-[1400px] items-center pt-36 ">
    <form
     className="flex flex-col gap-6 w-full sm:w-80"
     onSubmit={processPayment}
    >
     <div className="space-y-1">
      <label>Full name</label>
      <input
       type="text"
       required
       value={name}
       onChange={(e) => setName(e.target.value)}
      />
     </div>
     <div className="space-y-1">
      <label>Email</label>
      <input
       type="email"
       placeholder="user@gmail.com"
       required
       value={email}
       onChange={(e) => setEmail(e.target.value)}
      />
     </div>
     <div className="space-y-1">
      <label>Amount</label>
      <div className="flex gap-2">
       <input
        type="number"
        step="1"
        min={1}
        required
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
       />
      </div>
     </div>

     <button type="submit">Pay</button>
    </form>
   </section>
  </>
 );
}

export default AddPlace;
