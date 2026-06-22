<?php

namespace App\Http\Controllers;

use App\Models\Stagiaire;
use Illuminate\Http\Request;

class StagiaireController extends Controller
{
    /**
     * Recherche d'un stagiaire par CIN ou Reference
     * US 5.1 : champ unique, pas de liste globale
     */
    public function rechercher(Request $request)
    {
        $request->validate([
            'cle' => 'required|string|min:2',
        ]);

        $stagiaire = Stagiaire::trouverParCinOuRef($request->cle);

        if (!$stagiaire) {
            return response()->json([
                'message' => 'Aucun stagiaire trouvé pour cette recherche.'
            ], 404);
        }

        return response()->json([
            'stagiaire' => $stagiaire,
        ]);
    }
}