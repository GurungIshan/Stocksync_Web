'use client';
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts } from "@/lib/api";
import { cn } from "@/lib/utils";

type ProductTableProps = {
    selectedCategory: string | null;
}

const ProductRowSkeleton = () => (
    <TableRow>
        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
        <TableCell className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
        <TableCell className="text-center"><Skeleton className="h-6 w-24 rounded-full mx-auto" /></TableCell>
    </TableRow>
);

export default function ProductTable({ selectedCategory }: ProductTableProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const data = await getProducts(selectedCategory);
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [selectedCategory]);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'NPR',
            minimumFractionDigits: 0,
        }).format(value);

    const getStatus = (product: Product): { text: string; variant: 'destructive' | 'secondary' | 'outline', className?: string } => {
        if (product.stockQuantity <= 0) {
            return { text: 'Out of Stock', variant: 'destructive' };
        }
        if (product.reorderLevel > 0 && product.stockQuantity <= product.reorderLevel) {
            return { text: 'Low Stock', variant: 'outline', className: 'text-accent border-accent' };
        }
        return { text: 'In Stock', variant: 'secondary' };
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle>Product List</CardTitle>
                <CardDescription>
                    A comprehensive list of all products in your inventory.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product Name</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-center">Stock</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [...Array(8)].map((_, i) => <ProductRowSkeleton key={i} />)
                        ) : products.length > 0 ? (
                            products.map((product) => {
                                const status = getStatus(product);
                                return (
                                    <TableRow key={product.id} className="transition-colors hover:bg-muted/50">
                                        <TableCell className="font-medium">{product.productName}</TableCell>
                                        <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                                        <TableCell className="text-muted-foreground">{product.category.name}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(product.pricePerUnit)}</TableCell>
                                        <TableCell className={cn("text-center font-bold", {
                                            'text-destructive': status.text === 'Out of Stock',
                                            'text-accent': status.text === 'Low Stock'
                                        })}>
                                            {product.stockQuantity}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={status.variant} className={cn('font-semibold', status.className)}>{status.text}</Badge>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No products found for the selected category.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
