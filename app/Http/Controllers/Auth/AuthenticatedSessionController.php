<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user(); // Using Auth facade for better IDE support

        // Check if user is active
        if (!$user->is_active) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            
            return redirect()->route('login')->withErrors([
                'email' => 'Your account has been deactivated. Please contact your administrator.',
            ]);
        }

        // Check if user has company_id (company user)
        if ($user->company_id) {
            // Load company relationship
            $user->load('company');
            
            // Check if company is approved
            if ($user->company && !$user->company->is_approved) {
                return redirect()->route('company.pending-approval');
            }
            
            // Check if company is active
            if ($user->company && !$user->company->is_active) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                
                return redirect()->route('login')->withErrors([
                    'email' => 'Your company account has been suspended. Please contact support.',
                ]);
            }
        }

        // Update last login
        DB::table('users')->where('id', $user->id)->update(['last_login_at' => now()]);

        // Redirect based on user type
        $intended = redirect()->intended()->getTargetUrl();
        return $this->redirectUser($user, $intended);
    }

    /**
     * Redirect user based on their role and company status.
     */
    private function redirectUser(User $user, ?string $intended = null): RedirectResponse
    {
        // If there's an intended URL and it's safe, use it
        if ($intended && $this->isIntendedUrlSafe($intended)) {
            return redirect($intended);
        }

        // Company users go to company dashboard
        if ($user->company_id) {
            return redirect()->route('company.dashboard');
        }

        // Default users go to regular dashboard
        return redirect()->route('dashboard');
    }

    /**
     * Check if intended URL is safe to redirect to.
     */
    private function isIntendedUrlSafe(string $url): bool
    {
        // Don't redirect to logout, login, or external URLs
        $unsafePatterns = [
            '/logout',
            '/login',
            '/admin/login',
            'http://',
            'https://',
            '//'
        ];

        foreach ($unsafePatterns as $pattern) {
            if (str_contains($url, $pattern)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}