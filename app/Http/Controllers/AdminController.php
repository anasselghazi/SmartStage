<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Liste de tous les comptes RH (en attente + approuvés + bloqués)
     * US 3.3
     */
    public function listerComptes()
    {
        $comptes = User::where('role', 'rh')
            ->orderBy('created_at', 'desc')
            ->get(['id', 'nom', 'email', 'role','statut', 'created_at']);

        return response()->json($comptes);
    }

    /**
     * Approuver un compte RH
     * US 3.3
     */
    public function approuver(User $user)
    {
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

    /**
     * Bloquer un compte RH (même déjà approuvé)
     * US 3.3
     */
    public function bloquer(User $user)
    {
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

    /**
     * Débloquer un compte RH
     * US 3.3
     */
    public function debloquer(User $user)
    {
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