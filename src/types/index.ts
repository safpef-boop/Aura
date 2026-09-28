export type CameraCutoutShape =
  | 'triple-plateau'      // iPhone 16/17 Pro style rounded square with 3 lenses + lidar
  | 'pill-vertical'       // iPhone 16/17 base or vertical dual camera
  | 'galaxy-ultra-rings'  // Samsung S24/S25/S26 Ultra individual floating rings
  | 'galaxy-vertical'     // Samsung S25/S26 / A55 vertical 3-ring column
  | 'pixel-visor'         // Google Pixel horizontal camera bar
  | 'oneplus-circular'    // OnePlus round watch-dial dial
  | 'xiaomi-square'       // Xiaomi large rectangular module
  | 'vivo-circle'         // Vivo circular Zeiss island;

export interface CameraCutout {
  shape: CameraCutoutShape;
  x: number; // percentage from left (0 to 100)
  y: number; // percentage from top (0 to 100)
  width: number; // percentage width
  height: number; // percentage height
  radius?: number; // border radius in px or %
  details?: string; // descriptive details
}

export interface PhoneModel {
  id: string;
  brand: string;
  name: string;
  slug: string;
  dimensions: {
    widthMm: number;
    heightMm: number;
    depthMm: number;
    aspectRatio: number; // e.g. 0.485 for modern tall phones
    outerCornerRadius: number; // in px on 400px tall preview
  };
  cameraCutout: CameraCutout;
  buttons: {
    left: Array<{ topPercent: number; heightPercent: number; label: string }>;
    right: Array<{ topPercent: number; heightPercent: number; label: string }>;
  };
  safeMarginPercent: number; // safe print zone margin percentage (e.g. 6%)
  basePriceMultiplier: number; // 1.0 = standard, 1.15 = large pro max models
  isPopular?: boolean;
  available: boolean;
}

export interface CaseType {
  id: string;
  name: string;
  tagline: string;
  description: string;
  finish: 'standard' | 'matte' | 'glossy' | 'magsafe' | 'armor' | 'gold_trim' | 'bespoke';
  basePricePKR: number;
  badge?: string;
  features: string[];
  sheenOverlayStyle?: string;
}

export interface CustomTextLayer {
  id: string;
  text: string;
  font: string; // 'Cinzel' | 'Playfair Display' | 'Plus Jakarta Sans' | 'Space Grotesk'
  fontSize: number; // 14 to 48
  color: string; // hex
  alignment: 'left' | 'center' | 'right';
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  isBold: boolean;
  isItalic: boolean;
  letterSpacing: number; // -2 to 8
}

export interface CustomDesign {
  id: string;
  title?: string;
  phoneModelId: string;
  caseTypeId: string;
  uploadedImage: string | null;
  uploadedImageName?: string;
  imageTransform: {
    scale: number; // 0.5 to 3
    x: number; // px offset
    y: number; // px offset
    rotation: number; // -180 to 180 degrees
    brightness: number; // 50 to 150
    contrast: number; // 50 to 150
    filter: string; // 'none' | 'noir' | 'warm-luxury' | 'cinematic' | 'cyber' | 'sepia'
  };
  textLayers: CustomTextLayer[];
  backgroundColor: string;
  backgroundPattern?: string;
  showSafeZone: boolean;
  showMagSafeRing: boolean;
  approvedPreview: boolean;
  previewThumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  pricePKR: number;
  compareAtPricePKR?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  features: string[];
  materials: string;
  inStock: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  compatibleBrands: string[];
  badge?: string;
}

export interface CartItem {
  cartItemId: string;
  itemType: 'custom' | 'ready_made';
  product?: Product;
  customDesign?: CustomDesign;
  phoneModel: PhoneModel;
  caseType: CaseType;
  quantity: number;
  unitPricePKR: number;
  totalPricePKR: number;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
}

export type PaymentMethodType = 'jazzcash' | 'easypaisa' | 'cod' | 'card';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotalPKR: number;
  shippingPKR: number;
  discountPKR: number;
  totalPKR: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'pending' | 'verified' | 'paid';
  orderStatus:
    | 'order_placed'
    | 'payment_confirmed'
    | 'design_approved'
    | 'in_production'
    | 'quality_check'
    | 'shipped'
    | 'delivered';
  trackingNumber: string;
  courierName: string;
  estimatedDeliveryDate: string;
  transactionRef?: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  phoneModel: string;
  caseType: string;
  userImage?: string;
}

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string;
  whatsappPrefillText: string;
  freeShippingThresholdPKR: number;
  standardShippingFeePKR: number;
  announcementText: string;
  jazzcashMerchantNumber: string;
  easypaisaMerchantNumber: string;
}
