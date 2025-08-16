<?php

use App\Http\Controllers\Company\DashboardController;
use App\Http\Controllers\Company\StoreController;
use App\Http\Controllers\Company\UserController;
use App\Http\Controllers\Company\ProductController;
use App\Http\Controllers\Company\POS\TransactionController;
use Illuminate\Support\Facades\Route;

// Company Routes (Protected by auth and approved company middleware)
Route::middleware(['auth', 'company.approved'])->prefix('company')->name('company.')->group(function () {
    
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
            return inertia('company/reports/sales');
        })->name('sales');
        
        Route::get('inventory', function() {
            return inertia('company/reports/inventory');
        })->name('inventory');
    });
    
    // Settings
    Route::get('settings', function() {
        return inertia('company/settings/index');
    })->name('settings');
    
});