export type ProductStatus = "active" | "draft";

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  image: string;
  description: string;
  tagline: string;
  productCount?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface VariantOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  options: VariantOption[];
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  tagline: string;
  description: string;
  story?: string;
  categoryId: string;
  tags: string[];
  basePrice: number;
  comparePrice?: number;
  weight: number;
  status: ProductStatus;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
  sold: number;
  images: ProductImage[];
  variants: ProductVariant[];
  highlights: string[];
  specs: ProductSpec[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  slug: string;
  name: string;
  variantName?: string;
  image: string;
  price: number;
  qty: number;
  stock: number;
}

export type CouponType = "fixed" | "percent" | "freeship";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  isActive: boolean;
  description: string;
  expiresAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  user: string;
  rating: number;
  title?: string;
  comment: string;
  date: string;
  verified?: boolean;
  helpful?: number;
  photos?: string[];
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled"
  | "returned";

export type PaymentStatus = "unpaid" | "paid" | "refunded" | "cod";

export interface ShippingAddress {
  label?: string;
  recipient: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  detail: string;
}

export interface SavedAddress extends ShippingAddress {
  id: string;
  isDefault: boolean;
}

export interface OrderTimelineItem {
  status: OrderStatus;
  at: string;
  note?: string;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethodId: string;
  paymentMethod: string;
  courierId: string;
  courier: string;
  etd?: string;
  trackingNumber?: string;
  address: ShippingAddress;
  customer: OrderCustomer;
  notes?: string;
  couponCode?: string;
  createdAt: string;
  expiresAt: string;
  timeline: OrderTimelineItem[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  isActive: boolean;
}

export interface PaymentMethodOption {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  shippingOrigin: string;
  taxPercent: number;
  freeShippingThreshold: number;
  paymentMethods: PaymentMethodOption[];
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  birthday?: string;
  joinedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
  href?: string;
  type?: "order" | "promo" | "restock" | "system";
  productId?: string;
}

export interface Testimonial {
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  intro: string;
  sections: { heading: string; body: string }[];
}

export interface Courier {
  id: string;
  name: string;
  etd: string;
  cost: number;
}
