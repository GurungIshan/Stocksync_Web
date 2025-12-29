import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, Package, AlertCircle, ShoppingCart } from 'lucide-react';

type DashboardStatsProps = {
  stats: {
    totalProducts: number;
    lowStockItems: number;
    todaysRevenue: number;
    inventoryValue: number;
  };
};

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR' }).format(value);

  const statCards = [
    {
      title: "Today's Revenue",
      value: formatCurrency(stats.todaysRevenue),
      icon: <DollarSign className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: <AlertCircle className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <Package className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: 'Inventory Value',
      value: formatCurrency(stats.inventoryValue),
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
