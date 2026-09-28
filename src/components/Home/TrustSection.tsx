import React from 'react';
import { ShieldCheck, Crosshair, Sparkles, CreditCard, Truck, Headphones } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const pillars = [
    {
      title: 'Premium Print Quality',
      description: '2400 DPI ultra-high-definition German UV laser curing. Crisp color fidelity that resists peeling, scratches, and pocket friction.',
      icon: Sparkles,
    },
    {
      title: 'Model-Accurate Cutouts',
      description: 'Zero generic templates. Individual hardware tooling matching exact camera plateau dimensions, buttons, and mic cutouts.',
      icon: Crosshair,
    },
    {
      title: 'Custom Designs with Safe Zones',
      description: 'Our live customizer visually marks safe print zones so your photo composition never collides with camera lenses.',
      icon: ShieldCheck,
    },
    {
      title: 'Secure Pakistani Payments',
      description: 'Integrated with JazzCash, Easypaisa, Cash on Delivery, and direct 3D-secure Card processing for total peace of mind.',
      icon: CreditCard,
    },
    {
      title: 'Nationwide Delivery',
      description: 'Direct courier partnerships with TCS & Trax delivering safely across 150+ Pakistani cities with SMS tracking.',
      icon: Truck,
    },
    {
      title: 'Concierge Customer Support',
      description: 'Direct WhatsApp support with real specialists in Lahore to answer questions, guide your artwork, and assist in Urdu & English.',
      icon: Headphones,
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Unrivaled Craftsmanship
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-brand-display">
            Why Customers Choose Us
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            The standard of excellence behind every customized smartphone case engineered at Aura Case Studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-neutral-200/90 bg-[#FAF9F6] flex flex-col justify-between hover:border-neutral-900 hover:bg-white transition-all shadow-2xs"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 text-[#D4AF37] flex items-center justify-center mb-4 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 mb-2">{pillar.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
