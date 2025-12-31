
export type Category = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  isActive: boolean;
};

export type Product = {
  id: number;
  productName: string;
  description: string;
  sku: string;
  pricePerUnit: number;
  stockQuantity: number;
  reoredLevel: number;
  categoryId: number;
  supplierId: number;
  isActive: boolean;
  createdAt: string;
  category: Category;
  suppliersInfromation: any; // Can be defined more strictly if needed
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
