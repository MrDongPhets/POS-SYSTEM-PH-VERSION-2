<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the company dashboard.
     */
    public function index(): Response
    {
        $user = Auth::user(); // Using Auth facade instead of auth() helper
        
        if (!$user) {
            return redirect()->route('login');
        }
        
        $user->load('company', 'company.stores');
        
        // Get basic stats for the company
        $stats = [
            'total_stores' => $user->company->stores->count(),
            'total_users' => $user->company->users()->count(),
            'total_products' => 0, // Will be implemented when Product model is ready
            'today_sales' => 0, // Will be implemented when Transaction model is ready
        ];
        
        return Inertia::render('company/dashboard', [
            'company' => [
                'name' => $user->company->company_name,
                'code' => $user->company->company_code,
                'subscription_plan' => $user->company->subscription_plan,
                'is_approved' => $user->company->is_approved,
                'is_active' => $user->company->is_active,
            ],
            'user' => [
                'name' => $user->first_name . ' ' . $user->last_name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'stats' => $stats,
        ]);
    }
}