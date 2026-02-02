
import DashboardStats from '@/components/dashboard/DashboardStats';
import UserSales from '@/components/dashboard/UserSales';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground mt-1">A real-time overview of your inventory and sales performance.</p>
      </div>
      <DashboardStats />
      <UserSales />
    </div>
  );
}
