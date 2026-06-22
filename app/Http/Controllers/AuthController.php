<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\RegisterRequest;  
use App\Http\Requests\LoginRequest;   
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Inscription d'un nouveau compte RH
     */
    public function register(RegisterRequest $request) 
    {
        
        $user = User::create([
            'nom'      => $request->nom,
            'email'    => $request->email,
            'password' => $request->password, 
            'role'     => 'rh',
            'statut'   => 'en_attente',
        ]);

        return response()->json([
            'message' => 'Compte créé avec succès. En attente de validation par l\'administrateur.',
            'user'    => $user,
        ], 201);
    }

    /**
     * Connexion et generation du token Sanctum
     */
    public function login(LoginRequest $request)  
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie.',
            'token'   => $token,
            'user'    => [
                'id'     => $user->id,
                'nom'    => $user->nom,
                'email'  => $user->email,
                'role'   => $user->role,
                'statut' => $user->statut,
            ],
        ]);
    }

    /**
     * Deconnexion et suppression du token
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.'
        ]);
    }
}