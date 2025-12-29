import { PosInterface } from "@/components/sales/PosInterface";
import { CartProvider } from "@/context/CartContext";
import { getProducts } from "@/lib/api";

export default async function SalesPage() {
    const products = await getProducts();
    return (
        <CartProvider>
            <PosInterface products={products} />
        </CartProvider>
    )
}
