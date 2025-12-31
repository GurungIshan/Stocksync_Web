
import { getCategories } from "@/lib/api";
import ProductTable from "@/components/inventory/ProductTable";
import ProductFilters from "@/components/inventory/ProductFilters";

export default async function ProductsPage() {
    const categories = await getCategories();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Products</h1>
            </div>
            <ProductFilters categories={categories} />
            <ProductTable />
        </div>
    );
}
