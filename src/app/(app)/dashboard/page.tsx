
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentSales from '@/components/dashboard/RecentSales';
import TopSellingProducts from '@/components/dashboard/TopSellingProducts';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
      <DashboardStats />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentSales />
        </div>
        <div>
          <TopSellingProducts />
        </div>
      </div>
    </div>
  );
}
