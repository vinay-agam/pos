'use client';

import { ReactNode } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings, 
  Boxes,
  UserCog,
  Home,
  LogOut
} from 'lucide-react';
import { useShop } from '@/hooks/useShop';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: 'dashboard', icon: LayoutDashboard },
  // Dashboard sub-pages
  { name: 'Products', href: 'dashboard/products', icon: Package },
  { name: 'POS', href: 'pos', icon: ShoppingBag },
  { name: 'Sales', href: 'dashboard/sales', icon: ShoppingBag },
  { name: 'Customers', href: 'dashboard/customers', icon: Users },
  { name: 'Inventory', href: 'dashboard/inventory', icon: Boxes },
  { name: 'Reports', href: 'dashboard/reports', icon: BarChart3 },
  { name: 'Employees', href: 'dashboard/employees', icon: UserCog },
  { name: 'Settings', href: 'dashboard/settings', icon: Settings },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const shopId = params?.shopId as string;
  const { shopData } = useShop();

  const isActive = (href: string) => {
    return pathname?.includes(`/${href}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-50 hidden md:block">
        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">{shopData?.shopName || shopId}</h2>
            <p className="text-sm text-gray-500">{shopId}</p>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const href = `/shop/${shopId}/${item.href}`;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push(`/shop/${shopId}`)}
            >
              <Home className="h-4 w-4 mr-2" />
              Shop Home
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start mt-2"
              onClick={() => router.push('/')}
            >
              <LogOut className="h-4 w-4 mr-2" />
              All Shops
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Toggle mobile menu - you can enhance this with a proper mobile menu component
            const sidebar = document.querySelector('.mobile-sidebar');
            sidebar?.classList.toggle('hidden');
          }}
        >
          Menu
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <div className="mobile-sidebar hidden fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-40 md:hidden">
        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">{shopData?.shopName || shopId}</h2>
            <p className="text-sm text-gray-500">{shopId}</p>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const href = `/shop/${shopId}/${item.href}`;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push(`/shop/${shopId}`)}
            >
              <Home className="h-4 w-4 mr-2" />
              Shop Home
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start mt-2"
              onClick={() => router.push('/')}
            >
              <LogOut className="h-4 w-4 mr-2" />
              All Shops
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

