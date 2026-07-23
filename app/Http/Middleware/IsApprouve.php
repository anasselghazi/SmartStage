<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsApprouve
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // L-Admin dima m3diz w l-user khass 'approuve' (bila accent ou majuscule)
        if ($user->role === 'admin' || strtolower($user->statut) === 'approuve') {
            return $next($request);
        }

        return response()->json(['message' => 'Compte non approuvé.'], 403);
    }
}