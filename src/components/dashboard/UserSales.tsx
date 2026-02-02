'use client';

import type { Sale } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Defs, LinearGradient, Stop } from "recharts";
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';
import { getSales } from '@/lib/api';
import { useEffect, useState, useMemo } from 'react';
import { getUserIdFromToken } from '@/utils/jwt';

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function UserSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSales() {
        setLoading(true);
        try {
            const currentUserId = getUserIdFromToken();
            const fetchedSales = await getSales();
            if(currentUserId) {
                const userSales = fetchedSales.filter(sale => sale.userId.toString() === currentUserId);
                setSales(userSales);
            }
        } catch (error) {
            console.error('Failed to fetch user sales:', error);
        } finally {
            setLoading(false);
        }
    }
    fetchSales();
  }, []);

  const chartData = useMemo(() => {
    if (!sales.length) return [];
    
    const salesByDate = sales.reduce((acc, sale) => {
      const date = format(parseISO(sale.saleDate), 'yyyy-MM-dd');
      acc[date] = (acc[date] || 0) + sale.totalAmount;
      return acc;
    }, {} as Record<string, number>);

    const sortedDates = Object.keys(salesByDate)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .slice(-7); // get last 7 days of sales activity

    return sortedDates.map(date => ({
      date: format(new Date(date), 'MMM d'),
      sales: salesByDate[date],
    }));
  }, [sales]);


  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', minimumFractionDigits: 0 }).format(value);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="pl-2">
            <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-accent/20 hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle>Your Sales Performance</CardTitle>
        <CardDescription>Your sales activity over the last 7 active days.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <defs>
                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-sales)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-sales)" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                    />
                    <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `Rs${Number(value) / 1000}k`}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent
                            formatter={(value) => formatCurrency(value as number)}
                            labelClassName="font-bold"
                            indicator="dot"
                            className="bg-background/90 backdrop-blur-sm"
                        />}
                    />
                    <Bar dataKey="sales" fill="url(#salesGradient)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ChartContainer>
        ) : (
             <div className="flex h-[350px] w-full flex-col items-center justify-center gap-2">
                <h3 className="text-lg font-semibold">No Sales Data</h3>
                <p className="text-sm text-muted-foreground">You have not made any sales recently.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
