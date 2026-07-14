<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function listerComptes()
    {
        $comptes = User::where('role', 'rh')
            ->orderBy('created_at', 'desc')
            ->get(['uuid', 'nom', 'email', 'role', 'statut', 'created_at']);

        return response()->json($comptes);
    }

    public function approuver(string $uuid)
    {
        $user = User::where('uuid', $uuid)->firstOrFail();

        if ($user->estAdmin()) {
            return response()->json([
                'message' => 'Action non autorisée sur un compte administrateur.'
            ], 403);
        }

        $user->update(['statut' => 'approuve']);

        return response()->json([
            'message' => 'Compte approuvé avec succès.',
            'user'    => $user,
        ]);
    }

    public function bloquer(string $uuid)
    {
        $user = User::where('uuid', $uuid)->firstOrFail();

        if ($user->estAdmin()) {
            return response()->json([
                'message' => 'Action non autorisée sur un compte administrateur.'
            ], 403);
        }

        $user->update(['statut' => 'bloque']);

        return response()->json([
            'message' => 'Compte bloqué avec succès.',
            'user'    => $user,
        ]);
    }

    public function debloquer(string $uuid)
    {
        $user = User::where('uuid', $uuid)->firstOrFail();

        if ($user->estAdmin()) {
            return response()->json([
                'message' => 'Action non autorisée sur un compte administrateur.'
            ], 403);
        }

        $user->update(['statut' => 'approuve']);

        return response()->json([
            'message' => 'Compte débloqué avec succès.',
            'user'    => $user,
        ]);
    }
}