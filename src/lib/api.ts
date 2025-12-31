import { products as mockProducts, categories, sales, alerts } from '@/lib/data';
import type { Product, Category, Sale, Alert } from './types';
import { getToken } from './auth';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getAuthHeaders() {
    const token = getToken();
    if (!token) {
        return null;
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}


export async function getProducts(): Promise<Product[]> {
  const token = getToken();
  if (!token) {
    console.log("No auth token found, skipping product fetch.");
    return [];
  }

  try {
    const response = await fetch('/api/Product', {
        method: 'GET',
        headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return []; // Return empty array on error
  }
}

export async function getProductById(id: string): Promise<any | undefined> {
  await delay(200);
  // This needs to be adapted to your API or mocked data structure
  return mockProducts.find(p => p.id === id);
}

export async function getCategories(): Promise<Category[]> {
  await delay(300);
  return categories;
}

export async function getSales(): Promise<Sale[]> {
  await delay(600);
  return sales.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getTodaysSales(): Promise<Sale[]> {
    await delay(400);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sales.filter(s => s.createdAt >= today);
}

export async function getReorderAlerts(): Promise<Alert[]> {
  await delay(700);
  return alerts;
}

export async function getDashboardStats() {
    await delay(800);
    const products = await getProducts();
    const totalProducts = products.length;
    const lowStockItems = alerts.length;
    const todaySales = await getTodaysSales();
    const todaysRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const inventoryValue = products.reduce((sum, p) => sum + p.pricePerUnit * p.stockQuantity, 0);

    return {
        totalProducts,
        lowStockItems,
        todaysRevenue,
        inventoryValue
    };
}

export async function getTopSellingProducts(): Promise<{productName: string; amount: number}[]> {
    await delay(1000);
    // This is a simplified logic. A real API would calculate this from sales data.
    return [
        { productName: 'Wireless Mouse', amount: 7000 },
        { productName: 'Men\'s T-Shirt', amount: 2400 },
        { productName: 'The Alchemist', amount: 800 },
        { productName: 'Scented Candle', amount: 500 },
    ];
}
