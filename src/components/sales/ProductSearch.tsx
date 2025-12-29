import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type ProductSearchProps = {
    onSearch: (term: string) => void;
}

export default function ProductSearch({ onSearch }: ProductSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        placeholder="Search products by name or SKU..."
        className="pl-10 text-lg h-12"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
