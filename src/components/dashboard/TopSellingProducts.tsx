'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { getTopSellingProducts } from '@/lib/api';
import { Loader2 } from 'lucide-react';

type TopSellingProduct = {
  productName: string;
  amount: number;
};

export default function TopSellingProducts() {
  const [products, setProducts] = useState<TopSellingProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopProducts() {
      setLoading(true);
      const topProducts = await getTopSellingProducts();
      setProducts(topProducts);
      setLoading(false);
    }
    fetchTopProducts();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', minimumFractionDigits: 0 }).format(value);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
        <CardDescription>
          Your best-performing products this month.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length > 0 ? (
          products.map((product, index) => (
            <div key={index} className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src={`https://picsum.photos/seed/${product.productName}/40/40`} alt={product.productName} />
                <AvatarFallback>{product.productName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {product.productName}
                </p>
              </div>
              <div className="ml-auto font-medium">{formatCurrency(product.amount)}</div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">No sales data available to determine top products.</p>
        )}
      </CardContent>
    </Card>
  );
}
