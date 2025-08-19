<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;

class JwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            // Check for token in various places
            $token = $this->getTokenFromRequest($request);
            
            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token not provided'
                ], 401);
            }

            // Validate and get user from token
            $user = JWTAuth::parseToken()->authenticate();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            // Check if user is active
            if (!$user->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'User account is deactivated'
                ], 403);
            }

            // Check company status
            $user->load('company');
            
            if (!$user->company->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Company account is suspended'
                ], 403);
            }

            if (!$user->company->is_approved) {
                return response()->json([
                    'success' => false,
                    'message' => 'Company is pending approval',
                    'pending_approval' => true
                ], 403);
            }

            // Add user to request for use in controllers
            $request->merge(['auth_user' => $user]);
            $request->setUserResolver(function () use ($user) {
                return $user;
            });

        } catch (TokenExpiredException $e) {
            // Token has expired
            return response()->json([
                'success' => false,
                'message' => 'Token has expired',
                'error' => 'token_expired'
            ], 401);
            
        } catch (TokenInvalidException $e) {
            // Token is invalid
            return response()->json([
                'success' => false,
                'message' => 'Token is invalid',
                'error' => 'token_invalid'
            ], 401);
            
        } catch (JWTException $e) {
            // Token not found
            return response()->json([
                'success' => false,
                'message' => 'Token error: ' . $e->getMessage(),
                'error' => 'token_error'
            ], 401);
        }

        return $next($request);
    }

    /**
     * Get token from request
     *
     * @param Request $request
     * @return string|null
     */
    private function getTokenFromRequest(Request $request)
    {
        // Check Authorization header
        if ($request->hasHeader('Authorization')) {
            $authHeader = $request->header('Authorization');
            if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
                return $matches[1];
            }
        }

        // Check query parameter
        if ($request->has('token')) {
            return $request->query('token');
        }

        // Check request body
        if ($request->has('access_token')) {
            return $request->input('access_token');
        }

        return null;
    }
}