import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CompanyLayout from '@/layouts/company-layout';
import { 
    Store, 
    Users, 
    ShoppingCart, 
    BarChart3, 
    Settings,
    Package,
    TrendingUp,
    DollarSign,
    Receipt,
    AlertCircle,
    CheckCircle,
    Clock
} from 'lucide-react';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function CompanyDashboard() {
    // Mock data - replace with real data from props
    const stats = {
        todaySales: 1250.50,
        todayTransactions: 23,
        activeStores: 1,
        totalProducts: 45,
        lowStockItems: 3,
        staffOnline: 2
    };

    return (
        <CompanyLayout breadcrumbs={breadcrumbs}>
            <Head title="Company Dashboard" />
            
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Today's Sales</p>
                                <p className="text-2xl font-bold">₱{stats.todaySales.toLocaleString()}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                                <p className="text-2xl font-bold">{stats.todayTransactions}</p>
                            </div>
                            <Receipt className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Stores</p>
                                <p className="text-2xl font-bold">{stats.activeStores}</p>
                            </div>
                            <Store className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Products</p>
                                <p className="text-2xl font-bold">{stats.totalProducts}</p>
                            </div>
                            <Package className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Quick Actions */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Start your most common tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full justify-start" size="lg" asChild>
                            <Link href="/company/pos">
                                <ShoppingCart className="h-5 w-5 mr-3" />
                                Open POS Terminal
                            </Link>
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/company/products">
                                <Package className="h-4 w-4 mr-3" />
                                Manage Products
                            </Link>
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/company/staff">
                                <Users className="h-4 w-4 mr-3" />
                                Manage Staff
                            </Link>
                        </Button>

                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/company/reports">
                                <BarChart3 className="h-4 w-4 mr-3" />
                                View Reports
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Activity & Alerts */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>System Status</CardTitle>
                        <CardDescription>Current alerts and notifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Low Stock Alert */}
                            {stats.lowStockItems > 0 && (
                                <div className="flex items-center justify-between p-3 border rounded-lg bg-orange-50 border-orange-200">
                                    <div className="flex items-center space-x-3">
                                        <AlertCircle className="h-5 w-5 text-orange-600" />
                                        <div>
                                            <p className="font-medium text-orange-900">Low Stock Alert</p>
                                            <p className="text-sm text-orange-700">{stats.lowStockItems} products running low</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href="/company/inventory">
                                            View Items
                                        </Link>
                                    </Button>
                                </div>
                            )}
                            
                            {/* Staff Status */}
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="font-medium">Staff Online</p>
                                        <p className="text-sm text-muted-foreground">{stats.staffOnline} employees currently active</p>
                                    </div>
                                </div>
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                    Active
                                </Badge>
                            </div>

                            {/* System Status */}
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="font-medium">POS System</p>
                                        <p className="text-sm text-muted-foreground">All systems operational</p>
                                    </div>
                                </div>
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                    Online
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Today's Performance */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales Growth</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12%</div>
                        <p className="text-xs text-muted-foreground">
                            vs yesterday
                        </p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₱54.37</div>
                        <p className="text-xs text-muted-foreground">
                            +4% from last week
                        </p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Peak Hours</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2-4 PM</div>
                        <p className="text-xs text-muted-foreground">
                            Busiest time today
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Welcome Message */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
          
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-blue-900 mb-2">
                                Welcome to Your POS System! 🎉
                            </h2>
                            <p className="text-blue-700 mb-4">
                                Your business account is active and ready. Start processing sales and managing your inventory.
                            </p>
                            <div className="flex space-x-3">
                                <Button asChild>
                                    <Link href="/company/pos">
                                        Start Selling
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/company/settings">
                                        Setup Store
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </CompanyLayout>
    );
}