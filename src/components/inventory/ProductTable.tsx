'use client';
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { Card, CardContent } from '@/components/ui/card';
import { getProducts } from "@/lib/api";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => (
    <Card className="overflow-hidden">
        <Skeleton className="h-40 w-full" />
        <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center mt-2">
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-5 w-16" />
            </div>
        </CardContent>
    </Card>
);


type ProductTableProps = {
    selectedCategory: string | null;
}

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
                setProducts([]); // Clear products on error
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [selectedCategory]);

    return (
        <div>
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="h-64 flex items-center justify-center">
                        <p className="text-muted-foreground">No products found for the selected category.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
