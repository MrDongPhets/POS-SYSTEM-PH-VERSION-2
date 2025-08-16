import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Mail, CheckCircle } from 'lucide-react';

interface PendingApprovalProps {
    company: string;
}

export default function PendingApproval({ company }: PendingApprovalProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Pending Approval" />
            
            <div className="max-w-md w-full space-y-8">
                <Card>
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <Clock className="h-12 w-12 text-amber-500" />
                        </div>
                        <CardTitle className="text-2xl">Account Under Review</CardTitle>
                        <CardDescription>
                            Your business registration is being processed
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h3 className="font-medium text-amber-800 mb-2">
                                Welcome to our POS System, {company}!
                            </h3>
                            <p className="text-sm text-amber-700">
                                Your business account has been created successfully. We're currently reviewing your registration and will notify you once it's approved.
                            </p>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span className="text-sm">Account created</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Clock className="h-5 w-5 text-amber-500" />
                                <span className="text-sm">Under admin review</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">Email notification pending</span>
                            </div>
                        </div>
                        
                        <div className="border-t pt-4 mt-6">
                            <p className="text-xs text-gray-500 text-center mb-4">
                                This usually takes 1-2 business days. You'll receive an email once approved.
                            </p>
                            
                            <div className="flex flex-col space-y-2">
                                <Button asChild variant="outline" className="w-full">
                                    <Link href={route('logout')} method="post" as="button">
                                        Logout
                                    </Link>
                                </Button>
                                
                                <Button asChild variant="ghost" className="w-full">
                                    <Link href={route('home')}>
                                        Back to Home
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}