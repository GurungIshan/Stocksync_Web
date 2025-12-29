import type { Sale } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

type RecentSalesProps = {
  sales: Sale[];
};

export default function RecentSales({ sales }: RecentSalesProps) {
    const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', minimumFractionDigits: 0 }).format(value);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>A list of your most recent sales.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.slice(0, 5).map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>
                  <div className="font-medium">Walk-in Customer</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {sale.items.map(i => i.productName).join(', ')}
                  </div>
                </TableCell>
                <TableCell>{format(sale.createdAt, 'PPpp')}</TableCell>
                <TableCell className="text-right">{formatCurrency(sale.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
