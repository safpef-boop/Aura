import React, { useState } from 'react';
import { PhoneModel } from '../../types';
import { Search, Smartphone, Check, ChevronRight } from 'lucide-react';

interface PhoneSelectorProps {
  phoneModels: PhoneModel[];
  selectedPhoneModel: PhoneModel;
  onSelectPhoneModel: (model: PhoneModel) => void;
}

export const PhoneSelector: React.FC<PhoneSelectorProps> = ({
  phoneModels,
  selectedPhoneModel,
  onSelectPhoneModel,
}) => {
  const [activeBrand, setActiveBrand] = useState<string>(selectedPhoneModel.brand);
  const [filterQuery, setFilterQuery] = useState('');

  // Extract unique brands
  const brands = Array.from(new Set(phoneModels.map((m) => m.brand)));

  // Filter models
  const filteredModels = phoneModels.filter((m) => {
    const matchesBrand = activeBrand === 'All' || m.brand === activeBrand;
    const matchesSearch =
      filterQuery.trim() === '' ||
      m.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      m.brand.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
          Select Your Exact Phone Model
        </label>
        <span className="text-xs text-neutral-500">{phoneModels.length} Models Supported</span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Search e.g. iPhone 17 Pro, Galaxy S26 Ultra, Pixel 10..."
          className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
        />
        {filterQuery && (
          <button
            onClick={() => setFilterQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
          >
            Clear
          </button>
        )}
      </div>

      {/* Brand Horizontal Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveBrand('All')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
            activeBrand === 'All'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400'
          }`}
        >
          All Brands
        </button>
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => setActiveBrand(brand)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
              activeBrand === brand
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400'
            }`}
          >
            {brand}
          </button>
        ))}
      </div>

      {/* Phone Model Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1">
        {filteredModels.map((m) => {
          const isSelected = selectedPhoneModel.id === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectPhoneModel(m)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm ring-1 ring-neutral-900'
                  : 'border-neutral-200 hover:border-neutral-400 bg-white text-neutral-800'
              }`}
            >
              <div className="flex items-start justify-between gap-1 mb-1">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider block ${
                    isSelected ? 'text-amber-400' : 'text-neutral-500'
                  }`}
                >
                  {m.brand}
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />}
              </div>

              <span className="text-xs font-bold leading-snug line-clamp-1">{m.name}</span>

              <div className="mt-2 pt-1 border-t border-current/10 flex items-center justify-between text-[10px] opacity-75">
                <span>{m.cameraCutout.shape.replace('-', ' ')}</span>
                {m.isPopular && <span className="font-semibold text-amber-500">Popular</span>}
              </div>
            </button>
          );
        })}

        {filteredModels.length === 0 && (
          <div className="col-span-full py-8 text-center text-neutral-500 text-xs bg-white rounded-xl border border-dashed border-neutral-200">
            <Smartphone className="w-6 h-6 mx-auto mb-2 text-neutral-400" />
            <p>No phone model found matching "{filterQuery}"</p>
            <p className="text-[11px] text-neutral-400 mt-1">
              Contact our WhatsApp support to request custom tooling for your phone.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
