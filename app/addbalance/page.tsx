'use client';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

const AddBalance = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const placeid = searchParams.get('placeid');
  const id = searchParams.get('id');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
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
                placeid: placeid, 
                amount: amount
              });
              console.log(response.data);
            } catch (err) {
              console.error("Error:", err);
            }
            alert('Payment succeeded');
            router.push(`/yourplaces?id=${id}`);
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
      
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse top-10 left-10" />
          <div className="absolute w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000 bottom-10 right-10" />
          <div className="absolute w-full h-full bg-gradient-to-t from-black/10 to-transparent" />
          
          {/* Floating particles */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: (Math.random() * 3 + 4) + 's'
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-12 z-20">
          <div className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            feed<span className="text-purple-300">karo</span>
          </div>
        </div>

        {/* Main Content */}
        <section className="relative z-10 min-h-screen flex justify-center items-center p-4">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-2xl">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 backdrop-blur-md bg-gradient-to-r from-green-400/30 to-blue-400/30 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-green-200 to-blue-200 bg-clip-text text-transparent mb-2">
                Add Balance
              </h2>
              <p className="text-white/70">Securely add funds to your account</p>
            </div>

            {/* Payment Form */}
            <form onSubmit={processPayment} className="space-y-6">
              {/* Personal Information Section */}
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white/90 flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white/90 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="user@gmail.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Details Section */}
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Payment Details
                </h3>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white/90 flex items-center gap-2">
                    <svg className="w-4 h-4 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Amount (₹)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="10"
                      min={10}
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 pl-8"
                      placeholder="Enter amount"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-300">₹</span>
                  </div>
                  <p className="text-xs text-white/60">Minimum amount: ₹10</p>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-3">
                  {[50, 100, 500, 1000].map((quickAmount) => (
                    <button
                      key={quickAmount}
                      type="button"
                      onClick={() => setAmount(quickAmount.toString())}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        amount === quickAmount.toString()
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                          : 'backdrop-blur-md bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      ₹{quickAmount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="backdrop-blur-md bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Payment Summary
                </h3>
                <div className="flex justify-between items-center text-white">
                  <span>Total Amount:</span>
                  <span className="text-2xl font-bold text-green-300">₹{amount}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!scriptLoaded}
                className="group relative overflow-hidden w-full px-8 py-4 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transform hover:scale-105 disabled:transform-none transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {!scriptLoaded ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Loading Payment Gateway...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Proceed to Secure Payment
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              {/* Security Notice */}
              <div className="backdrop-blur-md bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-200 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secured by Razorpay • Your payment information is encrypted and secure
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
};

export default AddBalance;
