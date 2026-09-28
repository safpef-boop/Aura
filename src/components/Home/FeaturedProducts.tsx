import React from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { Star, Heart, ArrowRight, Eye, ShoppingCart, Sparkles } from 'lucide-react';

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  filterType?: 'best-seller' | 'new-arrival' | 'all';
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title = 'Studio Best Sellers',
  subtitle = 'Pakistan’s most coveted ready-made artistic and luxury editions.',
  filterType = 'best-seller',
}) => {
  const {
    products,
    setSelectedProductForModal,
    wishlist,
    toggleWishlist,
    setCurrentView,
    addToCart,
    selectedPhoneModel,
    caseTypes,
  } = useApp();

  const filtered = products.filter((p) => {
    if (filterType === 'best-seller') return p.isBestSeller;
    if (filterType === 'new-arrival') return p.isNewArrival;
    return true;
  });

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      itemType: 'ready_made',
      product,
      phoneModel: selectedPhoneModel,
      caseType: caseTypes[0],
      quantity: 1,
      unitPricePKR: product.pricePKR,
    });
    setCurrentView('cart');
  };

  return (
    <section className="py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Curated Ready-Made Atelier</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-brand-display">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">{subtitle}</p>
          </div>

          <button
            onClick={() => setCurrentView('shop')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:text-amber-800 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <span>View All Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.slice(0, 8).map((product) => {
            const isWishlisted = wishlist.includes(product.id);

            return (
              <div
                key={product.id}
                onClick={() => setSelectedProductForModal(product)}
                className="group relative bg-[#FCFCFC] rounded-2xl border border-neutral-200/90 overflow-hidden hover:border-neutral-900 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Product Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="text-[10px] font-bold tracking-wider uppercase bg-neutral-900/90 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Wishlist Button */}
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

                  {/* Quick View Button on Hover */}
                  <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProductForModal(product);
                      }}
                      className="flex-1 py-2 rounded-xl bg-white/95 text-neutral-900 text-xs font-bold shadow-md hover:bg-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3.5 sm:p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span className="uppercase tracking-wider font-medium">{product.category}</span>
                    <div className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{product.rating}</span>
                      <span className="text-neutral-400">({product.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline justify-between pt-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm sm:text-base font-extrabold text-neutral-900 font-mono">
                        PKR {product.pricePKR.toLocaleString()}
                      </span>
                      {product.compareAtPricePKR && (
                        <span className="text-[11px] text-neutral-400 line-through font-mono">
                          PKR {product.compareAtPricePKR.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Compatible with badge */}
                  <div className="pt-2 border-t border-neutral-100 text-[10px] text-neutral-400 flex items-center justify-between">
                    <span>Available for 50+ Phones</span>
                    <span className="text-neutral-900 font-semibold underline">Configure</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Not Your Model CTA Callout */}
        <div className="mt-12 p-6 rounded-2xl bg-[#FAF9F6] border border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-neutral-900 font-brand-display">
              Can't find your exact model or want your own photo?
            </h4>
            <p className="text-xs text-neutral-600">
              Upload any photo or high-res artwork to create a customized case tailored to your smartphone.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('customize')}
            className="px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider shrink-0 transition-colors shadow-xs cursor-pointer"
          >
            Create A Custom Cover
          </button>
        </div>
      </div>
    </section>
  );
};
