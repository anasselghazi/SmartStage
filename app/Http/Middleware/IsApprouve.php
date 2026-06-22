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
            return response()->json([
                'message' => 'Non authentifié.'
            ], 401);
        }

        if ($user->estBloque()) {
            return response()->json([
                'message' => 'Votre compte a été bloqué. Contactez l\'administrateur.'
            ], 403);
        }

        if ($user->estEnAttente()) {
            return response()->json([
                'message' => 'Votre compte est en attente de validation par l\'administrateur.'
            ], 403);
        }

        return $next($request);
    }
}