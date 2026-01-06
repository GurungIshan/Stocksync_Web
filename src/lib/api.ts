
import type { Product, Category, Sale, Alert } from './types';
import { getToken } from './auth';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getProducts(categoryId?: string | null): Promise<Product[]> {
  const token = getToken();
  if (!token) {
    console.log("No auth token found, skipping product fetch.");
    return [];
  }
  
  let url = '/api/Product';
  if (categoryId) {
      url += `?categoryId=${categoryId}`;
  }

  try {
    const response = await fetch(url, {
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
  // This needs to be adapted to your API or mocked data structure
   const products = await getProducts();
   return products.find(p => p.id.toString() === id);
}

export async function getCategories(): Promise<Category[]> {
  const token = getToken();
  if (!token) {
    console.log("No auth token found, skipping category fetch.");
    return [];
  }
  try {
     const response = await fetch('/api/Category/Categorydropdown', {
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
  } catch(e) {
    console.error('Failed to fetch categories:', e);
    return [];
  }
}

export async function getSales(): Promise<Sale[]> {
  const token = getToken();
  if (!token) return [];
  try {
    const res = await fetch('/api/Sale', {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch sales');
    const sales = await res.json();
    // Assuming the API returns dates as strings
    return sales.map((s: any) => ({ ...s, createdAt: new Date(s.createdAt) }))
                .sort((a: Sale, b: Sale) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getReorderAlerts(): Promise<Alert[]> {
    const token = getToken();
    if (!token) return [];
    try {
        const res = await fetch('/api/Dashboard/reorder-alerts', {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch alerts');
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getDashboardStats() {
    const token = getToken();
    if (!token) return { monthlyRevenue: 0, lowStockItems: 0 };
     try {
        const [revenueRes, alertsRes] = await Promise.all([
            fetch('/api/Sales/monthly-revenue', {
                headers: { 'Authorization': `Bearer ${token}` },
                cache: 'no-store',
            }),
            fetch('/api/Dashboard/reorder-alerts', {
                headers: { 'Authorization': `Bearer ${token}` },
                cache: 'no-store',
            })
        ]);

        if (!revenueRes.ok) throw new Error('Failed to fetch monthly revenue');
        if (!alertsRes.ok) throw new Error('Failed to fetch reorder alerts');

        const revenueData = await revenueRes.json();
        const monthlyRevenue = revenueData.monthlyRevenue;
        const lowStockItems = (await alertsRes.json()).length;

        return { monthlyRevenue, lowStockItems };
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        return { monthlyRevenue: 0, lowStockItems: 0 };
    }
}
