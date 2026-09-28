import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Truck, RefreshCw, Phone, Mail, MapPin, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, storeSettings } = useApp();

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Pillars Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-neutral-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#D4AF37] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Model-Accurate Precision</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Hardware cutouts engineered to 0.1mm tolerances for iPhone 17, Samsung S26, Pixel & Pakistani best sellers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Nationwide Express Delivery</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                TCS & Trax priority couriers serving 150+ Pakistani cities with real-time SMS tracking updates.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#D4AF37] shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Zero-Yellowing & Print Guarantee</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                12-month replacement guarantee against peeling, fading, or edge yellowing under our studio warranty.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Main Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12 border-b border-neutral-800">
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-neutral-950 flex items-center justify-center font-brand-display font-bold text-lg">
                A
              </div>
              <span className="text-lg font-bold tracking-widest text-white font-brand-display">
                AURA CASE STUDIO
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Pakistan's dedicated studio for customized luxury smartphone cases. Combining German UV laser printing, aerospace composites, and model-accurate safe print engineering.
            </p>
            <div className="pt-2 text-xs text-neutral-400 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Studio: Sector Y, DHA Phase 3, Lahore, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>WhatsApp: {storeSettings.whatsappNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>concierge@auracase.pk</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Shop Covers</h5>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={() => setCurrentView('customize')} className="hover:text-white transition-colors cursor-pointer">
                  Custom Phone Covers
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('shop')} className="hover:text-white transition-colors cursor-pointer">
                  Ready-Made Luxury Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('shop')} className="hover:text-white transition-colors cursor-pointer">
                  MagSafe Cases
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('shop')} className="hover:text-white transition-colors cursor-pointer">
                  Islamic Calligraphy & Heritage
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('shop')} className="hover:text-white transition-colors cursor-pointer">
                  Best Sellers Pakistan
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Customer Care</h5>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={() => setCurrentView('tracking')} className="hover:text-white transition-colors cursor-pointer">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('account')} className="hover:text-white transition-colors cursor-pointer">
                  Saved Custom Designs
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-white transition-colors cursor-pointer">
                  Shipping Rates & Times
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-white transition-colors cursor-pointer">
                  1-Year Replacement Warranty
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin')} className="hover:text-white transition-colors cursor-pointer">
                  Store Administration
                </button>
              </li>
            </ul>
          </div>

          {/* Pakistani Payment Methods */}
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Payment Methods</h5>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              100% verified Pakistani payment gateways:
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="font-semibold">JazzCash</span>
                <span className="text-[10px] text-neutral-500">(Mobile Account & Voucher)</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold">Easypaisa</span>
                <span className="text-[10px] text-neutral-500">(Direct In-App Wallet)</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-semibold">Cash on Delivery (COD)</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="font-semibold">Visa / Mastercard / PayPak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 Aura Case Studio Pakistan. Precision custom smartphone cases crafted in Lahore.</p>
          <div className="flex items-center gap-4">
            <span>Karachi</span>
            <span>·</span>
            <span>Lahore</span>
            <span>·</span>
            <span>Islamabad</span>
            <span>·</span>
            <span>Peshawar</span>
            <span>·</span>
            <span>Quetta</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
