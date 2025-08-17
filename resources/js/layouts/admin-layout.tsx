import { AdminSidebar } from '@/components/admin-sidebar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { type PropsWithChildren } from 'react';

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface AdminLayoutProps extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItem[];
}

export default function AdminLayout({ children, breadcrumbs = [] }: AdminLayoutProps) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        {breadcrumbs.length > 0 && (
                            <>
                                <div className="ml-2 h-4 w-px bg-sidebar-border" />
                                <Breadcrumbs items={breadcrumbs} />
                            </>
                        )}
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}