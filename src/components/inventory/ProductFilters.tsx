'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { type Category } from "@/lib/types";
import { ListFilter } from "lucide-react";

type ProductFiltersProps = {
    categories: Category[];
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Filter by:</span>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8">
                                <ListFilter className="mr-2 h-4 w-4" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Category
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {categories.map((cat) => (
                                <DropdownMenuCheckboxItem key={cat.id}>{cat.name}</DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {/* Add more filters here like Price Range, Stock Status */}
                </div>
            </CardContent>
        </Card>
    )
}
