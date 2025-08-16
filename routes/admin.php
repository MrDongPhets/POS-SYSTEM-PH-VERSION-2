<?php

use App\Http\Controllers\Admin\Auth\AdminAuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\CompanyController;
use Illuminate\Support\Facades\Route;

// Admin Authentication Routes
Route::prefix('admin')->name('admin.')->group(function () {
    
    // Admin Login Routes (Guest)
    Route::middleware('guest:admin')->group(function () {
        Route::get('login', [AdminAuthController::class, 'create'])->name('login');
        Route::post('login', [AdminAuthController::class, 'store'])->name('login.store');
    });

    // Admin Protected Routes
    Route::middleware('auth:admin')->group(function () {
        
        // Dashboard
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        
        // Companies Management
        Route::resource('companies', CompanyController::class);
        Route::post('companies/{company}/approve', [CompanyController::class, 'approve'])->name('companies.approve');
        Route::post('companies/{company}/suspend', [CompanyController::class, 'suspend'])->name('companies.suspend');
        Route::post('companies/{company}/activate', [CompanyController::class, 'activate'])->name('companies.activate');
        
        // System Settings
        Route::get('settings', function() {
            return inertia('admin/settings/index');
        })->name('settings');
        
        // Logout
        Route::post('logout', [AdminAuthController::class, 'destroy'])->name('logout');
    });
});