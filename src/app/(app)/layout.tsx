import AppSidebar from '@/components/layout/AppSidebar';
import AppHeader from '@/components/layout/AppHeader';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <SidebarProvider>
        <Sidebar>
          <AppSidebar />
        </Sidebar>
        <SidebarInset>
          <div className="flex flex-col h-screen">
            <AppHeader />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </SidebarInset>
      </SidebarProvider>
  );
}
