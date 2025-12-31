import { getProducts } from "@/lib/api";
import SalesForm from "@/components/sales/SalesForm";

export default async function SalesPage() {
    const products = await getProducts();
    return (
        <div className="flex flex-col gap-6">
             <h1 className="text-3xl font-bold font-headline">Record a New Sale</h1>
             <SalesForm products={products} />
        </div>
    )
}
