import { Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  sale_price?: number;
  is_active: boolean;
  images: string[];
  colors?: string[];
  sizes: Record<string, number>;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CollectionRecord {
  id: string;
  date: string;
  cash_amount: number;
  upi_amount: number;
  card_amount: number;
  other_amount: number;
  total_amount: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface StoreSettings {
  store_name: string;
  phone: string;
  whatsapp: string;
  address: string;
  hours: string;
  instagram: string;
  maps_url: string;
  currency: string;
  low_stock_threshold: number;
  updated_at: Timestamp;
}
