import React from 'react';
import { useApp } from '../../context/AppContext';
import { Smartphone, Upload, Sliders, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { setCurrentView } = useApp();

  const steps = [
    {
      step: '01',
      title: 'Choose Your Phone',
      description: 'Select your exact brand and model. Our CAD engine loads the millimeter-accurate camera cutout and safe print margin.',
      icon: Smartphone,
    },
    {
      step: '02',
      title: 'Upload Your Design',
      description: 'Upload personal photographs, memories, family portraits, or choose from our curated aesthetic Pakistani textures.',
      icon: Upload,
    },
    {
      step: '03',
      title: 'Customize & Preview',
      description: 'Adjust crop, zoom, rotation, filters, and add your name in 24K gold foil or bespoke typography with live 3D preview.',
      icon: Sliders,
    },
    {
      step: '04',
      title: 'Order & Enjoy',
      description: 'Pay via JazzCash, Easypaisa, Card, or Cash on Delivery. Hand-printed on German UV laser equipment and dispatched via TCS/Trax.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-16 bg-[#FAF9F6] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Precision Bespoke Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-brand-display">
            How Customization Works
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            From initial photo upload to doorstep delivery anywhere in Pakistan within 2 to 4 business days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between group hover:border-neutral-900 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-brand-display text-2xl font-bold text-neutral-300 group-hover:text-amber-800 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center text-neutral-800 transition-colors shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Step {index + 1} of 4</span>
                  <span className="text-neutral-900 font-semibold group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setCurrentView('customize')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <span>Start Designing Your Case</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>
      </div>
    </section>
  );
};
