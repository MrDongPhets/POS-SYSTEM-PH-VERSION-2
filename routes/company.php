<?php

use App\Http\Controllers\Company\DashboardController;
use App\Http\Controllers\Company\StoreController;
use App\Http\Controllers\Company\UserController;
use App\Http\Controllers\Company\ProductController;
use App\Http\Controllers\Company\POS\TransactionController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// Company Routes (Protected by auth and company middleware)
Route::middleware(['auth'])->prefix('company')->name('company.')->group(function () {
    
    // Pending approval page
    Route::get('pending-approval', function () {
        $user = Auth::user(); // Using Auth facade instead of auth() helper
        
        if ($user) {
            $user->load('company');
            
            if ($user->company && $user->company->is_approved) {
                return redirect()->route('company.dashboard');
            }
            
            return Inertia::render('auth/pending-approval', [
                'company' => $user->company ? $user->company->company_name : 'Your Company'
            ]);
        }
        
        return redirect()->route('login');
    })->name('pending-approval');
    
    // Routes that require approved company
    Route::middleware(['company.approved'])->group(function () {
        
        // Dashboard
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        
        // Store Management
        Route::resource('stores', StoreController::class);
        
        // User/Staff Management  
        Route::resource('users', UserController::class);
        
        // Product Management
        Route::resource('products', ProductController::class);
        
        // POS System
        Route::prefix('pos')->name('pos.')->group(function () {
            Route::get('/', [TransactionController::class, 'index'])->name('index');
            Route::post('transactions', [TransactionController::class, 'store'])->name('transactions.store');
            Route::get('transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
        });
        
        // Reports
        Route::prefix('reports')->name('reports.')->group(function () {
            Route::get('sales', function() {
                return Inertia::render('company/reports/sales');
            })->name('sales');
            
            Route::get('inventory', function() {
                return Inertia::render('company/reports/inventory');
            })->name('inventory');
        });
        
        // Settings
        Route::get('settings', function() {
            return Inertia::render('company/settings/index');
        })->name('settings');
    });
});