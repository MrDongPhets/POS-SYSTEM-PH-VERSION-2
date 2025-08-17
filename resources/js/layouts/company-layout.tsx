import { CompanySidebar } from '@/components/company-sidebar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, Search } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface CompanyLayoutProps extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
}

export default function CompanyLayout({ children, breadcrumbs = [], title }: CompanyLayoutProps) {
    return (
        <SidebarProvider>
            <CompanySidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                    <div className="flex items-center gap-2 px-4 flex-1">
                        <SidebarTrigger className="-ml-1" />
                        {breadcrumbs.length > 0 && (
                            <>
                                <div className="ml-2 h-4 w-px bg-sidebar-border" />
                                <Breadcrumbs items={breadcrumbs} />
                            </>
                        )}
                        
                        {title && !breadcrumbs.length && (
                            <h1 className="text-lg font-semibold ml-2">{title}</h1>
                        )}
                    </div>
                    
                    {/* Header Actions */}
                    <div className="flex items-center gap-2 px-4">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Search className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Bell className="h-4 w-4" />
                        </Button>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}