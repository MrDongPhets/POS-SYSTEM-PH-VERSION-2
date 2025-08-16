<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    /**
     * Display a listing of companies.
     */
    public function index(): Response
    {
        $companies = Company::query()
            ->withCount(['users'])
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/companies/index', [
            'companies' => $companies,
        ]);
    }

    /**
     * Show the form for creating a new company.
     */
    public function create(): Response
    {
        return Inertia::render('admin/companies/create');
    }

    /**
     * Store a newly created company in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        // Implementation for creating companies
        return redirect()->route('admin.companies.index');
    }

    /**
     * Display the specified company.
     */
    public function show(Company $company): Response
    {
        $company->load(['users', 'createdBy', 'approvedBy']);

        return Inertia::render('admin/companies/show', [
            'company' => $company,
        ]);
    }

    /**
     * Show the form for editing the specified company.
     */
    public function edit(Company $company): Response
    {
        return Inertia::render('admin/companies/edit', [
            'company' => $company,
        ]);
    }

    /**
     * Update the specified company in storage.
     */
    public function update(Request $request, Company $company): RedirectResponse
    {
        // Implementation for updating companies
        return redirect()->route('admin.companies.show', $company);
    }

    /**
     * Remove the specified company from storage.
     */
    public function destroy(Company $company): RedirectResponse
    {
        // Implementation for deleting companies
        return redirect()->route('admin.companies.index');
    }

    /**
     * Approve a company.
     */
    public function approve(Request $request, Company $company): RedirectResponse
    {
        $company->update([
            'is_approved' => true,
            'approved_by' => auth('admin')->id(),
            'approved_at' => now(),
        ]);

        // Activate the company admin user
        $company->users()->where('role', 'company_admin')->update([
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Company approved successfully!');
    }

    /**
     * Suspend a company.
     */
    public function suspend(Request $request, Company $company): RedirectResponse
    {
        $company->update([
            'is_active' => false,
        ]);

        // Deactivate all users
        $company->users()->update([
            'is_active' => false,
        ]);

        return redirect()->back()->with('success', 'Company suspended successfully!');
    }

    /**
     * Activate a company.
     */
    public function activate(Request $request, Company $company): RedirectResponse
    {
        $company->update([
            'is_active' => true,
        ]);

        // Reactivate all users (only if company is approved)
        if ($company->is_approved) {
            $company->users()->update([
                'is_active' => true,
            ]);
        }

        return redirect()->back()->with('success', 'Company activated successfully!');
    }
}