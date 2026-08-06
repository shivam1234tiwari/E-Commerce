import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { formatINR } from '../utils/currency';
import { CreditCard, QrCode, Landmark, Truck, CheckCircle, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useContext(ShopContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

  const [shipping, setShipping] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    clearCart();
    navigate('/order-success');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-black text-slate-900 mb-6">Complete Your Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Delivery & Payment Details */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
          
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-600" /> Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={shipping.fullName}
                onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Mobile Number (+91)"
                required
                value={shipping.phone}
                onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <input
              type="text"
              placeholder="Flat / House No. / Building / Street Address"
              required
              value={shipping.address}
              onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
              className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="City"
                required
                value={shipping.city}
                onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                className="border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="State"
                required
                value={shipping.state}
                onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                className="border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Pincode"
                required
                value={shipping.pincode}
                onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })}
                className="border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Options */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" /> Choose Payment Option
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'upi', name: 'UPI / QR', icon: QrCode },
                { id: 'card', name: 'Card', icon: CreditCard },
                { id: 'netbanking', name: 'Net Banking', icon: Landmark },
                { id: 'cod', name: 'Cash on Delivery', icon: Truck },
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    type="button"
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{method.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Form Fields Based on Selected Payment */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 mt-4">
              {paymentMethod === 'upi' && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-700">Google Pay / PhonePe / Paytm UPI ID</p>
                  <input
                    type="text"
                    placeholder="e.g. rahul@upi or mobile@paytm"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500">You will receive a payment request on your UPI App.</p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Card Number (Visa / Mastercard / RuPay)"
                    required
                    maxLength={16}
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      required
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      className="bg-white border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      required
                      maxLength={4}
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      className="bg-white border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Select Your Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Pay with Cash / UPI when your package arrives at your doorstep.</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all duration-200 active:scale-95 shadow-md cursor-pointer text-base mt-2"
            >
              Pay & Confirm Order ({formatINR(cartTotal)})
            </button>
          </div>

        </form>

        {/* Right Column: Order Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs h-fit space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Order Summary</h2>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 max-w-[70%]">
                  <img src={item.image} alt={item.name} className="w-10 h-10 object-contain bg-slate-50 rounded-lg p-1 border border-slate-100" />
                  <span className="font-semibold text-slate-800 line-clamp-1">{item.name} x {item.qty}</span>
                </div>
                <span className="font-bold text-slate-900">{formatINR(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatINR(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span className="text-emerald-600 font-bold">FREE</span>
            </div>
            <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-100">
              <span>Total Amount</span>
              <span className="text-indigo-600">{formatINR(cartTotal)}</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}