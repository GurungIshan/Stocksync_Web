'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Package, AlertCircle, ShoppingCart } from 'lucide-react';
import { getDashboardStats, getProducts } from '@/lib/api';
import { useEffect, useState } from 'react';
import type { Product, Stats } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [fetchedStats, fetchedProducts] = await Promise.all([
          getDashboardStats(),
          getProducts()
        ]);
        setStats(fetchedStats);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);


  const formatCurrency = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', minimumFractionDigits: 0 }).format(0);
    }
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', minimumFractionDigits: 0 }).format(value);
  }

  const totalProducts = products?.length ?? 0;
  const inventoryValue = products?.reduce((sum, p) => sum + p.pricePerUnit * p.stockQuantity, 0) ?? 0;

  const statCards = [
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats?.monthlyRevenue ?? 0),
      icon: null,
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStockItems ?? 0,
      icon: <AlertCircle className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: 'Total Products',
      value: totalProducts,
      icon: <Package className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: 'Inventory Value',
      value: formatCurrency(inventoryValue),
      icon: <ShoppingCart className="h-5 w-5 text-muted-foreground" />,
    },
  ];
  
  if (loading) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-5 w-3/4" />
                        {card.icon}
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-1/2" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
