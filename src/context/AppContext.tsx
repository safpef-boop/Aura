import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PhoneModel,
  CaseType,
  CustomDesign,
  Product,
  CartItem,
  Order,
  StoreSettings,
  CustomerInfo,
} from '../types';
import {
  INITIAL_PHONE_MODELS,
  CASE_TYPES,
  READY_MADE_PRODUCTS,
  INITIAL_STORE_SETTINGS,
  PAKISTAN_CITIES,
} from '../data/mockData';

interface AppContextType {
  // Navigation & Page views
  currentView: 'home' | 'customize' | 'shop' | 'cart' | 'checkout' | 'confirmation' | 'tracking' | 'account' | 'admin';
  setCurrentView: (view: 'home' | 'customize' | 'shop' | 'cart' | 'checkout' | 'confirmation' | 'tracking' | 'account' | 'admin') => void;

  // Phone Models & Selection
  phoneModels: PhoneModel[];
  selectedPhoneModel: PhoneModel;
  setSelectedPhoneModel: (model: PhoneModel) => void;
  caseTypes: CaseType[];
  selectedCaseType: CaseType;
  setSelectedCaseType: (caseType: CaseType) => void;

  // Customizer State
  customDesign: CustomDesign;
  setCustomDesign: React.Dispatch<React.SetStateAction<CustomDesign>>;
  resetCustomDesign: () => void;
  loadSavedDesign: (design: CustomDesign) => void;
  saveCurrentDesignToAccount: () => void;
  savedDesigns: CustomDesign[];

  // Cart & Pricing
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartItemId' | 'totalPricePKR'>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  cartSubtotalPKR: number;
  cartShippingPKR: number;
  cartDiscountPKR: number;
  cartTotalPKR: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;

  // Checkout & Orders
  lastPlacedOrder: Order | null;
  orders: Order[];
  createOrder: (customer: CustomerInfo, paymentMethod: any, transactionRef?: string) => Order;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;

  // Quick View / Selected Product for Modal
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (p: Product | null) => void;

  // Products
  products: Product[];

  // Admin Actions
  addPhoneModel: (model: PhoneModel) => void;
  updatePhoneModel: (model: PhoneModel) => void;
  deletePhoneModel: (id: string) => void;
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: StoreSettings) => void;

  // CoverAI Drawer
  isCoverAIOpen: boolean;
  setIsCoverAIOpen: (open: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_DESIGN: CustomDesign = {
  id: 'design-init',
  phoneModelId: INITIAL_PHONE_MODELS[0].id,
  caseTypeId: CASE_TYPES[0].id,
  uploadedImage: null,
  imageTransform: {
    scale: 1.0,
    x: 0,
    y: 0,
    rotation: 0,
    brightness: 100,
    contrast: 100,
    filter: 'none',
  },
  textLayers: [
    {
      id: 'txt-1',
      text: 'AURA PK',
      font: 'Cinzel',
      fontSize: 22,
      color: '#D4AF37', // 24K Gold
      alignment: 'center',
      x: 50,
      y: 78,
      isBold: true,
      isItalic: false,
      letterSpacing: 4,
    },
  ],
  backgroundColor: '#0F172A', // Slate 900
  showSafeZone: true,
  showMagSafeRing: false,
  approvedPreview: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'home' | 'customize' | 'shop' | 'cart' | 'checkout' | 'confirmation' | 'tracking' | 'account' | 'admin'>('home');
  const [phoneModels, setPhoneModels] = useState<PhoneModel[]>(() => {
    const saved = localStorage.getItem('aura_phone_models');
    return saved ? JSON.parse(saved) : INITIAL_PHONE_MODELS;
  });
  const [selectedPhoneModel, setSelectedPhoneModel] = useState<PhoneModel>(INITIAL_PHONE_MODELS[0]);
  const [caseTypes] = useState<CaseType[]>(CASE_TYPES);
  const [selectedCaseType, setSelectedCaseType] = useState<CaseType>(CASE_TYPES[0]);
  const [products, setProducts] = useState<Product[]>(READY_MADE_PRODUCTS);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('aura_store_settings');
    return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
  });

  const [customDesign, setCustomDesign] = useState<CustomDesign>(INITIAL_DESIGN);

  // Saved designs in account
  const [savedDesigns, setSavedDesigns] = useState<CustomDesign[]>(() => {
    const saved = localStorage.getItem('aura_saved_designs');
    return saved ? JSON.parse(saved) : [
      {
        ...INITIAL_DESIGN,
        id: 'saved-1',
        title: 'Hunza Trip Gold Monogram',
        uploadedImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80',
        backgroundColor: '#030712',
        createdAt: '2026-03-20T10:00:00Z',
        updatedAt: '2026-03-20T10:00:00Z',
      },
      {
        ...INITIAL_DESIGN,
        id: 'saved-2',
        title: 'Royal Emerald S26 Ultra',
        phoneModelId: 'samsung-galaxy-s26-ultra',
        caseTypeId: 'luxury-gold-trim',
        backgroundColor: '#022c22',
        uploadedImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
        createdAt: '2026-03-24T14:30:00Z',
        updatedAt: '2026-03-24T14:30:00Z',
      }
    ];
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('aura_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('aura_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ord-93821',
        orderNumber: 'PK-93821',
        createdAt: '2026-03-25T11:20:00Z',
        customer: {
          fullName: 'Muhammad Usman',
          phone: '03001234567',
          email: 'usman.pk@gmail.com',
          address: 'House 42, Street 8, Sector F-8/2',
          city: 'Islamabad',
          province: 'Islamabad Capital Territory',
          postalCode: '44000',
        },
        items: [
          {
            cartItemId: 'init-c1',
            itemType: 'ready_made',
            product: READY_MADE_PRODUCTS[0],
            phoneModel: INITIAL_PHONE_MODELS[0],
            caseType: CASE_TYPES[3],
            quantity: 1,
            unitPricePKR: 4500,
            totalPricePKR: 4500,
          },
        ],
        subtotalPKR: 4500,
        shippingPKR: 200,
        discountPKR: 0,
        totalPKR: 4700,
        paymentMethod: 'jazzcash',
        paymentStatus: 'verified',
        orderStatus: 'in_production',
        trackingNumber: 'TRX-8291402-PK',
        courierName: 'Trax Logistics Pakistan',
        estimatedDeliveryDate: '2-3 Business Days',
        transactionRef: 'JC-88319402',
      },
    ];
  });

  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [wishlist, setWishlist] = useState<string[]>(['prod-emerald-lahore', 'prod-sukoon-calligraphy']);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isCoverAIOpen, setIsCoverAIOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aura_saved_designs', JSON.stringify(savedDesigns));
  }, [savedDesigns]);

  useEffect(() => {
    localStorage.setItem('aura_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('aura_phone_models', JSON.stringify(phoneModels));
  }, [phoneModels]);

  useEffect(() => {
    localStorage.setItem('aura_store_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  // Keep design model sync
  useEffect(() => {
    setCustomDesign((prev) => ({
      ...prev,
      phoneModelId: selectedPhoneModel.id,
      caseTypeId: selectedCaseType.id,
    }));
  }, [selectedPhoneModel, selectedCaseType]);

  const resetCustomDesign = () => {
    setCustomDesign({
      ...INITIAL_DESIGN,
      id: `design-${Date.now()}`,
      phoneModelId: selectedPhoneModel.id,
      caseTypeId: selectedCaseType.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const loadSavedDesign = (design: CustomDesign) => {
    const foundModel = phoneModels.find((m) => m.id === design.phoneModelId) || phoneModels[0];
    const foundCase = caseTypes.find((c) => c.id === design.caseTypeId) || caseTypes[0];
    setSelectedPhoneModel(foundModel);
    setSelectedCaseType(foundCase);
    setCustomDesign({
      ...design,
      updatedAt: new Date().toISOString(),
    });
    setCurrentView('customize');
  };

  const saveCurrentDesignToAccount = () => {
    const newDesign: CustomDesign = {
      ...customDesign,
      id: customDesign.id.startsWith('design-') ? `saved-${Date.now()}` : customDesign.id,
      title: customDesign.title || `${selectedPhoneModel.name} Custom Case`,
      updatedAt: new Date().toISOString(),
    };
    setSavedDesigns((prev) => {
      const idx = prev.findIndex((d) => d.id === newDesign.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newDesign;
        return copy;
      }
      return [newDesign, ...prev];
    });
  };

  // Cart operations
  const addToCart = (item: Omit<CartItem, 'cartItemId' | 'totalPricePKR'>) => {
    const cartItemId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const totalPricePKR = item.unitPricePKR * item.quantity;
    const newItem: CartItem = {
      ...item,
      cartItemId,
      totalPricePKR,
    };
    setCart((prev) => [newItem, ...prev]);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.cartItemId === cartItemId
          ? { ...i, quantity: qty, totalPricePKR: i.unitPricePKR * qty }
          : i
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotalPKR = cart.reduce((sum, item) => sum + item.totalPricePKR, 0);
  const cartShippingPKR = cart.length === 0 ? 0 : cartSubtotalPKR >= storeSettings.freeShippingThresholdPKR ? 0 : storeSettings.standardShippingFeePKR;
  const discountRate = appliedCoupon === 'AURA10' ? 0.10 : appliedCoupon === 'WELCOMEPK' ? 0.15 : 0;
  const cartDiscountPKR = Math.round(cartSubtotalPKR * discountRate);
  const cartTotalPKR = Math.max(0, cartSubtotalPKR + cartShippingPKR - cartDiscountPKR);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'AURA10' || clean === 'WELCOMEPK' || clean === 'LAUNCHPK') {
      setAppliedCoupon(clean);
      return true;
    }
    return false;
  };

  const createOrder = (customer: CustomerInfo, paymentMethod: any, transactionRef?: string): Order => {
    const orderNum = `PK-${Math.floor(10000 + Math.random() * 90000)}`;
    const cityData = PAKISTAN_CITIES.find((c) => c.name.toLowerCase() === customer.city.toLowerCase());

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      customer,
      items: [...cart],
      subtotalPKR: cartSubtotalPKR,
      shippingPKR: cartShippingPKR,
      discountPKR: cartDiscountPKR,
      totalPKR: cartTotalPKR,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'verified',
      orderStatus: 'order_placed',
      trackingNumber: `TCS-${Math.floor(1000000 + Math.random() * 9000000)}-PK`,
      courierName: 'TCS Express Pakistan',
      estimatedDeliveryDate: cityData ? cityData.deliveryDays : '3-4 Business Days',
      transactionRef: transactionRef || (paymentMethod === 'cod' ? undefined : `TXN-${Date.now()}`),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    clearCart();
    setCurrentView('confirmation');
    return newOrder;
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Admin phone model management
  const addPhoneModel = (model: PhoneModel) => {
    setPhoneModels((prev) => [model, ...prev]);
  };

  const updatePhoneModel = (model: PhoneModel) => {
    setPhoneModels((prev) => prev.map((m) => (m.id === model.id ? model : m)));
    if (selectedPhoneModel.id === model.id) {
      setSelectedPhoneModel(model);
    }
  };

  const deletePhoneModel = (id: string) => {
    setPhoneModels((prev) => prev.filter((m) => m.id !== id));
  };

  const updateStoreSettings = (newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        phoneModels,
        selectedPhoneModel,
        setSelectedPhoneModel,
        caseTypes,
        selectedCaseType,
        setSelectedCaseType,
        customDesign,
        setCustomDesign,
        resetCustomDesign,
        loadSavedDesign,
        saveCurrentDesignToAccount,
        savedDesigns,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotalPKR,
        cartShippingPKR,
        cartDiscountPKR,
        cartTotalPKR,
        appliedCoupon,
        applyCoupon,
        lastPlacedOrder,
        orders,
        createOrder,
        wishlist,
        toggleWishlist,
        selectedProductForModal,
        setSelectedProductForModal,
        products,
        addPhoneModel,
        updatePhoneModel,
        deletePhoneModel,
        storeSettings,
        updateStoreSettings,
        isCoverAIOpen,
        setIsCoverAIOpen,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
