<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Test route to verify API is working
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!',
        'timestamp' => now()->toIso8601String()
    ]);
});

// Test JWT installation
Route::get('/test-jwt', function() {
    return response()->json([
        'jwt_installed' => class_exists(\Tymon\JWTAuth\Facades\JWTAuth::class),
        'jwt_secret_set' => !empty(config('jwt.secret')),
        'jwt_ttl' => config('jwt.ttl'),
    ]);
});

// V1 API Routes
Route::prefix('v1')->group(function () {
    
    // Auth routes - test without controller first
    Route::prefix('auth')->group(function () {
        
        // Test endpoints first
        Route::post('register', function (Request $request) {
            // For now, just return success to test the route works
            return response()->json([
                'success' => true,
                'message' => 'Register endpoint is working',
                'data_received' => [
                    'company_name' => $request->input('company_name'),
                    'email' => $request->input('email')
                ]
            ]);
        });
        
        Route::post('login', function (Request $request) {
            return response()->json([
                'success' => true,
                'message' => 'Login endpoint is working',
                'data_received' => [
                    'email' => $request->input('email')
                ]
            ]);
        });
        
        Route::get('test', function () {
            return response()->json([
                'message' => 'Auth test endpoint working'
            ]);
        });
    });
    
    // Test route for v1
    Route::get('test', function () {
        return response()->json([
            'message' => 'V1 API is working!'
        ]);
    });
});

// List all available routes (for debugging)
Route::get('/routes', function () {
    $routes = [];
    foreach (Route::getRoutes() as $route) {
        if (str_starts_with($route->uri(), 'api/')) {
            $routes[] = [
                'method' => implode('|', $route->methods()),
                'uri' => $route->uri(),
                'name' => $route->getName()
            ];
        }
    }
    return response()->json($routes);
});