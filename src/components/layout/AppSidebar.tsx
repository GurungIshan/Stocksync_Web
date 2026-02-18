'use client';

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { navLinks } from '@/lib/nav-links';
import { Package } from 'lucide-react';

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Package className="h-6 w-6" />
            </div>
          <span className="text-xl font-semibold font-headline text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            StockSync
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu className="gap-2">
          {navLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(link.href)}
                  tooltip={link.label}
                  className="h-10 justify-start"
                >
                  <link.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
