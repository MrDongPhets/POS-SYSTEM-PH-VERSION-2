<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use App\Models\SystemUser;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the admin dashboard.
     */
    public function index(): Response
    {
        // Get basic stats
        $stats = [
            'total_companies' => Company::count(),
            'pending_approvals' => Company::where('is_approved', false)->count(),
            'active_companies' => Company::where('is_active', true)->where('is_approved', true)->count(),
            'total_users' => User::count(),
        ];

        // Get recent companies (last 5)
        $recentCompanies = Company::with('createdBy')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($company) {
                return [
                    'id' => $company->id,
                    'company_name' => $company->company_name,
                    'email' => $company->email,
                    'is_approved' => $company->is_approved,
                    'created_at' => $company->created_at,
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentCompanies' => $recentCompanies,
        ]);
    }
}