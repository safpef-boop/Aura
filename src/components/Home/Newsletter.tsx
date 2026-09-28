import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-[#D4AF37] flex items-center justify-center mx-auto font-brand-display text-xl font-bold shadow-md">
          A
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-brand-display">
            Join The Aura Studio Circle
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto">
            Subscribe for exclusive preview drops of new flagship phone cases, seasonal Pakistani art releases, and receive 10% off your first custom order.
          </p>
        </div>

        {subscribed ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold max-w-md mx-auto flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Welcome to the circle! Use promo code LAUNCHPK at checkout for 10% off.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-neutral-50/50"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              Subscribe
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-400">
          <span>No Spam</span>
          <span>·</span>
          <span>Exclusive VIP Drops</span>
          <span>·</span>
          <span>Unsubscribe Anytime</span>
        </div>
      </div>
    </section>
  );
};
