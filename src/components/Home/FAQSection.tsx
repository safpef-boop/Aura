import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Will the camera cutout match my exact phone model?',
      a: 'Yes, 100%. We do NOT use generic one-size-fits-all cases. Each phone model (such as iPhone 17 Pro Max, Samsung Galaxy S26 Ultra, Pixel 10, or Infinix GT 20 Pro) has its own bespoke mold and precision CNC cutout. You can see the exact camera island dimensions in our live preview before ordering.',
    },
    {
      q: 'How does payment work with JazzCash, Easypaisa, or Cash on Delivery?',
      a: 'We offer multiple convenient Pakistani payment options. You can pay securely using your JazzCash Mobile Account or Easypaisa in-app wallet. We also proudly offer nationwide Cash on Delivery (COD) so you can pay directly to the TCS or Trax delivery rider when your package arrives at your doorstep.',
    },
    {
      q: 'How long does delivery take across Pakistan?',
      a: 'Once your custom design is approved, production takes 24 hours in our Lahore atelier. Transit times via express courier: Lahore (1-2 days), Karachi & Islamabad (2-3 days), Faisalabad, Multan & Peshawar (2-4 days), Quetta & other cities (3-5 days). All shipments come with SMS tracking numbers.',
    },
    {
      q: 'Will the custom print fade, peel, or turn yellow?',
      a: 'No. We use German industrial UV laser curing where the ink bonds molecularly with the polycarbonate composite. Our cases come with a 1-Year Zero-Fade Guarantee. Our clear and frosted cases also include anti-UV additives to resist yellowing.',
    },
    {
      q: 'What kind of photo should I upload for best results?',
      a: 'Any high-resolution photo from your phone gallery or camera in JPG, PNG, or WEBP format. Our customizer includes an instant quality checker that tells you if your image resolution is "Excellent (300+ DPI)" for razor-sharp clarity. You can also use our CoverAI designer to enhance your composition.',
    },
    {
      q: 'Can I save my custom design and finish it later?',
      a: 'Yes! Simply click "Save Unfinished Design" inside the Customizer. Your design state, photo transforms, and custom text will be saved to your Account under "Saved Designs" so you can continue designing on any device.',
    },
  ];

  return (
    <section className="py-16 bg-[#FAF9F6] border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-brand-display">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Everything you need to know about custom phone cases, materials, and Pakistani shipping.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-neutral-200/90 overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform shrink-0 ${
                      isOpen ? 'rotate-180 text-neutral-900' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 border-t border-neutral-100 text-xs text-neutral-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
