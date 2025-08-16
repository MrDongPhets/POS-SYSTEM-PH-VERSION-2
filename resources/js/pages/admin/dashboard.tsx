import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    Building2, 
    Users, 
    Settings, 
    LogOut,
    CheckCircle,
    Clock,
    XCircle
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

export default function AdminDashboard({ stats, recentCompanies }: AdminDashboardProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Admin Dashboard" />
            
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                System Admin Dashboard
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage companies and system settings
                            </p>
                        </div>
                        
                        <div className="flex space-x-3">
                            <Button variant="outline">
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                            </Button>
                            
                            <Button variant="outline" asChild>
                                <Link href={route('admin.logout')} method="post" as="button">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Companies</p>
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
                                    <p className="text-sm text-gray-600">Pending Approvals</p>
                                    <p className="text-2xl font-bold">{stats?.pending_approvals || 0}</p>
                                </div>
                                <Clock className="h-8 w-8 text-amber-500" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Active Companies</p>
                                    <p className="text-2xl font-bold">{stats?.active_companies || 0}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Users</p>
                                    <p className="text-2xl font-bold">{stats?.total_users || 0}</p>
                                </div>
                                <Users className="h-8 w-8 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Company Management */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Building2 className="h-5 w-5" />
                                <span>Company Management</span>
                            </CardTitle>
                            <CardDescription>
                                View, approve, and manage registered companies
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Button className="w-full" asChild>
                                    <Link href={route('admin.companies.index')}>
                                        Manage Companies
                                    </Link>
                                </Button>
                                
                                <div className="text-xs text-gray-500 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Approved:</span>
                                        <span className="text-green-600">1</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Pending:</span>
                                        <span className="text-amber-600">0</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Settings */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Settings className="h-5 w-5" />
                                <span>System Settings</span>
                            </CardTitle>
                            <CardDescription>
                                Configure system-wide settings and preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" variant="outline" asChild>
                                <Link href={route('admin.settings')}>
                                    System Settings
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Latest system events
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="text-sm">
                                <div className="flex items-center space-x-2 text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Test Restaurant approved</span>
                                </div>
                                <p className="text-xs text-gray-500 ml-6">Just now</p>
                            </div>
                            
                            <div className="text-sm">
                                <div className="flex items-center space-x-2 text-blue-600">
                                    <Building2 className="h-4 w-4" />
                                    <span>Company registered</span>
                                </div>
                                <p className="text-xs text-gray-500 ml-6">1 minute ago</p>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Welcome Message */}
                <div className="mt-8">
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-blue-900 mb-2">
                                    Welcome to the Admin Panel! 🛠️
                                </h2>
                                <p className="text-blue-700 mb-4">
                                    You have full administrative access to manage companies, approve registrations, and configure system settings.
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <Button asChild>
                                        <Link href={route('admin.companies.index')}>
                                            View Companies
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href={route('admin.settings')}>
                                            System Settings
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}