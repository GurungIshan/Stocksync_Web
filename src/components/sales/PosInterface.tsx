'use client';
import { useState } from 'react';
import type { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import ProductSearch from './ProductSearch';
import ProductCard from '@/components/inventory/ProductCard';
import { Cart } from './Cart';

type PosInterfaceProps = {
  products: Product[];
};

export function PosInterface({ products }: PosInterfaceProps) {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col gap-6 lg:h-[calc(100vh-8rem)] lg:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        <h1 className="text-3xl font-bold font-headline">Point of Sale</h1>
        <ProductSearch onSearch={setSearchTerm} />
        <div className="flex-1 overflow-auto rounded-lg border bg-card p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div key={product.id} onClick={() => addToCart(product)} className="cursor-pointer">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/3 xl:w-1/4">
        <Cart />
      </div>
    </div>
  );
}
