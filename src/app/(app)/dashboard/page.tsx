import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentSales from '@/components/dashboard/RecentSales';
import TopSellingProducts from '@/components/dashboard/TopSellingProducts';
import { getDashboardStats, getSales, getTopSellingProducts } from '@/lib/api';

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const recentSales = await getSales();
  const topProducts = await getTopSellingProducts();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
      <DashboardStats stats={stats} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentSales sales={recentSales} />
        </div>
        <div>
          <TopSellingProducts products={topProducts} />
        </div>
      </div>
    </div>
  );
}
