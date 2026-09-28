import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trash2,
  Edit3,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  CheckCircle2,
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotalPKR,
    cartShippingPKR,
    cartDiscountPKR,
    cartTotalPKR,
    appliedCoupon,
    applyCoupon,
    setCurrentView,
    loadSavedDesign,
    storeSettings,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const success = applyCoupon(couponInput);
    if (!success) {
      setCouponError(true);
      setTimeout(() => setCouponError(false), 3000);
    } else {
      setCouponInput('');
    }
  };

  const amountNeededForFreeShipping = Math.max(
    0,
    storeSettings.freeShippingThresholdPKR - cartSubtotalPKR
  );
  const freeShippingProgress = Math.min(
    100,
    (cartSubtotalPKR / storeSettings.freeShippingThresholdPKR) * 100
  );

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 font-brand-display">
          Your cart is waiting for something awesome.
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
          Start designing your personalized cover with model-accurate cutouts or browse our ready-made luxury catalog.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setCurrentView('customize')}
            className="px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
          >
            Create A Custom Cover
          </button>
          <button
            onClick={() => setCurrentView('shop')}
            className="px-6 py-3 rounded-xl border border-neutral-300 text-neutral-800 hover:bg-neutral-50 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Browse Ready-Made Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-brand-display">
          Shopping Cart
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Review your personalized smartphone covers before proceeding to checkout.
        </p>
      </div>

      {/* Free Shipping Progress bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-neutral-800">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>
              {amountNeededForFreeShipping === 0
                ? '🎉 Congratulations! You have earned FREE Nationwide Express Delivery!'
                : `Add PKR ${amountNeededForFreeShipping.toLocaleString()} more to unlock FREE Nationwide Express Shipping!`}
            </span>
          </div>
          <span className="text-neutral-500">{Math.round(freeShippingProgress)}%</span>
        </div>
        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            style={{ width: `${freeShippingProgress}%` }}
            className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const isCustom = item.itemType === 'custom';
            const name = isCustom
              ? `${item.phoneModel.name} Bespoke Cover`
              : item.product?.name || 'Ready-Made Case';

            return (
              <div
                key={item.cartItemId}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Thumbnail Preview */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-20 h-28 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200 flex items-center justify-center">
                    {isCustom && item.customDesign?.uploadedImage ? (
                      <img
                        src={item.customDesign.uploadedImage}
                        alt="Custom cover art"
                        className="w-full h-full object-cover"
                      />
                    ) : isCustom ? (
                      <div
                        style={{
                          backgroundColor: item.customDesign?.backgroundColor || '#0F172A',
                          backgroundImage: item.customDesign?.backgroundPattern || undefined,
                        }}
                        className="w-full h-full flex flex-col items-center justify-center p-1 text-center"
                      >
                        <span className="text-[9px] font-bold text-[#D4AF37] font-mono tracking-widest">
                          {item.customDesign?.textLayers[0]?.text || 'AURA'}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={item.product?.images[0]}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Camera Cutout Mini Indicator */}
                    <div className="absolute top-1 left-1 bg-black/60 text-white text-[8px] px-1 rounded">
                      {item.phoneModel.brand}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      {item.phoneModel.brand} · {item.phoneModel.name}
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900 truncate">{name}</h3>
                    <p className="text-xs text-neutral-600">
                      Finish: <span className="font-semibold text-neutral-800">{item.caseType.name}</span>
                    </p>

                    {isCustom && (
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-amber-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Custom Design Attached ✓</span>
                        {item.customDesign && (
                          <button
                            onClick={() => loadSavedDesign(item.customDesign!)}
                            className="text-neutral-900 underline hover:text-amber-800 ml-1 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price & Quantity & Remove */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100 gap-3">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-neutral-900 font-mono">
                      PKR {item.totalPricePKR.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-neutral-400 block">
                      PKR {item.unitPricePKR.toLocaleString()} each
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 text-xs">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                        className="px-2.5 py-1 font-bold hover:bg-neutral-200 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-1 font-bold font-mono">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                        className="px-2.5 py-1 font-bold hover:bg-neutral-200 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Checkout Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Order Summary
            </h2>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <label className="text-[11px] font-semibold text-neutral-700">Promo or Coupon Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="e.g. LAUNCHPK, AURA10"
                  className="flex-1 px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 uppercase font-mono bg-neutral-50"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <span className="text-[11px] text-red-600 block">
                  Invalid coupon. Try using code LAUNCHPK or AURA10.
                </span>
              )}
              {appliedCoupon && (
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  ✓ Coupon "{appliedCoupon}" applied!
                </span>
              )}
            </form>

            {/* Breakdown */}
            <div className="space-y-2.5 pt-3 border-t border-neutral-100 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900 font-mono">
                  PKR {cartSubtotalPKR.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span className="font-semibold text-neutral-900 font-mono">
                  {cartShippingPKR === 0 ? 'FREE' : `PKR ${cartShippingPKR.toLocaleString()}`}
                </span>
              </div>

              {cartDiscountPKR > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({appliedCoupon})</span>
                  <span className="font-mono">- PKR {cartDiscountPKR.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-3 border-t border-neutral-200 flex items-baseline justify-between">
                <span className="text-sm font-bold text-neutral-900">Total (PKR)</span>
                <span className="text-2xl font-extrabold text-neutral-900 font-mono tracking-tight">
                  PKR {cartTotalPKR.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => setCurrentView('checkout')}
              className="w-full py-4 px-4 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>

            {/* Pakistani Trust badges */}
            <div className="pt-2 text-[11px] text-neutral-500 space-y-1 text-center">
              <p>✓ JazzCash, Easypaisa, COD, & Credit Cards Accepted</p>
              <p>✓ 100% Exact Hardware Cutouts or Full Money Back</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
