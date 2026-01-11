import { LayoutDashboard, Package, ShoppingCart, AlertTriangle, Settings } from 'lucide-react';

export const navLinks = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/products',
    label: 'Products',
    icon: Package,
  },
  {
    href: '/sales',
    label: 'Sales (POS)',
    icon: ShoppingCart,
  },
  {
    href: '/alerts',
    label: 'Reorder Alerts',
    icon: AlertTriangle,
  },
];
