import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';
import { 
    Building2, 
    LayoutGrid, 
    Settings, 
    Users, 
    Package,
    ShoppingCart,
    BarChart3,
    Store,
    Receipt,
    FileText,
    CreditCard,
    Truck,
    Tag
} from 'lucide-react';

interface NavItem {
    title: string;
    href: string;
    icon: any;
}

const companyNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'POS Terminal',
        href: '/company/pos',
        icon: ShoppingCart,
    },
    {
        title: 'Stores',
        href: '/company/stores',
        icon: Store,
    },
    {
        title: 'Products',
        href: '/company/products',
        icon: Package,
    },
    {
        title: 'Inventory',
        href: '/company/inventory',
        icon: Truck,
    },
    {
        title: 'Staff',
        href: '/company/staff',
        icon: Users,
    },
    {
        title: 'Transactions',
        href: '/company/transactions',
        icon: Receipt,
    },
    {
        title: 'Reports',
        href: '/company/reports',
        icon: BarChart3,
    },
    {
        title: 'Promotions',
        href: '/company/promotions',
        icon: Tag,
    },
    {
        title: 'Settings',
        href: '/company/settings',
        icon: Settings,
    },
];

export function CompanySidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-blue-600 text-white">
                                    <Building2 className="size-5" />
                                </div>
                                <div className="ml-1 grid flex-1 text-left text-sm">
                                    <span className="mb-0.5 truncate leading-tight font-semibold">
                                        Company POS
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        Point of Sale System
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={companyNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}