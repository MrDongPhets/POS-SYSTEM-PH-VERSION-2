import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AuthService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { data, setData } = useForm({
        email: '',
        password: '',
        company_code: '',
        remember: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await AuthService.login(
                data.email,
                data.password,
                data.company_code || undefined
            );

            if (response.success) {
                // Check if company is approved
                if (response.company && !response.company.is_approved) {
                    window.location.href = '/company/pending-approval';
                } else {
                    // Redirect to dashboard
                    window.location.href = '/company/dashboard';
                }
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.errors) {
                const firstError = Object.values(err.response.data.errors)[0];
                setError(Array.isArray(firstError) ? firstError[0] : firstError as string);
            } else {
                setError('An error occurred during login. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        POS System Login
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        
                        <div className="space-y-2">
                            <Label htmlFor="company_code">
                                Company Code (Optional)
                            </Label>
                            <Input
                                id="company_code"
                                type="text"
                                placeholder="Enter company code"
                                value={data.company_code}
                                onChange={(e) => setData('company_code', e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@company.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    disabled={isLoading}
                                />
                                <Label htmlFor="remember" className="ml-2 text-sm">
                                    Remember me
                                </Label>
                            </div>
                            
                            <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                                Forgot password?
                            </a>
                        </div>
                    </CardContent>
                    
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                        
                        <div className="text-center text-sm">
                            <span className="text-gray-600">Don't have an account? </span>
                            <a href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                                Register your company
                            </a>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}