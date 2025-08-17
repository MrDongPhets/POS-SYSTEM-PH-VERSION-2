<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CompanyApproved
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user(); // Using Auth facade
        
        // Check if user has company
        if (!$user || !$user->company_id) {
            return redirect()->route('dashboard');
        }
        
        // Load company if not loaded
        if (!$user->relationLoaded('company')) {
            $user->load('company');
        }
        
        // Check if company is approved
        if (!$user->company || !$user->company->is_approved) {
            return redirect()->route('company.pending-approval');
        }
        
        // Check if company is active
        if (!$user->company->is_active) {
            Auth::logout();
            return redirect()->route('login')->withErrors([
                'email' => 'Your company account has been suspended.'
            ]);
        }
        
        return $next($request);
    }
}