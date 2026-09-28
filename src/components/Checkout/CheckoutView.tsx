import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerInfo, PaymentMethodType } from '../../types';
import { PAKISTAN_CITIES } from '../../data/mockData';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Smartphone,
  Banknote,
  AlertCircle,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotalPKR,
    cartShippingPKR,
    cartDiscountPKR,
    cartTotalPKR,
    createOrder,
    setCurrentView,
    storeSettings,
  } = useApp();

  const [formData, setFormData] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('jazzcash');
  const [jazzcashNumber, setJazzcashNumber] = useState('');
  const [easypaisaNumber, setEasypaisaNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleCityChange = (cityName: string) => {
    const selected = PAKISTAN_CITIES.find((c) => c.name === cityName);
    setFormData((prev) => ({
      ...prev,
      city: cityName,
      province: selected ? selected.province : prev.province,
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.phone.trim() || formData.phone.length < 10)
      errors.phone = 'Valid Pakistani mobile number (03XX XXXXXXX) is required';
    if (!formData.email.trim() || !formData.email.includes('@'))
      errors.email = 'Valid email address is required for dispatch tracking';
    if (!formData.address.trim()) errors.address = 'Street address is required';

    if (paymentMethod === 'jazzcash' && !jazzcashNumber.trim()) {
      errors.jazzcash = 'Please enter your 11-digit JazzCash mobile account number';
    }
    if (paymentMethod === 'easypaisa' && !easypaisaNumber.trim()) {
      errors.easypaisa = 'Please enter your 11-digit Easypaisa mobile account number';
    }
    if (paymentMethod === 'card' && (!cardNumber || cardNumber.length < 15)) {
      errors.card = 'Please enter a valid card number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Realistic order processing
    setTimeout(() => {
      let ref: string | undefined = undefined;
      if (paymentMethod === 'jazzcash') ref = `JC-${Math.floor(10000000 + Math.random() * 90000000)}`;
      if (paymentMethod === 'easypaisa') ref = `EP-${Math.floor(10000000 + Math.random() * 90000000)}`;
      if (paymentMethod === 'card') ref = `AUTH-VISA-${Math.floor(100000 + Math.random() * 900000)}`;

      createOrder(formData, paymentMethod, ref);
      setIsSubmitting(false);
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <p className="text-sm text-neutral-600">Your cart is currently empty.</p>
        <button
          onClick={() => setCurrentView('customize')}
          className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider"
        >
          Create A Custom Cover
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="pb-6 mb-6 border-b border-neutral-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-brand-display">
          Express Checkout
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Complete your delivery details for nationwide courier dispatch.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Customer Information & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Information Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
              <Truck className="w-4 h-4 text-neutral-700" />
              <span>1. Delivery Destination (Pakistan)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Muhammad Usman"
                  className={`w-full px-3.5 py-2.5 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-neutral-50/50 ${
                    formErrors.fullName ? 'border-red-400 bg-red-50/20' : 'border-neutral-300'
                  }`}
                />
                {formErrors.fullName && (
                  <span className="text-[11px] text-red-600 mt-1 block">{formErrors.fullName}</span>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Mobile Number (For Courier SMS & Rider Call) *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0300 1234567"
                  className={`w-full px-3.5 py-2.5 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-neutral-50/50 ${
                    formErrors.phone ? 'border-red-400 bg-red-50/20' : 'border-neutral-300'
                  }`}
                />
                {formErrors.phone && (
                  <span className="text-[11px] text-red-600 mt-1 block">{formErrors.phone}</span>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Email Address (For Order Tracking Receipt) *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="usman@example.com"
                  className={`w-full px-3.5 py-2.5 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-neutral-50/50 ${
                    formErrors.email ? 'border-red-400 bg-red-50/20' : 'border-neutral-300'
                  }`}
                />
                {formErrors.email && (
                  <span className="text-[11px] text-red-600 mt-1 block">{formErrors.email}</span>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Complete Street Address (House / Plot / Street / Area) *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House 14-B, Street 3, Block G, DHA Phase 5"
                  className={`w-full px-3.5 py-2.5 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-neutral-50/50 ${
                    formErrors.address ? 'border-red-400 bg-red-50/20' : 'border-neutral-300'
                  }`}
                />
                {formErrors.address && (
                  <span className="text-[11px] text-red-600 mt-1 block">{formErrors.address}</span>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  City *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white font-medium cursor-pointer"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.province}) — {c.deliveryDays}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Postal Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="e.g. 54000"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-neutral-50/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Order Notes / Special Instructions
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Please include gift ribbon, or call before dispatching..."
                  className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-neutral-50/50"
                />
              </div>
            </div>
          </div>

          {/* Payment Methods Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>2. Select Payment Method (Pakistan)</span>
              </h2>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
              </span>
            </div>

            <div className="space-y-3">
              {/* JazzCash */}
              <div
                onClick={() => setPaymentMethod('jazzcash')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'jazzcash'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      JC
                    </span>
                    <div>
                      <span className="text-xs font-bold block">JazzCash Mobile Account</span>
                      <span
                        className={`text-[11px] block ${
                          paymentMethod === 'jazzcash' ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      >
                        Pay securely using your JazzCash wallet with instant MPIN prompt
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'jazzcash' ? 'border-amber-400 bg-amber-400' : 'border-neutral-300'
                    }`}
                  >
                    {paymentMethod === 'jazzcash' && <span className="w-2 h-2 rounded-full bg-neutral-900" />}
                  </div>
                </div>

                {paymentMethod === 'jazzcash' && (
                  <div className="mt-3 pt-3 border-t border-neutral-800 space-y-2">
                    <label className="text-[11px] font-semibold text-neutral-200 block">
                      Enter JazzCash Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={jazzcashNumber}
                      onChange={(e) => setJazzcashNumber(e.target.value)}
                      placeholder="030X XXXXXXX"
                      className="w-full px-3 py-2 text-xs bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                    <p className="text-[10px] text-neutral-400">
                      An approval prompt will be sent to your phone or JazzCash app to approve PKR{' '}
                      {cartTotalPKR.toLocaleString()}. Merchant: {storeSettings.jazzcashMerchantNumber}.
                    </p>
                  </div>
                )}
              </div>

              {/* Easypaisa */}
              <div
                onClick={() => setPaymentMethod('easypaisa')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'easypaisa'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      EP
                    </span>
                    <div>
                      <span className="text-xs font-bold block">Easypaisa Wallet</span>
                      <span
                        className={`text-[11px] block ${
                          paymentMethod === 'easypaisa' ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      >
                        Pay securely using Easypaisa In-App Notification
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'easypaisa' ? 'border-amber-400 bg-amber-400' : 'border-neutral-300'
                    }`}
                  >
                    {paymentMethod === 'easypaisa' && <span className="w-2 h-2 rounded-full bg-neutral-900" />}
                  </div>
                </div>

                {paymentMethod === 'easypaisa' && (
                  <div className="mt-3 pt-3 border-t border-neutral-800 space-y-2">
                    <label className="text-[11px] font-semibold text-neutral-200 block">
                      Enter Easypaisa Registered Number
                    </label>
                    <input
                      type="tel"
                      value={easypaisaNumber}
                      onChange={(e) => setEasypaisaNumber(e.target.value)}
                      placeholder="03XX XXXXXXX"
                      className="w-full px-3 py-2 text-xs bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                    <p className="text-[10px] text-neutral-400">
                      You will receive an in-app push notification on your Easypaisa app to authorize payment.
                    </p>
                  </div>
                )}
              </div>

              {/* Cash on Delivery (COD) */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs flex items-center justify-center shadow-xs">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Cash on Delivery (COD)</span>
                      <span
                        className={`text-[11px] block ${
                          paymentMethod === 'cod' ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      >
                        Pay in cash directly to the TCS / Trax courier rider at your doorstep
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'cod' ? 'border-amber-400 bg-amber-400' : 'border-neutral-300'
                    }`}
                  >
                    {paymentMethod === 'cod' && <span className="w-2 h-2 rounded-full bg-neutral-900" />}
                  </div>
                </div>
              </div>

              {/* Debit/Credit Card */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Visa / Mastercard / PayPak</span>
                      <span
                        className={`text-[11px] block ${
                          paymentMethod === 'card' ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      >
                        All Pakistani & international bank credit / debit cards supported
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'card' ? 'border-amber-400 bg-amber-400' : 'border-neutral-300'
                    }`}
                  >
                    {paymentMethod === 'card' && <span className="w-2 h-2 rounded-full bg-neutral-900" />}
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-3 pt-3 border-t border-neutral-800 space-y-2">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number (4000 1234 5678 9010)"
                      maxLength={19}
                      className="w-full px-3 py-2 text-xs bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        maxLength={5}
                        className="px-3 py-2 text-xs bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none"
                      />
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVV / CVC"
                        maxLength={4}
                        className="px-3 py-2 text-xs bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Review & Confirmation Action (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Review Your Items ({cart.length})
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex items-center justify-between text-xs py-2 border-b border-neutral-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-14 rounded-md bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                      {item.itemType === 'custom' && item.customDesign?.uploadedImage ? (
                        <img
                          src={item.customDesign.uploadedImage}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-[8px] text-[#D4AF37] font-bold">
                          PK
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-neutral-900 block truncate">
                        {item.phoneModel.name}
                      </span>
                      <span className="text-[11px] text-neutral-500 block truncate">
                        {item.caseType.name} × {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-neutral-900 shrink-0">
                    PKR {item.totalPricePKR.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 pt-3 border-t border-neutral-200 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900 font-mono">
                  PKR {cartSubtotalPKR.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Express Delivery</span>
                <span className="font-semibold text-neutral-900 font-mono">
                  {cartShippingPKR === 0 ? 'FREE' : `PKR ${cartShippingPKR.toLocaleString()}`}
                </span>
              </div>
              {cartDiscountPKR > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span className="font-mono">- PKR {cartDiscountPKR.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-3 border-t border-neutral-200 flex items-baseline justify-between">
                <span className="text-sm font-bold text-neutral-900">Total Payable</span>
                <span className="text-2xl font-extrabold text-neutral-900 font-mono tracking-tight">
                  PKR {cartTotalPKR.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-4 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Verifying & Generating Order...' : 'Complete & Confirm Order'}</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-neutral-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Our 100% Fit Guarantee</span>
              </div>
              <p>
                If your phone case does not fit your {cart[0]?.phoneModel.name} perfectly or camera cutouts are misaligned, we will replace it free of charge.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
