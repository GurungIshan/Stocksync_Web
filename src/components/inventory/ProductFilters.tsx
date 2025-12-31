'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Category } from "@/lib/types";
import { ListFilter } from "lucide-react";

type ProductFiltersProps = {
    categories: Category[];
    selectedCategory: string | null;
    onCategoryChange: (categoryId: string | null) => void;
}

export default function ProductFilters({ categories, selectedCategory, onCategoryChange }: ProductFiltersProps) {
    
    const handleCategoryChange = (value: string) => {
        onCategoryChange(value === 'all' ? null : value);
    }

    const selectedCategoryName = categories.find(c => c.id.toString() === selectedCategory)?.name || 'All';

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Filter by:</span>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-[150px]">
                                <ListFilter className="mr-2 h-4 w-4" />
                                <span className="truncate">
                                    {selectedCategoryName}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={selectedCategory || 'all'} onValueChange={handleCategoryChange}>
                                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                                {categories.map((cat) => (
                                    <DropdownMenuRadioItem key={cat.id} value={cat.id.toString()}>{cat.name}</DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {/* Add more filters here like Price Range, Stock Status */}
                </div>
            </CardContent>
        </Card>
    )
}
