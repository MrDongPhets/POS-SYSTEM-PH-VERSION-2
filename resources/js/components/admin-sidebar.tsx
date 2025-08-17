import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';
import { 
    Building2, 
    LayoutGrid, 
    Settings, 
    Users, 
    Bell,
    BarChart3,
    Shield
} from 'lucide-react';
import AppLogoIcon from './app-logo-icon';

interface NavItem {
    title: string;
    href: string;
    icon: any;
}

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Companies',
        href: '/admin/companies',
        icon: Building2,
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Reports',
        href: '/admin/reports',
        icon: BarChart3,
    },
    {
        title: 'System Settings',
        href: '/admin/settings',
        icon: Settings,
    },
];

export function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-red-600 text-white">
                                    <Shield className="size-5" />
                                </div>
                                <div className="ml-1 grid flex-1 text-left text-sm">
                                    <span className="mb-0.5 truncate leading-tight font-semibold">
                                        Admin Panel
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        POS System
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={adminNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}