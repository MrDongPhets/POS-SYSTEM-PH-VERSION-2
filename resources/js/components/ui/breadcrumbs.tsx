import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Link 
                href="/admin/dashboard" 
                className="flex items-center hover:text-foreground transition-colors"
            >
                <Home className="h-4 w-4" />
            </Link>
            
            {items.map((item, index) => (
                <div key={item.href} className="flex items-center space-x-1">
                    <ChevronRight className="h-4 w-4" />
                    {index === items.length - 1 ? (
                        <span className="font-medium text-foreground">{item.title}</span>
                    ) : (
                        <Link 
                            href={item.href} 
                            className="hover:text-foreground transition-colors"
                        >
                            {item.title}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}