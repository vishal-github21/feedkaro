'use client';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

const AddBalance = () => {
    const searchParams = useSearchParams();
  const placeid = searchParams.get('placeid');
 const [name, setName] = useState<string>('vishal kumar');
 const [email, setEmail] = useState<string>('vishalkr2291981121@gmail.com');
 const [amount, setAmount] = useState<string>('10');
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
        try {
            const response = await axios.post("/api/updatebalance", {
              placeid:placeid,amount:amount
            });
            console.log(response.data);
          } catch (err) {
            console.error("Error:", err);
          }
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
   <div className='absolute top-5 font-bold text-2xl text-gray-500 left-12'>feedkaro</div>
   <section className="min-h-screen bg-gray-200 flex justify-center w-full gap-6 h-14 items-center ">
    <form
     className="flex flex-col bg-gray-400 border-2 w-[90vh] border-black rounded-lg p-6 gap-6"
     onSubmit={processPayment}
    >
     <div className="space-y-1 ">
      <label className='text-black'>Full name</label>
      <input
       type="text"
       required
       value={name}
       onChange={(e) => setName(e.target.value)}
       className='ml-4 text-slate-600 font-mono px-2 w-[40%]'
      />
     </div>
     <div className="space-y-1">
      <label className="text-black">Email</label>
      <input
       type="email"
       placeholder="user@gmail.com"
       required
       value={email}
       onChange={(e) => setEmail(e.target.value)}
       className='ml-4 text-slate-600 font-mono px-2 w-[60%]'
      />
     </div>
     <div className="space-y-1">
      <label  className='text-black'>Amount</label>
       <input
        type="number"
        step="10"
        min={10}
        required
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className='ml-4 text-slate-600 font-mono px-2'
       />
     </div>

     <button type="submit">Pay</button>
    </form>
   </section>
  </>
 );
}

export default AddBalance;
