'use client';

import type { Product } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <Card className="overflow-hidden">
      <div className="relative h-32 w-full">
        <Image
          src={`https://picsum.photos/seed/${product.id}/400/300`}
          alt={product.productName}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{product.productName}</h3>
        <p className="text-sm text-muted-foreground">{formatCurrency(product.pricePerUnit)}</p>
        <p className="text-xs text-muted-foreground">
          {product.stockQuantity} in stock
        </p>
      </CardContent>
    </Card>
  );
}
