'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Bell,
  Home,
  LogOut,
  Package,
  Search,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment, useMemo } from 'react';
import { removeToken } from '@/lib/auth';

const UserMenu = () => {
    const router = useRouter();

    const handleLogout = () => {
      removeToken();
      router.push('/login');
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
            >
                <User className="h-5 w-5" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4"/>Logout</DropdownMenuItem>
            </DropdownMenuContent>
      </DropdownMenu>
    )
}

const AppBreadcrumb = () => {
  const pathname = usePathname();
  const segments = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);

  if (segments.length === 0) {
    return (
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/dashboard" passHref legacyBehavior>
              <BreadcrumbLink asChild>
                <a><Home className="h-4 w-4" /></a>
              </BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/dashboard" passHref legacyBehavior>
            <BreadcrumbLink asChild>
              <a><Home className="h-4 w-4" /></a>
            </BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;
          const name = segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                ) : (
                  <Link href={href} passHref legacyBehavior>
                    <BreadcrumbLink asChild>
                      <a>{name}</a>
                    </BreadcrumbLink>
                  </Link>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};


export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <AppBreadcrumb />
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <Button variant="outline" size="icon">
        <Bell className="h-5 w-5" />
      </Button>
      <UserMenu />
    </header>
  );
}
