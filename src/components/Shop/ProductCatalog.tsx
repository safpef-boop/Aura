import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Search,
  Filter,
  Star,
  Heart,
  Eye,
  ShoppingCart,
  Sparkles,
  ArrowUpDown,
  Smartphone,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Luxury',
  'Islamic',
  'Minimal',
  'Anime',
  'Cars',
  'Aesthetic',
  'Transparent',
];

const BRANDS = ['All Brands', 'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Vivo', 'Infinix'];

export const ProductCatalog: React.FC = () => {
  const {
    products,
    setSelectedProductForModal,
    wishlist,
    toggleWishlist,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    selectedPhoneModel,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeBrand, setActiveBrand] = useState('All Brands');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesBrand =
      activeBrand === 'All Brands' ||
      (p.compatibleBrands && p.compatibleBrands.includes(activeBrand));
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesBrand && matchesSearch;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.pricePKR - b.pricePKR;
    if (sortBy === 'price-desc') return b.pricePKR - a.pricePKR;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Ready-Made Case Atelier</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 font-brand-display">
            The Phone Cover Collection
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
            Model-accurate covers engineered for iPhone, Samsung Galaxy, Pixel, OnePlus, Xiaomi, and Vivo.
          </p>
        </div>

        {/* Custom Cover CTA */}
        <button
          onClick={() => setCurrentView('customize')}
          className="px-5 py-3 rounded-xl bg-neutral-900 text-amber-300 hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center gap-2 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Or Design Your Own Photo Case</span>
        </button>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ready-made covers e.g. Sukoon, Emerald, Porsche, Anime..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-neutral-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* Brand Dropdown */}
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-neutral-500" />
          <select
            value={activeBrand}
            onChange={(e) => setActiveBrand(e.target.value)}
            className="px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-medium cursor-pointer"
          >
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-neutral-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-medium cursor-pointer"
          >
            <option value="featured">Featured Editions</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Category Pills / Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {sortedProducts.map((product) => {
          const isWishlisted = wishlist.includes(product.id);

          return (
            <div
              key={product.id}
              onClick={() => setSelectedProductForModal(product)}
              className="group bg-white rounded-2xl border border-neutral-200/90 overflow-hidden hover:border-neutral-900 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {product.badge && (
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-neutral-900/90 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {product.badge}
                    </span>
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'bg-red-50 text-red-600'
                      : 'bg-white/80 text-neutral-700 hover:bg-white hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProductForModal(product);
                    }}
                    className="w-full py-2 rounded-xl bg-white/95 text-neutral-900 text-xs font-bold shadow-md hover:bg-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick View & Select Model</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="uppercase tracking-wider font-semibold">{product.category}</span>
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-sm sm:text-base font-extrabold text-neutral-900 font-mono">
                    PKR {product.pricePKR.toLocaleString()}
                  </span>
                  {product.compareAtPricePKR && (
                    <span className="text-[11px] text-neutral-400 line-through font-mono">
                      PKR {product.compareAtPricePKR.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-neutral-100 text-[10px] text-neutral-500 flex items-center justify-between">
                  <span>Fits {selectedPhoneModel.name}</span>
                  <span className="text-neutral-900 font-semibold underline">Choose</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedProducts.length === 0 && (
        <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-neutral-300 p-8 space-y-3">
          <p className="text-sm text-neutral-600">No ready-made covers found matching your filter criteria.</p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setActiveBrand('All Brands');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
