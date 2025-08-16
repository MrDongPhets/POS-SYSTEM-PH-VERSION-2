<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Simple dashboard route for testing
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        // Use Auth facade instead of auth() helper
        $user = Auth::user();
        
        // Simple check - if user has company_id, they're a company user
        if ($user && property_exists($user, 'company_id') && $user->company_id) {
            // Check if user is active
            if (!$user->is_active) {
                Auth::logout();
                return redirect()->route('login')->withErrors([
                    'email' => 'Your account is not active. Contact your administrator.'
                ]);
            }
            
            // Try to load company relationship
            $company = null;
            try {
                if (method_exists($user, 'company')) {
                    $company = $user->company;
                }
            } catch (Exception $e) {
                // If relationship fails, continue without it
            }
            
            // Check if company exists and is approved
            if ($company && !$company->is_approved) {
                return Inertia::render('auth/pending-approval', [
                    'company' => $company->company_name ?? 'Your Company'
                ]);
            }
            
            return Inertia::render('company/dashboard');
        }
        
        // Default dashboard for other users
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';