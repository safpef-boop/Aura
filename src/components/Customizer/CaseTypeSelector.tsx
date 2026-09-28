import React from 'react';
import { CaseType, PhoneModel } from '../../types';
import { Check, ShieldCheck, Sparkles, Zap, Award } from 'lucide-react';

interface CaseTypeSelectorProps {
  caseTypes: CaseType[];
  selectedCaseType: CaseType;
  onSelectCaseType: (caseType: CaseType) => void;
  phoneModel: PhoneModel;
}

export const CaseTypeSelector: React.FC<CaseTypeSelectorProps> = ({
  caseTypes,
  selectedCaseType,
  onSelectCaseType,
  phoneModel,
}) => {
  const calculatePrice = (c: CaseType) => {
    const raw = c.basePricePKR * phoneModel.basePriceMultiplier;
    return Math.round(raw / 50) * 50; // rounded cleanly to 50 PKR increments
  };

  const getBadgeIcon = (badge?: string) => {
    if (badge === 'Popular') return <Sparkles className="w-3 h-3 text-amber-500" />;
    if (badge === 'Best Seller') return <Zap className="w-3 h-3 text-amber-500" />;
    if (badge === 'Max Protection') return <ShieldCheck className="w-3 h-3 text-blue-500" />;
    if (badge === 'Luxury' || badge === 'Atelier') return <Award className="w-3 h-3 text-[#D4AF37]" />;
    return null;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
          Select Case Material & Finish
        </label>
        <span className="text-xs text-neutral-500">7 Premium Options</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {caseTypes.map((c) => {
          const isSelected = selectedCaseType.id === c.id;
          const price = calculatePrice(c);

          return (
            <div
              key={c.id}
              onClick={() => onSelectCaseType(c)}
              className={`relative text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-neutral-900 bg-neutral-900 text-white shadow-md ring-2 ring-neutral-900/10'
                  : 'border-neutral-200 hover:border-neutral-400 bg-white text-neutral-900 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold leading-tight">{c.name}</span>
                    {c.badge && (
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                          isSelected
                            ? 'bg-neutral-800 text-amber-300'
                            : 'bg-amber-50 text-amber-900 border border-amber-200/60'
                        }`}
                      >
                        {getBadgeIcon(c.badge)}
                        <span>{c.badge}</span>
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-amber-400 bg-amber-400 text-neutral-950' : 'border-neutral-300'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>

                <p
                  className={`text-[11px] leading-relaxed line-clamp-2 mb-2 ${
                    isSelected ? 'text-neutral-300' : 'text-neutral-500'
                  }`}
                >
                  {c.tagline}
                </p>

                {/* Features list */}
                <div className="space-y-1 mb-2.5">
                  {c.features.slice(0, 2).map((feat, idx) => (
                    <div
                      key={idx}
                      className={`text-[10px] flex items-center gap-1.5 truncate ${
                        isSelected ? 'text-neutral-300' : 'text-neutral-600'
                      }`}
                    >
                      <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-neutral-400'}`} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Price in PKR */}
              <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
                <span className={`text-[11px] ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Customized Price:
                </span>
                <span
                  className={`text-sm font-bold font-mono tracking-tight ${
                    isSelected ? 'text-amber-300' : 'text-neutral-900'
                  }`}
                >
                  PKR {price.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
