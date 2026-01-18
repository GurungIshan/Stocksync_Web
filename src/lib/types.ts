
export type Category = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  isActive: boolean;
};

export type CategoryDropdownItem = {
  id: number;
  name: string;
};

export type ProductDropdownItem = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  productName: string;
  description: string;
  sku: string;
  pricePerUnit: number;
  stockQuantity: number;
  reorderLevel: number;
  categoryId: number;
  supplierId: number;
  isActive: boolean;
  createdAt: string;
  category: Category;
  suppliersInfromation: any; // Can be defined more strictly if needed
};

export type Sale = {
  saleId: number;
  invoiceNo: string;
  saleDate: string;
  customerName: string | null;
  customerPhone: string | null;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  itemCount: number;
};

export type Alert = {
  productId: number;
  productName: string;
  currentStock: number;
  reorderPoint: number;
  averageDailySales: number;
  leadTimeDays: number;
  safetyStock: number;
  suggestedOrderQty: number;
  urgencyLevel: 'HIGH' | 'MEDIUM' | 'LOW';
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type SaleItemDetail = {
  productName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
};

export type UserInfo = {
  fullName: string;
};

export type DetailedSale = {
  saleId: number;
  invoiceNo: string;
  saleDate: string;
  customerName: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
  customerAddress: string | null;
  totalAmount: number;
  subTotal: number;
  discount: number;
  tax: number;
  paymentMethod: string;
  user: UserInfo;
  saleItems: SaleItemDetail[];
};
