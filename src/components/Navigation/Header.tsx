import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Sparkles,
  Shield,
  Smartphone,
  Sliders,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cart,
    wishlist,
    searchQuery,
    setSearchQuery,
    setIsCoverAIOpen,
    storeSettings,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop Ready-Made' },
    { id: 'customize', label: 'Customize Studio' },
    { id: 'tracking', label: 'Track Order' },
    { id: 'account', label: 'My Account' },
    { id: 'admin', label: 'Admin Panel' },
  ];

  const handleNavClick = (viewId: any) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 transition-all">
      {/* Announcement Bar */}
      <div className="bg-neutral-900 text-neutral-200 py-1.5 px-4 text-center text-[11px] font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
        <span className="truncate">{storeSettings.announcementText}</span>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* LEFT: Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-lg bg-neutral-900 flex items-center justify-center text-[#D4AF37] shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-brand-display font-bold text-lg">A</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-widest text-neutral-900 font-brand-display leading-tight">
                AURA CASE
              </span>
              <span className="text-[9px] tracking-[0.25em] text-neutral-500 uppercase font-sans">
                STUDIO • PAKISTAN
              </span>
            </div>
          </div>

          {/* CENTER: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer relative py-1 ${
                  currentView === link.id
                    ? 'text-neutral-900 font-bold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {link.label}
                {currentView === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-neutral-900 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <div className="relative hidden md:block w-48 lg:w-56">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'shop') setCurrentView('shop');
                }}
                placeholder="Search phone or cover..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-full focus:outline-none transition-colors"
              />
            </div>

            {/* Mobile Search Icon */}
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (currentView !== 'shop') setCurrentView('shop');
              }}
              className="md:hidden p-2 text-neutral-700 hover:text-neutral-900 cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Ask CoverAI Button in Header */}
            <button
              onClick={() => setIsCoverAIOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-900 text-neutral-800 text-xs font-semibold transition-all cursor-pointer bg-neutral-50/50"
              title="Open CoverAI custom design assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden xl:inline">Ask</span> CoverAI
            </button>

            {/* Wishlist */}
            <button
              onClick={() => handleNavClick('account')}
              className="p-2 text-neutral-700 hover:text-neutral-900 relative transition-colors cursor-pointer"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account */}
            <button
              onClick={() => handleNavClick('account')}
              className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer hidden sm:block"
              title="My Account & Saved Designs"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => handleNavClick('cart')}
              className="p-2 text-neutral-900 hover:text-neutral-700 relative transition-colors cursor-pointer"
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-neutral-900 text-amber-300 text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-900 hover:text-neutral-700 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {searchOpen && (
          <div className="md:hidden pb-3 pt-1">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phone model, anime, luxury marble..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  currentView === link.id
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsCoverAIOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-900 text-amber-300 text-xs font-bold"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask CoverAI Designer</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
