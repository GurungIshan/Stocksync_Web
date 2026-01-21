
import DashboardStats from '@/components/dashboard/DashboardStats';
import UserSales from '@/components/dashboard/UserSales';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
      <DashboardStats />
      <div className="grid grid-cols-1 gap-6">
        <UserSales />
      </div>
    </div>
  );
}
