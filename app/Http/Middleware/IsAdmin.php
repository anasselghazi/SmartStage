<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Non authentifié.'
            ], 401);
        }

        if (!$user->estAdmin()) {
            return response()->json([
                'message' => 'Accès refusé. Vous devez être administrateur.'
            ], 403);
        }

        return $next($request);
    }
}