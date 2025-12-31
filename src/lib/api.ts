
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

  let url = 'https://localhost:7232/api/Product';
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
     const response = await fetch('https://localhost:7232/api/Category', {
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
    const res = await fetch('https://localhost:7232/api/Sale', {
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
        const res = await fetch('https://localhost:7232/api/Dashboard/reorder-alerts', {
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
    if (!token) return { todaysRevenue: 0, lowStockItems: 0 };
     try {
        const res = await fetch('https://localhost:7232/api/Dashboard/stats', {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch dashboard stats');
        return await res.json();
    } catch (error) {
        console.error(error);
        return { todaysRevenue: 0, lowStockItems: 0 };
    }
}

export async function getTopSellingProducts(): Promise<{productName: string; amount: number}[]> {
    const token = getToken();
    if (!token) return [];
     try {
        const res = await fetch('https://localhost:7232/api/Dashboard/top-selling', {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch top selling products');
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}
