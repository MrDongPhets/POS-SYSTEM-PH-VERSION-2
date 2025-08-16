import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    Store, 
    Users, 
    ShoppingCart, 
    BarChart3, 
    Settings,
    Package
} from 'lucide-react';

export default function CompanyDashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Company Dashboard" />
            
            {/* Simple header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Company Dashboard
                        </h1>
                        <Button variant="outline">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Store Management */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Store className="h-5 w-5" />
                                <span>Store Management</span>
                            </CardTitle>
                            <CardDescription>
                                Manage your store locations and settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full">
                                Manage Stores
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Staff Management */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Users className="h-5 w-5" />
                                <span>Staff Management</span>
                            </CardTitle>
                            <CardDescription>
                                Add and manage your team members
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" variant="outline">
                                Manage Staff
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Product Catalog */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Package className="h-5 w-5" />
                                <span>Product Catalog</span>
                            </CardTitle>
                            <CardDescription>
                                Manage your inventory and products
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" variant="outline">
                                Manage Products
                            </Button>
                        </CardContent>
                    </Card>

                    {/* POS System */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <ShoppingCart className="h-5 w-5" />
                                <span>POS System</span>
                            </CardTitle>
                            <CardDescription>
                                Access the point of sale terminal
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full">
                                Open POS
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Sales Reports */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <BarChart3 className="h-5 w-5" />
                                <span>Sales Reports</span>
                            </CardTitle>
                            <CardDescription>
                                View sales analytics and reports
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" variant="outline">
                                View Reports
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                            <CardDescription>
                                Today's overview
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Total Sales:</span>
                                <span className="font-semibold">₱0.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Transactions:</span>
                                <span className="font-semibold">0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Active Staff:</span>
                                <span className="font-semibold">1</span>
                            </div>
                        </CardContent>
                    </Card>

                </div>
                
                {/* Welcome message */}
                <div className="mt-8">
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-blue-900 mb-2">
                                    Welcome to Your POS System! 🎉
                                </h2>
                                <p className="text-blue-700 mb-4">
                                    Your account has been approved and you're ready to start managing your business.
                                </p>
                                <Button>
                                    Get Started
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}