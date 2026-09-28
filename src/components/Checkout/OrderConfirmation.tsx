import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Printer,
  Truck,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Sparkles,
} from 'lucide-react';

export const OrderConfirmation: React.FC = () => {
  const { lastPlacedOrder, setCurrentView } = useApp();

  if (!lastPlacedOrder) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <p className="text-sm text-neutral-600">No recent order found.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
        >
          Return to Studio Home
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const paymentMethodLabel = {
    jazzcash: 'JazzCash Mobile Account',
    easypaisa: 'Easypaisa Wallet',
    cod: 'Cash on Delivery (Pay to courier rider)',
    card: 'Credit / Debit Card (Verified)',
  }[lastPlacedOrder.paymentMethod];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Congratulatory Header */}
      <div className="text-center space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#996515]">
            Atelier Order Confirmed 🎉
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-brand-display">
            Thank You, {lastPlacedOrder.customer.fullName}!
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
            Your customized smartphone cover has entered our precision manufacturing queue in Lahore.
          </p>
        </div>

        {/* Order Meta Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-neutral-600 border-t border-neutral-100">
          <div>
            <span className="text-neutral-400 block">Order Number:</span>
            <span className="font-mono font-bold text-neutral-900 text-sm">
              {lastPlacedOrder.orderNumber}
            </span>
          </div>

          <div>
            <span className="text-neutral-400 block">Estimated Arrival:</span>
            <span className="font-semibold text-neutral-900">
              {lastPlacedOrder.estimatedDeliveryDate}
            </span>
          </div>

          <div>
            <span className="text-neutral-400 block">Express Courier:</span>
            <span className="font-semibold text-neutral-900">
              {lastPlacedOrder.courierName}
            </span>
          </div>

          <div>
            <span className="text-neutral-400 block">Payment Method:</span>
            <span className="font-semibold text-neutral-900">
              {paymentMethodLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Invoice & Order Summary Details */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Order Receipt & Production Specs
            </h2>
            <p className="text-xs text-neutral-500">
              Placed on {new Date(lastPlacedOrder.createdAt).toLocaleDateString('en-PK', { dateStyle: 'long' })}
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {lastPlacedOrder.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF9F6] border border-neutral-200/80 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-16 rounded-lg bg-neutral-200 overflow-hidden shrink-0 border border-neutral-300">
                  {item.customDesign?.uploadedImage ? (
                    <img
                      src={item.customDesign.uploadedImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-[9px] text-[#D4AF37] font-bold">
                      PK
                    </div>
                  )}
                </div>

                <div className="min-w-0 space-y-0.5">
                  <span className="font-bold text-neutral-900 block truncate">
                    {item.phoneModel.brand} {item.phoneModel.name}
                  </span>
                  <span className="text-neutral-600 block">
                    Finish: <span className="font-semibold">{item.caseType.name}</span>
                  </span>
                  {item.itemType === 'custom' && (
                    <span className="text-[10px] text-amber-800 font-medium block">
                      Custom Inscription: "{item.customDesign?.textLayers[0]?.text || 'Bespoke Artwork'}"
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-neutral-900 block">
                  PKR {item.totalPricePKR.toLocaleString()}
                </span>
                <span className="text-[10px] text-neutral-400">Qty: {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Address & Totals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-200 text-xs">
          <div>
            <span className="font-bold text-neutral-900 uppercase tracking-wider block mb-1">
              Delivery Address:
            </span>
            <div className="text-neutral-600 space-y-0.5">
              <p className="font-medium text-neutral-900">{lastPlacedOrder.customer.fullName}</p>
              <p>{lastPlacedOrder.customer.address}</p>
              <p>
                {lastPlacedOrder.customer.city}, {lastPlacedOrder.customer.province}{' '}
                {lastPlacedOrder.customer.postalCode}
              </p>
              <p className="text-neutral-500 pt-1">Phone: {lastPlacedOrder.customer.phone}</p>
            </div>
          </div>

          <div className="space-y-1.5 sm:text-right">
            <div className="flex justify-between sm:justify-end gap-6 text-neutral-600">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold text-neutral-900">
                PKR {lastPlacedOrder.subtotalPKR.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between sm:justify-end gap-6 text-neutral-600">
              <span>Shipping (Nationwide Express):</span>
              <span className="font-mono font-semibold text-neutral-900">
                {lastPlacedOrder.shippingPKR === 0 ? 'FREE' : `PKR ${lastPlacedOrder.shippingPKR.toLocaleString()}`}
              </span>
            </div>
            {lastPlacedOrder.discountPKR > 0 && (
              <div className="flex justify-between sm:justify-end gap-6 text-emerald-700 font-semibold">
                <span>Discount Applied:</span>
                <span className="font-mono">- PKR {lastPlacedOrder.discountPKR.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-2 border-t border-neutral-200 flex justify-between sm:justify-end gap-6 text-base font-extrabold text-neutral-900">
              <span>Grand Total:</span>
              <span className="font-mono">PKR {lastPlacedOrder.totalPKR.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-neutral-200">
          <button
            onClick={() => setCurrentView('tracking')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Truck className="w-4 h-4 text-amber-400" />
            <span>Track Order Timeline</span>
          </button>

          <button
            onClick={() => setCurrentView('home')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-neutral-300 text-neutral-800 hover:bg-neutral-50 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
