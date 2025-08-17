import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/layouts/admin-layout';
import { 
    Building2, 
    CheckCircle, 
    Clock, 
    XCircle,
    MoreHorizontal,
    Eye,
    UserCheck,
    Ban,
    Play,
    Search
} from 'lucide-react';
import { useState } from 'react';

interface Company {
    id: number;
    company_name: string;
    email: string;
    phone?: string;
    subscription_plan: string;
    is_active: boolean;
    is_approved: boolean;
    users_count: number;
    created_at: string;
}

interface CompaniesIndexProps {
    companies: {
        data: Company[];
        links: any[];
        meta: any;
    };
}

const breadcrumbs = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Companies', href: '/admin/companies' },
];

export default function CompaniesIndex({ companies }: CompaniesIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const handleApprove = (companyId: number) => {
        router.post(`/admin/companies/${companyId}/approve`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Show success message
            }
        });
    };

    const handleSuspend = (companyId: number) => {
        router.post(`/admin/companies/${companyId}/suspend`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Show success message
            }
        });
    };

    const handleActivate = (companyId: number) => {
        router.post(`/admin/companies/${companyId}/activate`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Show success message
            }
        });
    };

    const getStatusBadge = (company: Company) => {
        if (!company.is_approved) {
            return (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending Approval
                </Badge>
            );
        }
        
        if (!company.is_active) {
            return (
                <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    Suspended
                </Badge>
            );
        }
        
        return (
            <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
            </Badge>
        );
    };

    const filteredCompanies = companies.data.filter(company => {
        const matchesSearch = company.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            company.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'pending') return matchesSearch && !company.is_approved;
        if (activeTab === 'active') return matchesSearch && company.is_approved && company.is_active;
        if (activeTab === 'suspended') return matchesSearch && !company.is_active;
        
        return matchesSearch;
    });

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies Management" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
                        <p className="text-muted-foreground">
                            Manage company registrations and approvals
                        </p>
                    </div>
                    
                    <Button>
                        <Building2 className="w-4 h-4 mr-2" />
                        Add Company
                    </Button>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Search companies by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all">All Companies</TabsTrigger>
                        <TabsTrigger value="pending">
                            Pending 
                            {companies.data.filter(c => !c.is_approved).length > 0 && (
                                <Badge className="ml-2 px-1.5 py-0.5 text-xs">
                                    {companies.data.filter(c => !c.is_approved).length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="suspended">Suspended</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="space-y-4">
                        {filteredCompanies.length > 0 ? (
                            <div className="grid gap-4">
                                {filteredCompanies.map((company) => (
                                    <Card key={company.id}>
                                        <CardContent className="pt-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="bg-blue-100 p-3 rounded-full">
                                                        <Building2 className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h3 className="font-semibold text-lg">{company.company_name}</h3>
                                                        <p className="text-sm text-muted-foreground">{company.email}</p>
                                                        {company.phone && (
                                                            <p className="text-sm text-muted-foreground">{company.phone}</p>
                                                        )}
                                                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                                            <span>Plan: {company.subscription_plan}</span>
                                                            <span>•</span>
                                                            <span>{company.users_count} users</span>
                                                            <span>•</span>
                                                            <span>Created {new Date(company.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-3">
                                                    {getStatusBadge(company)}
                                                    
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/companies/${company.id}`}>
                                                                    <Eye className="w-4 h-4 mr-2" />
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            
                                                            <DropdownMenuSeparator />
                                                            
                                                            {!company.is_approved && (
                                                                <DropdownMenuItem 
                                                                    onClick={() => handleApprove(company.id)}
                                                                    className="text-green-600"
                                                                >
                                                                    <UserCheck className="w-4 h-4 mr-2" />
                                                                    Approve Company
                                                                </DropdownMenuItem>
                                                            )}
                                                            
                                                            {company.is_active ? (
                                                                <DropdownMenuItem 
                                                                    onClick={() => handleSuspend(company.id)}
                                                                    className="text-red-600"
                                                                >
                                                                    <Ban className="w-4 h-4 mr-2" />
                                                                    Suspend
                                                                </DropdownMenuItem>
                                                            ) : (
                                                                <DropdownMenuItem 
                                                                    onClick={() => handleActivate(company.id)}
                                                                    className="text-green-600"
                                                                >
                                                                    <Play className="w-4 h-4 mr-2" />
                                                                    Activate
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="pt-12 pb-12 text-center">
                                    <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No companies found</h3>
                                    <p className="text-muted-foreground">
                                        {searchQuery ? 'Try adjusting your search criteria.' : 'No companies have been registered yet.'}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}