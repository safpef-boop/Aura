import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ChevronRight, Smartphone, Sparkles } from 'lucide-react';

const BRAND_LIST = [
  { name: 'Apple', icon: '', models: 'iPhone 17, 16, 15, 14 Series' },
  { name: 'Samsung', icon: 'S', models: 'Galaxy S26, S25, S24 Ultra, A55' },
  { name: 'Google', icon: 'G', models: 'Pixel 10 Pro, 9 Pro, 8' },
  { name: 'OnePlus', icon: '1+', models: 'OnePlus 13, 12, 11' },
  { name: 'Xiaomi', icon: 'MI', models: 'Xiaomi 15 Pro, 14 Ultra' },
  { name: 'Redmi', icon: 'R', models: 'Note 14 Pro+, Note 13' },
  { name: 'Vivo', icon: 'V', models: 'X100 Pro, V30 Pro, Y200' },
  { name: 'Oppo', icon: 'O', models: 'Find X7 Ultra, Reno 12' },
  { name: 'Infinix', icon: '∞', models: 'GT 20 Pro, Zero 30' },
  { name: 'Tecno', icon: 'T', models: 'Camon 30 Premier, Spark' },
  { name: 'Realme', icon: 'R', models: 'GT 6, 12 Pro+' },
];

export const QuickPhoneSearch: React.FC = () => {
  const { phoneModels, setSelectedPhoneModel, setCurrentView } = useApp();
  const [query, setQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // Filtered phone results
  const results = phoneModels.filter((m) => {
    const matchesBrand = !selectedBrand || m.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesSearch =
      query.trim() === '' ||
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.brand.toLowerCase().includes(query.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  const handleSelectModel = (model: (typeof phoneModels)[0]) => {
    setSelectedPhoneModel(model);
    setCurrentView('customize');
  };

  return (
    <section className="py-12 bg-white border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Exact Hardware Templates</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-brand-display">
            Find Your Phone
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Choose your device to load exact camera cutout positions, bezel depths, and safe print zones.
          </p>
        </div>

        {/* Large Search Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your phone model (e.g. iPhone 17 Pro Max, Galaxy S26 Ultra, Pixel 10)..."
              className="w-full pl-12 pr-4 py-3.5 text-sm sm:text-base border-2 border-neutral-200 hover:border-neutral-300 focus:border-neutral-900 rounded-2xl focus:outline-none shadow-xs bg-neutral-50/50 focus:bg-white transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 font-medium"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs text-neutral-500">
            <span className="font-medium text-neutral-400">Popular Searches:</span>
            {['iPhone 17 Pro Max', 'Samsung S26 Ultra', 'Pixel 10 Pro', 'Infinix GT 20 Pro'].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="hover:text-neutral-900 underline cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Selector Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
              Choose Brand
            </h3>
            {selectedBrand && (
              <button
                onClick={() => setSelectedBrand(null)}
                className="text-xs text-amber-800 font-medium hover:underline cursor-pointer"
              >
                Show All Brands
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {BRAND_LIST.map((brand) => {
              const isSelected = selectedBrand === brand.name;
              return (
                <button
                  key={brand.name}
                  onClick={() => setSelectedBrand(isSelected ? null : brand.name)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                      : 'border-neutral-200 hover:border-neutral-400 bg-white text-neutral-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-neutral-800 text-amber-300' : 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {brand.icon}
                    </span>
                    <span className="text-[10px] opacity-60">Verified</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{brand.name}</span>
                    <span className="text-[10px] text-neutral-400 block truncate mt-0.5">
                      {brand.models}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Matching Phone Models Grid */}
        <div>
          <div className="flex items-center justify-between mb-3 text-xs text-neutral-600">
            <span>
              Showing {results.length} Available Phone {results.length === 1 ? 'Model' : 'Models'}
            </span>
            <span className="text-neutral-400">Tap model to start customizer</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {results.slice(0, 12).map((model) => (
              <div
                key={model.id}
                onClick={() => handleSelectModel(model)}
                className="group p-3.5 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                    {model.brand}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 block truncate group-hover:text-amber-800 transition-colors">
                    {model.name}
                  </span>
                  <span className="text-[10px] text-neutral-500 block truncate">
                    {model.cameraCutout.shape.replace('-', ' ')}
                  </span>
                </div>
                <div className="w-7 h-7 rounded-full bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
