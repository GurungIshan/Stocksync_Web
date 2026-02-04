'use client';

import ProductTable from "@/components/inventory/ProductTable";

export default function ProductsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold font-headline">Products</h1>
                    <p className="text-muted-foreground mt-1">Browse and manage your product inventory.</p>
                </div>
            </div>
            <ProductTable />
        </div>
    );
}
