'use client';

import type { Product } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:shadow-accent/20">
      <div className="relative h-40 w-full group">
        <Image
          src={`https://picsum.photos/seed/${product.id}/400/300`}
          alt={product.productName}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          data-ai-hint="product image"
        />
        <div className="absolute top-2 right-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/50 hover:bg-background/80">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{product.productName}</h3>
        <p className="text-sm text-muted-foreground">{formatCurrency(product.pricePerUnit)}</p>
        <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-muted-foreground">
                {product.stockQuantity} in stock
            </p>
            <Badge variant={product.stockQuantity > (product.reorderLevel || 0) ? 'secondary' : 'destructive'}>
                {product.stockQuantity > (product.reorderLevel || 0) ? 'In Stock' : 'Low Stock'}
            </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
