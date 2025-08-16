import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, LogOut } from 'lucide-react';

export default function Dashboard() {
    const { auth } = usePage().props as any;

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Dashboard" />
            
            {/* Simple header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Dashboard
                        </h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">
                                Welcome, {auth.user?.first_name || auth.user?.name || 'User'}!
                            </span>
                            <Button variant="outline" asChild>
                                <Link href={route('logout')} method="post" as="button">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Welcome Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="h-5 w-5" />
                                <span>Welcome</span>
                            </CardTitle>
                            <CardDescription>
                                You are successfully logged in!
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Email:</span>
                                    <span className="font-medium">{auth.user?.email}</span>
                                </div>
                                {auth.user?.company_id && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Company ID:</span>
                                        <span className="font-medium">{auth.user.company_id}</span>
                                    </div>
                                )}
                                {auth.user?.role && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Role:</span>
                                        <span className="font-medium capitalize">{auth.user.role.replace('_', ' ')}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Common tasks and settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full" variant="outline" asChild>
                                <Link href={route('profile.edit')}>
                                    Edit Profile
                                </Link>
                            </Button>
                            
                            <Button className="w-full" variant="outline" asChild>
                                <Link href={route('password.edit')}>
                                    Change Password
                                </Link>
                            </Button>
                            
                            <Button className="w-full" variant="outline" asChild>
                                <Link href={route('appearance')}>
                                    Appearance Settings
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                </div>

                {/* Debug Info */}
                <div className="mt-8">
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-blue-900 mb-2">
                                    System Status: Working! ✅
                                </h2>
                                <p className="text-blue-700 mb-4">
                                    Your authentication system is working correctly.
                                </p>
                                <div className="text-xs text-blue-600 bg-blue-100 p-3 rounded">
                                    <p><strong>Debug Info:</strong></p>
                                    <p>User ID: {auth.user?.id}</p>
                                    <p>Email: {auth.user?.email}</p>
                                    {auth.user?.company_id && <p>Company ID: {auth.user.company_id}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}