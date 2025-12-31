
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, Package, AlertCircle, ShoppingCart, Loader2 } from 'lucide-react';
import { getToken } from '@/lib/auth';
import type { Product } from '@/lib/types';

type DashboardStatsProps = {
  initialStats: {
    todaysRevenue: number;
    lowStockItems: number;
  };
};

export default function DashboardStats({ initialStats }: DashboardStatsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('https://localhost:7232/api/Product', {
          method: 'GET',
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`
          },
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch products for stats');
        }
      } catch (error) {
        console.error('Error fetching products for stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR' }).format(value);

  const totalProducts = products.length;
  const inventoryValue = products.reduce((sum, p) => sum + p.pricePerUnit * p.stockQuantity, 0);

  const statCards = [
    {
      title: "Today's Revenue",
      value: formatCurrency(initialStats.todaysRevenue),
      icon: <DollarSign className="h-5 w-5 text-muted-foreground" />,
      loading: false,
    },
    {
      title: 'Low Stock Items',
      value: initialStats.lowStockItems,
      icon: <AlertCircle className="h-5 w-5 text-muted-foreground" />,
      loading: false,
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
            {card.loading ? (
                 <div className="flex justify-center items-center h-8">
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
