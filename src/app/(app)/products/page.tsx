'use client';

import { useState, useEffect } from "react";
import { getCategories } from "@/lib/api";
import ProductTable from "@/components/inventory/ProductTable";
import ProductFilters from "@/components/inventory/ProductFilters";
import type { CategoryDropdownItem } from "@/lib/types";

export default function ProductsPage() {
    const [categories, setCategories] = useState<CategoryDropdownItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories);
        };
        fetchCategories();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Products</h1>
            </div>
            <ProductFilters 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />
            <ProductTable selectedCategory={selectedCategory} />
        </div>
    );
}
