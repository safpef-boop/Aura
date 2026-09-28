import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  ShieldCheck,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const STAGES = [
  { id: 'order_placed', label: 'Order Placed', desc: 'Received & logged in atelier queue' },
  { id: 'payment_confirmed', label: 'Payment Confirmed', desc: 'JazzCash / Easypaisa / COD verified' },
  { id: 'design_approved', label: 'Design Approved', desc: 'Camera cutout & safe margins verified' },
  { id: 'in_production', label: 'In Production', desc: '2400 DPI UV laser print applied' },
  { id: 'quality_check', label: 'Quality Check', desc: 'Scratch inspection & chamfer bevel check' },
  { id: 'shipped', label: 'Dispatched via Courier', desc: 'Handed to TCS / Trax express rider' },
  { id: 'delivered', label: 'Delivered', desc: 'Received at customer address' },
];

export const OrderTracker: React.FC = () => {
  const { orders, lastPlacedOrder } = useApp();

  const [orderQuery, setOrderQuery] = useState(
    lastPlacedOrder?.orderNumber || orders[0]?.orderNumber || 'PK-93821'
  );
  const [phoneQuery, setPhoneQuery] = useState(
    lastPlacedOrder?.customer.phone || orders[0]?.customer.phone || '03001234567'
  );
  const [searchedOrder, setSearchedOrder] = useState<any>(lastPlacedOrder || orders[0] || null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanOrder = orderQuery.trim().toUpperCase();
    const cleanPhone = phoneQuery.trim();

    const found = orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === cleanOrder ||
        (cleanPhone && o.customer.phone.replace(/[^0-9]/g, '').includes(cleanPhone.replace(/[^0-9]/g, '')))
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      setErrorMsg('No order found matching that Order Number and Phone. Please verify your details.');
    }
  };

  const getStageIndex = (status: string) => {
    const idx = STAGES.findIndex((s) => s.id === status);
    return idx >= 0 ? idx : 3; // default in_production
  };

  const currentStageIndex = searchedOrder ? getStageIndex(searchedOrder.orderStatus) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Tracker Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
          Live Dispatch Logistics
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-brand-display">
          Track Your Custom Order
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
          Follow your customized phone case through our 7-stage manufacturing and TCS/Trax delivery timeline.
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-xs">
        <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5">
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
              Order Number *
            </label>
            <input
              type="text"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="e.g. PK-93821"
              required
              className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono uppercase bg-neutral-50/50"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
              Mobile Number *
            </label>
            <input
              type="tel"
              value={phoneQuery}
              onChange={(e) => setPhoneQuery(e.target.value)}
              placeholder="0300 1234567"
              className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-neutral-50/50"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Now</span>
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Searched Order Details & Timeline */}
      {searchedOrder && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-8 animate-in fade-in">
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400 block">
                Tracking Number
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base sm:text-lg font-extrabold font-mono text-neutral-900">
                  {searchedOrder.trackingNumber}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Active Dispatch
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Handled by {searchedOrder.courierName} · Est. Arrival: {searchedOrder.estimatedDeliveryDate}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Destination
              </span>
              <span className="text-xs font-bold text-neutral-900 block">
                {searchedOrder.customer.city}, Pakistan
              </span>
              <span className="text-[11px] text-neutral-500 block truncate max-w-xs">
                {searchedOrder.customer.address}
              </span>
            </div>
          </div>

          {/* 7-Step Vertical/Horizontal Visual Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Manufacturing & Delivery Timeline
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
              {STAGES.map((stage, idx) => {
                const isCompleted = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={stage.id} className="relative flex items-start gap-4">
                    {/* Node */}
                    <div
                      className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isCurrent
                          ? 'bg-neutral-900 text-amber-300 ring-4 ring-amber-100 shadow-xs'
                          : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                    </div>

                    {/* Content */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold ${
                            isCurrent ? 'text-neutral-900 text-sm' : isCompleted ? 'text-neutral-900' : 'text-neutral-400'
                          }`}
                        >
                          {stage.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold bg-neutral-900 text-amber-300 px-2 py-0.5 rounded-full">
                            Current Stage
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items In Shipment */}
          <div className="pt-6 border-t border-neutral-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Package Contents ({searchedOrder.items.length} Custom Cover)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {searchedOrder.items.map((it: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center gap-3 text-xs">
                  <div className="w-10 h-14 rounded-lg bg-neutral-200 overflow-hidden shrink-0 border border-neutral-300">
                    {it.customDesign?.uploadedImage ? (
                      <img src={it.customDesign.uploadedImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-[9px] text-[#D4AF37] font-bold">
                        PK
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">{it.phoneModel.name}</span>
                    <span className="text-neutral-500 text-[11px] block">{it.caseType.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
