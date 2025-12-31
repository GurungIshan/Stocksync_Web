'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Package, AlertCircle, ShoppingCart, Loader2 } from 'lucide-react';
import { getToken } from '@/lib/auth';
import type { Product } from '@/lib/types';
import { getDashboardStats } from '@/lib/api';

export default function DashboardStats() {
  const [stats, setStats] = useState({ todaysRevenue: 0, lowStockItems: 0 });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllStats() {
      setLoading(true);
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        // Fetch stats and products in parallel
        const [statsData, productsResponse] = await Promise.all([
          getDashboardStats(),
          fetch('/api/Product', {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store'
          })
        ]);

        setStats(statsData);

        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
        } else {
          console.error('Failed to fetch products for stats');
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllStats();
  }, []);

  const formatCurrency = (value: number) =>
    `Nrs ${new Intl.NumberFormat('en-IN').format(value)}`;

  const totalProducts = products.length;
  const inventoryValue = products.reduce((sum, p) => sum + p.pricePerUnit * p.stockQuantity, 0);

  const statCards = [
    {
      title: "Today's Revenue",
      value: formatCurrency(stats.todaysRevenue),
      icon: null,
      loading: loading,
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: <AlertCircle className="h-5 w-5 text-muted-foreground" />,
      loading: loading,
    },
    {
      title: 'Total Products',
      value: totalProducts,
      icon: <Package className="h-5 w-5 text-muted-foreground" />,
      loading: loading,
    },
    {
      title: 'Inventory Value',
      value: formatCurrency(inventoryValue),
      icon: <ShoppingCart className="h-5 w-5 text-muted-foreground" />,
      loading: loading,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            {card.loading && card.value === 0 || (card.loading && typeof card.value === 'string' && card.value.includes('0')) ? (
                 <div className="flex justify-start items-center h-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                 </div>
            ) : (
                <div className="text-2xl font-bold">{card.value}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
