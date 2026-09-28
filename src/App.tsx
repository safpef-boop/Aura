import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Navigation/Header';
import { Footer } from './components/Navigation/Footer';
import { WhatsAppButton } from './components/Navigation/WhatsAppButton';
import { CoverAIDrawer } from './components/AI/CoverAIDrawer';
import { ProductDetailModal } from './components/Shop/ProductDetailModal';

// Home Views
import { Hero } from './components/Home/Hero';
import { QuickPhoneSearch } from './components/Home/QuickPhoneSearch';
import { FeaturedProducts } from './components/Home/FeaturedProducts';
import { HowItWorks } from './components/Home/HowItWorks';
import { CustomerCreations } from './components/Home/CustomerCreations';
import { TrustSection } from './components/Home/TrustSection';
import { FAQSection } from './components/Home/FAQSection';
import { Newsletter } from './components/Home/Newsletter';

// Main Views
import { CustomizerStudio } from './components/Customizer/CustomizerStudio';
import { ProductCatalog } from './components/Shop/ProductCatalog';
import { CartView } from './components/Cart/CartView';
import { CheckoutView } from './components/Checkout/CheckoutView';
import { OrderConfirmation } from './components/Checkout/OrderConfirmation';
import { OrderTracker } from './components/Tracking/OrderTracker';
import { CustomerAccount } from './components/Account/CustomerAccount';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentView,
    selectedProductForModal,
    setSelectedProductForModal,
    setIsCoverAIOpen,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFC] selection:bg-amber-100 selection:text-neutral-900">
      <Header />

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero />
            <QuickPhoneSearch />
            <FeaturedProducts
              title="Studio Best Sellers"
              subtitle="Pakistan’s most popular ready-made artistic and luxury editions."
              filterType="best-seller"
            />
            <HowItWorks />
            <CustomerCreations />
            <TrustSection />
            <FeaturedProducts
              title="New Seasonal Arrivals"
              subtitle="Fresh contemporary drops crafted for modern flagship smartphones."
              filterType="new-arrival"
            />
            <FAQSection />
            <Newsletter />
          </>
        )}

        {currentView === 'customize' && <CustomizerStudio />}
        {currentView === 'shop' && <ProductCatalog />}
        {currentView === 'cart' && <CartView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'confirmation' && <OrderConfirmation />}
        {currentView === 'tracking' && <OrderTracker />}
        {currentView === 'account' && <CustomerAccount />}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      <Footer />

      {/* Floating Global Buttons */}
      <WhatsAppButton />

      {/* Floating Ask CoverAI Button */}
      <button
        onClick={() => setIsCoverAIOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-amber-300 shadow-xl hover:shadow-2xl transition-all hover:scale-105 border border-neutral-700/60 cursor-pointer group"
        title="Open CoverAI custom design assistant"
      >
        <div className="w-5 h-5 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-xs">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
        </div>
        <span className="text-xs font-bold tracking-wide">Ask CoverAI</span>
      </button>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />

      {/* CoverAI Drawer */}
      <CoverAIDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
