<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     * This registers a new company with its first admin user.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:companies,email',
            'phone' => 'nullable|string|max:50',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Generate company code
        $companyCode = $this->generateCompanyCode($request->company_name);

        // Create company
        $company = Company::create([
            'company_code' => $companyCode,
            'company_name' => $request->company_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'subscription_plan' => 'trial',
            'trial_ends_at' => now()->addDays(30),
            'is_active' => true,
            'is_approved' => false, // Requires admin approval
        ]);

        // Create company admin user
        $user = User::create([
            'company_id' => $company->id,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'company_admin',
            'can_override_prices' => true,
            'can_apply_discounts' => true,
            'can_process_returns' => true,
            'can_void_transactions' => true,
            'max_discount_percent' => 50.00,
            'is_active' => false, // Will be activated when company is approved
        ]);

        // Update company user count
        $company->increment('current_user_count');

        event(new Registered($user));

        // Don't auto-login - require approval first
        return redirect()->route('login')->with('status', 
            'Registration successful! Your account is pending approval. You will receive an email once approved.');
    }

    /**
     * Generate unique company code.
     */
    private function generateCompanyCode(string $companyName): string
    {
        $base = strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $companyName), 0, 4));
        $counter = 1;
        
        do {
            $code = $base . str_pad($counter, 3, '0', STR_PAD_LEFT);
            $counter++;
        } while (Company::where('company_code', $code)->exists());
        
        return $code;
    }
}