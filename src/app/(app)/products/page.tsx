import ProductFilters from "@/components/inventory/ProductFilters";
import ProductGrid from "@/components/inventory/ProductGrid";
import { Button } from "@/components/ui/button";
import { getCategories, getProducts } from "@/lib/api";
import { PlusCircle } from "lucide-react";

export default async function ProductsPage() {
    const products = await getProducts();
    const categories = await getCategories();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Products</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>
            <ProductFilters categories={categories} />
            <ProductGrid products={products} />
        </div>
    );
}
