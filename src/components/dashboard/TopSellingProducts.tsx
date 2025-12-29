import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type TopSellingProductsProps = {
  products: { productName: string; amount: number }[];
};

export default function TopSellingProducts({ products }: TopSellingProductsProps) {
    const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', minimumFractionDigits: 0 }).format(value);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
        <CardDescription>
          Your best-performing products this month.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {products.map((product, index) => (
          <div key={index} className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage src={`https://picsum.photos/seed/${index+20}/40/40`} alt={product.productName} />
              <AvatarFallback>{product.productName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {product.productName}
              </p>
            </div>
            <div className="ml-auto font-medium">{formatCurrency(product.amount)}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
