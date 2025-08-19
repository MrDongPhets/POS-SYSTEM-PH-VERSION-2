<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'refresh']]);
    }

    /**
     * Register a new company and admin user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // Company Information
            'company_name' => 'required|string|max:255',
            'company_email' => 'required|email|unique:companies,email',
            'company_phone' => 'required|string|max:50',
            'company_address' => 'required|string',
            'tin_number' => 'nullable|string|max:50',
            
            // Admin User Information
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            \DB::beginTransaction();

            // Create Company
            $company = Company::create([
                'company_code' => $this->generateCompanyCode($request->company_name),
                'company_name' => $request->company_name,
                'email' => $request->company_email,
                'phone' => $request->company_phone,
                'address' => $request->company_address,
                'tin_number' => $request->tin_number,
                'subscription_plan' => 'trial',
                'is_approved' => false, // Requires admin approval
                'is_active' => true,
                'created_by' => null, // Self-registered
            ]);

            // Create Company Admin User
            $user = User::create([
                'company_id' => $company->id,
                'employee_code' => 'ADM001',
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'role' => 'company_admin',
                'is_active' => true,
                'can_override_prices' => true,
                'can_apply_discounts' => true,
                'can_process_returns' => true,
                'can_void_transactions' => true,
                'max_discount_percent' => 100.00,
            ]);

            // Create default store
            $store = $company->stores()->create([
                'store_code' => 'MAIN',
                'store_name' => 'Main Store',
                'address' => $request->company_address,
                'is_active' => true,
            ]);

            // Assign user to store
            $user->store_id = $store->id;
            $user->save();

            \DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Registration successful! Your company is pending approval.',
                'data' => [
                    'company' => $company,
                    'user' => $user->makeHidden(['password'])
                ]
            ], 201);

        } catch (\Exception $e) {
            \DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a JWT via given credentials.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
            'company_code' => 'nullable|string', // Optional for multi-company users
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        // If company_code is provided, find user within that company
        if ($request->has('company_code')) {
            $company = Company::where('company_code', $request->company_code)->first();
            
            if (!$company) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid company code.'
                ], 401);
            }

            $user = User::where('email', $credentials['email'])
                       ->where('company_id', $company->id)
                       ->first();

            if (!$user || !Hash::check($credentials['password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials.'
                ], 401);
            }
        } else {
            // Standard login without company code
            if (!$token = auth('api')->attempt($credentials)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials.'
                ], 401);
            }

            $user = auth('api')->user();
        }

        // Additional checks
        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been deactivated.'
            ], 403);
        }

        // Load relationships
        $user->load(['company', 'store']);

        // Check company status
        if (!$user->company->is_approved) {
            return response()->json([
                'success' => false,
                'message' => 'Your company is pending approval.',
                'pending_approval' => true
            ], 403);
        }

        if (!$user->company->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your company account has been suspended.'
            ], 403);
        }

        // Generate token if not already generated
        if (!isset($token)) {
            $token = JWTAuth::fromUser($user);
        }

        // Update last login
        $user->update(['last_login_at' => now()]);

        return $this->respondWithToken($token, $user);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        $user = auth('api')->user();
        $user->load(['company', 'store']);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth('api')->logout();

        return response()->json([
            'success' => true,
            'message' => 'Successfully logged out'
        ]);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        try {
            $token = auth('api')->refresh();
            $user = auth('api')->user();
            
            return $this->respondWithToken($token, $user);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Could not refresh token'
            ], 401);
        }
    }

    /**
     * Change password
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = auth('api')->user();

        // Check current password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect.'
            ], 401);
        }

        // Update password
        $user->update([
            'password' => Hash::make($request->new_password),
            'password_changed_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully.'
        ]);
    }

    /**
     * Get the token array structure.
     *
     * @param string $token
     * @param User $user
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token, $user)
    {
        return response()->json([
            'success' => true,
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $user->makeHidden(['password']),
            'company' => $user->company,
            'store' => $user->store
        ]);
    }

    /**
     * Generate unique company code
     *
     * @param string $companyName
     * @return string
     */
    private function generateCompanyCode($companyName)
    {
        $prefix = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $companyName), 0, 3));
        $suffix = str_pad(Company::count() + 1, 3, '0', STR_PAD_LEFT);
        
        $code = $prefix . $suffix;
        
        // Ensure uniqueness
        while (Company::where('company_code', $code)->exists()) {
            $suffix = str_pad((int)$suffix + 1, 3, '0', STR_PAD_LEFT);
            $code = $prefix . $suffix;
        }
        
        return $code;
    }
}