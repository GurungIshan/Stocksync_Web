
import type { Product, Sale, Alert, CategoryDropdownItem, ProductDropdownItem, Stats } from './types';
import { getToken } from './auth';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getProducts(categoryId?: string | null): Promise<Product[]> {
  const token = getToken();
  if (!token) return [];

  let url = 'https://localhost:7232/api/Product';

  if (categoryId) {
    url += `?categoryId=${Number(categoryId)}`;
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Backend error:', errorText);
    throw new Error(errorText);
  }

  return response.json();
}


export async function getProductsForDropdown(): Promise<ProductDropdownItem[]> {
  const token = getToken();
  if (!token) {
    console.log("No auth token found, skipping product dropdown fetch.");
    return [];
  }
  try {
     const response = await fetch('https://localhost:7232/api/Product/Productdropdown', {
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
    console.error('Failed to fetch product dropdown:', e);
    return [];
  }
}

export async function getProductById(id: string): Promise<any | undefined> {
  // This needs to be adapted to your API or mocked data structure
   const products = await getProducts();
   return products.find(p => p.id.toString() === id);
}

export async function getCategories(): Promise<CategoryDropdownItem[]> {
  const token = getToken();
  if (!token) {
    console.log("No auth token found, skipping category fetch.");
    return [];
  }
  try {
     const response = await fetch('https://localhost:7232/api/Category/Categorydropdown', {
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
    const res = await fetch('https://localhost:7232/api/Sales', {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch sales');
    const data = await res.json();
    
    let salesList: Sale[] = [];

    if (Array.isArray(data)) {
        salesList = data;
    } else if (data && Array.isArray(data.sales)) {
        salesList = data.sales;
    } else {
        console.warn("Expected an array of sales, but received:", data);
    }
    
    // Assuming the API returns dates as strings and we want to sort by date
    return salesList.sort((a: Sale, b: Sale) => {
        if (!a.saleDate || !b.saleDate) return 0;
        return new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getReorderAlerts(): Promise<Alert[]> {
    const token = getToken();
    if (!token) return [];
    try {
        const res = await fetch('https://localhost:7232/api/Sales/reorder-alerts', {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch alerts');
        const data = await res.json();
        return data.alerts || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getDashboardStats(): Promise<Stats> {
    const token = getToken();
    if (!token) return { monthlyRevenue: 0, lowStockItems: 0 };
     try {
        const [revenueRes, alertsRes] = await Promise.all([
            fetch('https://localhost:7232/api/Sales/monthly-revenue', {
                headers: { 'Authorization': `Bearer ${token}` },
                cache: 'no-store',
            }),
            fetch('https://localhost:7232/api/Sales/reorder-alerts', {
                headers: { 'Authorization': `Bearer ${token}` },
                cache: 'no-store',
            })
        ]);

        if (!revenueRes.ok) throw new Error('Failed to fetch monthly revenue');
        if (!alertsRes.ok) throw new Error('Failed to fetch reorder alerts');

        const revenueData = await revenueRes.json();
        const monthlyRevenue = revenueData.monthlyRevenue || 0;
        
        const alertsData = await alertsRes.json();
        const lowStockItems = alertsData.alerts ? alertsData.alerts.length : 0;

        return { monthlyRevenue, lowStockItems };
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        return { monthlyRevenue: 0, lowStockItems: 0 };
    }
}
