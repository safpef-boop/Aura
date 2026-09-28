import React from 'react';
import { CUSTOMER_REVIEWS } from '../../data/mockData';
import { Star, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CustomerCreations: React.FC = () => {
  return (
    <section className="py-16 bg-[#FAF9F6] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Real Pakistani Customer Spotlights
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-brand-display">
            See What Our Customers Created
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Read authentic reviews and view customer-customized smartphone covers delivered across Lahore, Karachi, Islamabad, and beyond.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CUSTOMER_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-neutral-900 transition-all space-y-4"
            >
              <div>
                {/* Image showcase if present */}
                {review.userImage && (
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-4 bg-neutral-100 border border-neutral-100">
                    <img
                      src={review.userImage}
                      alt={`${review.author}'s custom case`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                      {review.phoneModel}
                    </div>
                  </div>
                )}

                {/* Stars and verified buyer */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified Buyer</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-neutral-900 mb-1 leading-snug">
                  "{review.title}"
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {review.comment}
                </p>
              </div>

              {/* Author & Model Details */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-neutral-900 block">{review.author}</span>
                  <span className="text-[11px] text-neutral-500 block">{review.city}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-medium text-neutral-800 block">
                    {review.caseType}
                  </span>
                  <span className="text-[10px] text-neutral-400 block">{review.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
