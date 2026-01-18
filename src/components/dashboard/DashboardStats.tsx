
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Package, AlertCircle, ShoppingCart } from 'lucide-react';
import { getDashboardStats, getProducts } from '@/lib/api';

export default async function DashboardStats() {
  const [stats, products] = await Promise.all([
    getDashboardStats(),
    getProducts()
  ]);

  const formatCurrency = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return `Nrs. 0`;
    }
    return `Nrs. ${new Intl.NumberFormat('en-IN').format(value)}`;
  }

  const totalProducts = products.length;
  const inventoryValue = products.reduce((sum, p) => sum + p.pricePerUnit * p.stockQuantity, 0);

  const statCards = [
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats.monthlyRevenue),
      icon: null,
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: <AlertCircle className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: 'Total Products',
      value: totalProducts,
      icon: <Package className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: 'Inventory Value',
      value: formatCurrency(inventoryValue),
      icon: <ShoppingCart className="h-5 w-5 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
