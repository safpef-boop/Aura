import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, Camera, CheckCircle2, Star } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setCurrentView, setSelectedPhoneModel, phoneModels } = useApp();

  const handleStartCustomizing = () => {
    // default to iPhone 17 Pro Max or top model
    setSelectedPhoneModel(phoneModels[0]);
    setCurrentView('customize');
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-white via-[#FCFCFC] to-[#FAF9F6]">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-amber-100/30 via-stone-100/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Studio Open for iPhone 17 & Galaxy S26 Series</span>
              <span className="text-stone-400">·</span>
              <span className="text-[#996515] font-bold">2400 DPI UV Print</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 font-brand-display leading-[1.1]">
                Your Phone.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-800 to-amber-800">
                  Your Style.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-neutral-600 font-serif-luxury italic max-w-xl mx-auto lg:mx-0">
                "Create a phone cover that is uniquely yours."
              </p>
            </div>

            <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Design bespoke smartphone cases tailored to your exact phone dimensions. With model-accurate camera cutouts, safe print boundaries, live 3D preview, and nationwide delivery across Pakistan.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={handleStartCustomizing}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Create Your Custom Cover</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#D4AF37]" />
              </button>

              <button
                onClick={() => setCurrentView('shop')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl border border-neutral-300 text-neutral-900 hover:bg-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>Shop Ready-Made Covers</span>
              </button>
            </div>

            {/* Micro Trust Proof */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-neutral-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Model-Accurate Cutouts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>JazzCash & Easypaisa COD</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-neutral-800">4.9/5</span>
                <span>(1,200+ Reviews in Pakistan)</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column (Interactive High-End Mockup Display with Floating Badges) */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Ambient Shadow glow */}
            <div className="absolute inset-0 bg-amber-400/10 rounded-full blur-2xl -z-10" />

            {/* Central Phone Mockup Card */}
            <div className="relative w-[280px] sm:w-[300px] h-[540px] rounded-[36px] bg-neutral-950 p-2 shadow-2xl border-4 border-neutral-800 flex flex-col justify-between overflow-hidden group">
              {/* Camera Island Mockup (iPhone 17 Pro style) */}
              <div className="absolute top-6 left-6 w-28 h-28 rounded-2xl bg-neutral-900/90 border border-neutral-700/80 z-20 flex flex-col justify-between p-2 shadow-inner">
                <div className="flex justify-between">
                  <div className="w-7 h-7 rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center shadow-xs">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-900 to-cyan-900" />
                  </div>
                  <div className="w-3 h-3 rounded-full bg-amber-200 border border-amber-300" />
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-7 h-7 rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center shadow-xs">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-900 to-cyan-900" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center shadow-xs">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-900 to-cyan-900" />
                  </div>
                </div>
              </div>

              {/* Artwork on the case */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
                  alt="Customized luxury emerald and gold smartphone case"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Gold Monogram Overlay */}
              <div className="relative z-10 p-6 flex flex-col items-center justify-end h-full text-center">
                <span className="text-[#D4AF37] font-brand-display text-2xl font-bold tracking-widest drop-shadow-md">
                  AURA • 2026
                </span>
                <span className="text-white/80 text-[10px] tracking-widest uppercase mt-1 font-sans">
                  iPhone 17 Pro Max · 24K Gold Trim
                </span>
              </div>
            </div>

            {/* Floating Process Badges surrounding the product */}
            {/* 1. Choose Your Phone */}
            <div className="absolute -top-3 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-neutral-200/80 flex items-center gap-2 animate-bounce [animation-duration:3s]">
              <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                01
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block leading-tight">Step One</span>
                <span className="text-xs font-bold text-neutral-900 block">Choose Phone</span>
              </div>
            </div>

            {/* 2. Upload Your Photo */}
            <div className="absolute top-28 -right-4 sm:-right-8 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-neutral-200/80 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center text-xs font-bold">
                02
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block leading-tight">Step Two</span>
                <span className="text-xs font-bold text-neutral-900 block">Upload Photo</span>
              </div>
            </div>

            {/* 3. Customize & Preview */}
            <div className="absolute bottom-28 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-neutral-200/80 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-neutral-900 text-amber-300 flex items-center justify-center text-xs font-bold">
                03
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block leading-tight">Step Three</span>
                <span className="text-xs font-bold text-neutral-900 block">Live Preview</span>
              </div>
            </div>

            {/* 4. Order (COD / JazzCash) */}
            <div className="absolute -bottom-3 right-0 sm:right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-neutral-200/80 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                04
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block leading-tight">Fast Dispatch</span>
                <span className="text-xs font-bold text-neutral-900 block">Order & COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
