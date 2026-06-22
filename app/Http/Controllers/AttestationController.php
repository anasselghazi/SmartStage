<?php
namespace App\Http\Controllers;
use App\Models\Attestation;
use App\Models\Stagiaire;
use Illuminate\Http\Request;
class AttestationController extends Controller
{
    /**
     * Générer une attestation pour un stagiaire
     * US 5.1 : génération dynamique
     * US 5.2 : vérification des champs requis avant génération
     */
    public function generer(Request $request)
    {
        // 1. Validation de la requête
        $request->validate([
            'stagiaire_id' => 'required|integer|exists:stagiaires,id',
        ]);
        // 2. Récupération (On est sûr qu'il existe grâce au validator)
        $stagiaire = Stagiaire::find($request->stagiaire_id);
        // US 5.2 : Vérification des champs requis pour l'attestation
        $champsRequis = ['cin', 'reference', 'nom_complet', 'date_debut', 'date_fin'];
        $manquants = [];
        foreach ($champsRequis as $champ) {
            if (empty($stagiaire->$champ)) {
                $manquants[] = $champ;
            }
        }
        if (!empty($manquants)) {
            return response()->json([
                'message'   => 'Impossible de générer l\'attestation : champs manquants.',
                'manquants' => $manquants,
            ], 422);
        }
        // 3. Génération de l'attestation avec transaction
        $attestation = Attestation::creer(
            stagiaireId: $stagiaire->id,
            genereParId: $request->user()->id,
        );
        return response()->json([
            'message'     => 'Attestation générée avec succès.',
            'attestation' => [
                'id'              => $attestation->id,
                'numero'          => $attestation->numero,
                'date_generation' => $attestation->date_generation,
                'stagiaire'        => [
                    'nom_complet' => $stagiaire->nom_complet,
                    'cin'         => $stagiaire->cin,
                    'reference'   => $stagiaire->reference,
                    'date_debut'  => $stagiaire->date_debut->format('d/m/Y'), // خدامة بسلام حيت كاين الـ cast
                    'date_fin'    => $stagiaire->date_fin->format('d/m/Y'),   // خدامة بسلام حيت كاين الـ cast
                    'service'     => $stagiaire->service,
                ],
            ],
        ]);
    }
    /**
     * Historique des attestations d'un stagiaire
     */
    public function historique(Stagiaire $stagiaire)
    {
        $attestations = $stagiaire->attestations()
            ->with('generePar:id,nom,email')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json([
            'stagiaire'    => $stagiaire->nom_complet,
            'attestations' => $attestations,
        ]);
    }
}