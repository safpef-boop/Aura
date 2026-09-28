import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  X,
  Star,
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Smartphone,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const {
    phoneModels,
    selectedPhoneModel,
    setSelectedPhoneModel,
    caseTypes,
    selectedCaseType,
    setSelectedCaseType,
    addToCart,
    wishlist,
    toggleWishlist,
    setCurrentView,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);

  // Dynamic price adjustment based on case type if upgraded
  const basePrice = product.pricePKR;
  const finishUpgradeFee = selectedCaseType.basePricePKR > 2500 ? (selectedCaseType.basePricePKR - 2500) : 0;
  const unitPrice = basePrice + finishUpgradeFee;

  const handleAddToCart = () => {
    addToCart({
      itemType: 'ready_made',
      product,
      phoneModel: selectedPhoneModel,
      caseType: selectedCaseType,
      quantity,
      unitPricePKR: unitPrice,
    });
    onClose();
    setCurrentView('cart');
  };

  const handleBuyNow = () => {
    addToCart({
      itemType: 'ready_made',
      product,
      phoneModel: selectedPhoneModel,
      caseType: selectedCaseType,
      quantity,
      unitPricePKR: unitPrice,
    });
    onClose();
    setCurrentView('checkout');
  };

  const handleOpenCustomizer = () => {
    onClose();
    setCurrentView('customize');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-neutral-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-neutral-100 text-neutral-800 flex items-center justify-center shadow-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          {/* LEFT: Image Gallery (6 cols) */}
          <div className="md:col-span-6 bg-neutral-100 p-6 flex flex-col justify-between">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-200 shadow-inner">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <div className="absolute top-3 left-3 bg-neutral-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-18 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-neutral-900 scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details & Selectors (6 cols) */}
          <div className="md:col-span-6 p-6 sm:p-8 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
                <span className="uppercase tracking-wider font-semibold">{product.category}</span>
                <div className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating}</span>
                  <span className="text-neutral-400 font-normal">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-brand-display">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold font-mono text-neutral-900">
                  PKR {unitPrice.toLocaleString()}
                </span>
                {product.compareAtPricePKR && (
                  <span className="text-sm font-mono text-neutral-400 line-through">
                    PKR {product.compareAtPricePKR.toLocaleString()}
                  </span>
                )}
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  In Stock · Ready to Print
                </span>
              </div>
            </div>

            {/* Phone Model Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Select Your Phone Model</span>
                </label>
                <span className="text-[11px] text-neutral-500">{selectedPhoneModel.name}</span>
              </div>
              <select
                value={selectedPhoneModel.id}
                onChange={(e) => {
                  const m = phoneModels.find((model) => model.id === e.target.value);
                  if (m) setSelectedPhoneModel(m);
                }}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-neutral-50/50 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-medium cursor-pointer"
              >
                {phoneModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.brand} — {m.name} ({m.cameraCutout.shape})
                  </option>
                ))}
              </select>
            </div>

            {/* Case Finish Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                Choose Case Material & Finish
              </label>
              <div className="grid grid-cols-2 gap-2">
                {caseTypes.slice(0, 4).map((ct) => (
                  <button
                    key={ct.id}
                    onClick={() => setSelectedCaseType(ct)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedCaseType.id === ct.id
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800'
                    }`}
                  >
                    <span className="text-xs font-bold block truncate">{ct.name}</span>
                    <span className="text-[10px] opacity-75 block truncate">
                      {ct.finish === 'magsafe' ? '+ MagSafe Ring' : ct.finish}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">Quantity</span>
              <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-neutral-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm font-bold hover:bg-neutral-200 cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-sm font-bold hover:bg-neutral-200 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add To Cart</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'border-red-200 bg-red-50 text-red-600'
                      : 'border-neutral-300 hover:bg-neutral-100 text-neutral-700'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-3 px-4 rounded-xl border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-50 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Instant Checkout with JazzCash / COD
              </button>
            </div>

            {/* Not Your Model? CTA */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-amber-950 block">Want to add your own name or photo?</span>
                <span className="text-[11px] text-amber-800 block">Personalize this design in our 3D Studio</span>
              </div>
              <button
                onClick={handleOpenCustomizer}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 text-amber-300 hover:bg-neutral-800 text-[11px] font-bold uppercase tracking-wider shrink-0 cursor-pointer"
              >
                Customize
              </button>
            </div>

            {/* Description & Features */}
            <div className="space-y-2 text-xs text-neutral-600 border-t border-neutral-100 pt-3">
              <p className="leading-relaxed">{product.description}</p>
              <div className="space-y-1 pt-1">
                {product.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Delivery snippet */}
            <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-2 border-t border-neutral-100">
              <Truck className="w-3.5 h-3.5 text-neutral-700" />
              <span>Free Delivery in Pakistan on orders over PKR 5,000 · Cash on Delivery available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
