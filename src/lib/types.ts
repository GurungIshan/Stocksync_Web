export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  reorderPoint: number;
  category: string;
  imageUrl: string;
  imageHint: string;
};

export type Category = {
  id: string;
  name: string;
  subcategories?: Category[];
};

export type Sale = {
  id: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  createdAt: Date;
};

export type Alert = {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  reorderPoint: number;
  suggestedOrderQty: number;
  daysUntilStockout: number;
  urgency: 'Critical' | 'Warning' | 'Normal';
};

export type CartItem = {
  product: Product;
  quantity: number;
};
