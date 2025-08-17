import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { 
    Building2, 
    Users, 
    Settings, 
    CheckCircle,
    Clock,
    AlertTriangle,
    TrendingUp
} from 'lucide-react';

interface AdminDashboardProps {
    stats?: {
        total_companies: number;
        pending_approvals: number;
        active_companies: number;
        total_users: number;
    };
    recentCompanies?: any[];
}

const breadcrumbs = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

export default function AdminDashboard({ stats, recentCompanies }: AdminDashboardProps) {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Companies</p>
                                <p className="text-2xl font-bold">{stats?.total_companies || 0}</p>
                            </div>
                            <Building2 className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                                <p className="text-2xl font-bold text-amber-600">{stats?.pending_approvals || 0}</p>
                            </div>
                            <Clock className="h-8 w-8 text-amber-500" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Companies</p>
                                <p className="text-2xl font-bold text-green-600">{stats?.active_companies || 0}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                                <p className="text-2xl font-bold">{stats?.total_users || 0}</p>
                            </div>
                            <Users className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Quick Actions */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Manage your system efficiently</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full justify-start" asChild>
                            <Link href={route('admin.companies.index')}>
                                <Building2 className="h-4 w-4 mr-2" />
                                Manage Companies
                                {stats?.pending_approvals && stats.pending_approvals > 0 && (
                                    <span className="ml-auto bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                                        {stats.pending_approvals}
                                    </span>
                                )}
                            </Link>
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href={route('admin.settings')}>
                                <Settings className="h-4 w-4 mr-2" />
                                System Settings
                            </Link>
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            View Reports
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Companies */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Companies</CardTitle>
                        <CardDescription>Latest company registrations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentCompanies && recentCompanies.length > 0 ? (
                                recentCompanies.map((company) => (
                                    <div key={company.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-blue-100 p-2 rounded-full">
                                                <Building2 className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{company.company_name}</p>
                                                <p className="text-sm text-muted-foreground">{company.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {company.is_approved ? (
                                                <span className="inline-flex items-center text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Approved
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center text-amber-700 bg-amber-100 px-2 py-1 rounded-full text-xs">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6">
                                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No companies registered yet</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Alerts */}
            {stats?.pending_approvals && stats.pending_approvals > 0 && (
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                            <div>
                                <p className="font-medium text-amber-900">
                                    Action Required: {stats.pending_approvals} companies awaiting approval
                                </p>
                                <p className="text-sm text-amber-700 mt-1">
                                    Review and approve pending company registrations to activate their accounts.
                                </p>
                            </div>
                            <Button asChild>
                                <Link href={route('admin.companies.index', { filter: 'pending' })}>
                                    Review Now
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </AdminLayout>
    );
}