import Image from "next/image";
import type { Product } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ProductCardProps = {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', minimumFractionDigits: 0 }).format(value);

    const stockStatus = product.stock > product.reorderPoint 
        ? 'In Stock' 
        : product.stock > 0 ? 'Low Stock' : 'Out of Stock';

    const stockBadgeVariant = () => {
        switch(stockStatus) {
            case 'In Stock': return 'secondary';
            case 'Low Stock': return 'default'; // yellow in theme
            case 'Out of Stock': return 'destructive';
            default: return 'secondary';
        }
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="p-0">
                <div className="relative aspect-video w-full">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover rounded-t-lg"
                        data-ai-hint={product.imageHint}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg font-semibold mb-1">{product.name}</CardTitle>
                <CardDescription>SKU: {product.sku}</CardDescription>
                <div className="mt-2 flex items-center justify-between">
                     <p className="text-xl font-bold text-primary">{formatCurrency(product.price)}</p>
                    <Badge variant={stockBadgeVariant()}>{stockStatus}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                    Stock: {product.stock} units
                </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button className="w-full">View Details</Button>
            </CardFooter>
        </Card>
    );
}
