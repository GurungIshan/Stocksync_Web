import type { Product, Category, Sale, Alert } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Electronics' },
  { id: 'cat-2', name: 'Apparel' },
  { id: 'cat-3', name: 'Groceries' },
  { id: 'cat-4', name: 'Books' },
  { id: 'cat-5', name: 'Home Goods' },
];

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Mouse',
    sku: 'WM-101',
    price: 2500,
    stock: 42,
    reorderPoint: 20,
    category: 'Electronics',
    imageUrl: PlaceHolderImages.find(p => p.id === 'prod-1')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'prod-1')?.imageHint || '',
  },
  {
    id: 'prod-2',
    name: 'Bluetooth Keyboard',
    sku: 'BK-202',
    price: 4500,
    stock: 15,
    reorderPoint: 10,
    category: 'Electronics',
    imageUrl: PlaceHolderImages.find(p => p.id === 'prod-2')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'prod-2')?.imageHint || '',
  },
  {
    id: 'prod-3',
    name: 'Men\'s T-Shirt',
    sku: 'TS-M-01',
    price: 1200,
    stock: 80,
    reorderPoint: 50,
    category: 'Apparel',
    imageUrl: PlaceHolderImages.find(p => p.id === 'prod-3')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'prod-3')?.imageHint || '',
  },
  {
    id: 'prod-4',
    name: 'Organic Apples',
    sku: 'GRO-APL-01',
    price: 300,
    stock: 8,
    reorderPoint: 15,
    category: 'Groceries',
    imageUrl: PlaceHolderImages.find(p => p.id === 'prod-4')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'prod-4')?.imageHint || '',
  },
  {
    id: 'prod-5',
    name: 'The Alchemist',
    sku: 'BK-ALC-99',
    price: 800,
    stock: 35,
    reorderPoint: 20,
    category: 'Books',
    imageUrl: PlaceHolderImages.find(p => p.id === 'prod-5')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'prod-5')?.imageHint || '',
  },
  {
    id: 'prod-6',
    name: 'Scented Candle',
    sku: 'HG-CND-45',
    price: 650,
    stock: 55,
    reorderPoint: 30,
    category: 'Home Goods',
    imageUrl: PlaceHolderImages.find(p => p.id === 'prod-6')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'prod-6')?.imageHint || '',
  },
  {
    id: 'prod-7',
    name: 'USB-C Hub',
    sku: 'ELE-HUB-03',
    price: 3500,
    stock: 25,
    reorderPoint: 15,
    category: 'Electronics',
    imageUrl: PlaceHolderImages.find(p => p.id === 'prod-7')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'prod-7')?.imageHint || '',
  },
  {
    id: 'prod-8',
    name: 'Women\'s Jeans',
    sku: 'JNS-W-07',
    price: 3200,
    stock: 40,
    reorderPoint: 25,
    category: 'Apparel',
    imageUrl: PlaceHolderImages.find(p => p.id === 'prod-8')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'prod-8')?.imageHint || '',
  },
];

export const sales: Sale[] = [
  {
    id: 'sale-1',
    items: [
      { productId: 'prod-1', productName: 'Wireless Mouse', quantity: 1, price: 2500 },
      { productId: 'prod-2', productName: 'Bluetooth Keyboard', quantity: 1, price: 4500 },
    ],
    total: 7000,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: 'sale-2',
    items: [{ productId: 'prod-3', productName: 'Men\'s T-Shirt', quantity: 2, price: 1200 }],
    total: 2400,
    createdAt: new Date(),
  },
  {
    id: 'sale-3',
    items: [{ productId: 'prod-5', productName: 'The Alchemist', quantity: 1, price: 800 }],
    total: 800,
    createdAt: new Date(),
  },
];

export const alerts: Alert[] = products
  .filter(p => p.stock <= p.reorderPoint)
  .map((p, index) => ({
    id: `alert-${p.id}`,
    productId: p.id,
    productName: p.name,
    currentStock: p.stock,
    reorderPoint: p.reorderPoint,
    suggestedOrderQty: p.reorderPoint * 2 - p.stock,
    daysUntilStockout: Math.floor(Math.random() * 10) + 1,
    urgency: p.stock < p.reorderPoint / 2 ? 'Critical' : 'Warning',
  }));
