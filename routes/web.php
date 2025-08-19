<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Generic dashboard route (for non-company users or fallback)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = Auth::user();
        
        // If user has company_id, redirect to company dashboard
        if ($user && $user->company_id) {
            return redirect()->route('company.dashboard');
        }
        
        // Regular dashboard for non-company users
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/test-setup', function() {
    return response()->json([
        'laravel_version' => app()->version(),
        'php_version' => PHP_VERSION,
        'jwt_class_exists' => class_exists(\Tymon\JWTAuth\Facades\JWTAuth::class),
        'api_routes_path' => base_path('routes/api.php'),
        'api_routes_exists' => file_exists(base_path('routes/api.php')),
    ]);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/company.php';