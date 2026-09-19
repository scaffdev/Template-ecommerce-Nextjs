export type ProductStatus = "active" | "draft";

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  image: string;
  productCount?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number; // IDR integer
  stock: number;
  imageUrl?: string;
  options: { name: string; value: string }[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  tags: string[];
  basePrice: number;
  comparePrice?: number;
  weight: number; // gram
  status: ProductStatus;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
  sold: number;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  image: string;
  price: number;
  qty: number;
  stock: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: "fixed" | "percent" | "freeship";
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  isActive: boolean;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled"
  | "returned";

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  courier: string;
  trackingNumber?: string;
  address: Record<string, string>;
  createdAt: string;
  couponCode?: string;
}

export interface Review {
  id: string;
  productId: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}
