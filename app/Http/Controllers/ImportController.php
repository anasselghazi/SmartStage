<?php

namespace App\Http\Controllers;

use App\Imports\SimpleImport;
use App\Models\Stagiaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class ImportController extends Controller
{
    /**
     * Import du fichier Excel des stagiaires
     * US 4.1 : insertion ou mise a jour automatique
     * US 4.2 : validation des champs obligatoires
     * US 4.3 : detection des doublons sécurisée
     */
    public function importer(Request $request)
    {
        // 1. Validation du fichier (Format et taille)
        $request->validate([
            'fichier' => 'required|file|mimes:xlsx,xls,csv|max:10240',
        ]);

        // 2. Lecture des donnees avec la classe personnalisée
        $lignes = Excel::toArray(new SimpleImport, $request->file('fichier'));

        if (empty($lignes) || empty($lignes[0])) {
            return response()->json([
                'message' => 'Le fichier Excel est vide.'
            ], 422);
        }

        $donnees    = $lignes[0];
        $erreurs    = [];
        $inseres    = 0;
        $mis_a_jour = 0;

        // 3. Traitement ligne par ligne
        foreach ($donnees as $index => $ligne) {
            $numeroLigne = $index + 2; // Ligne 1 = Header dans Excel

            // US 4.2 : Validation des champs obligatoires (Structure)
            if (!Stagiaire::champsValides($ligne)) {
                $erreurs[] = [
                    'ligne'   => $numeroLigne,
                    'message' => 'Champs obligatoires manquants ou invalides (cin, reference, nom_complet, date_debut, date_fin).',
                ];
                continue;
            }

            // Transaction par ligne : l'échec d'une ligne n'impacte pas les autres
            DB::beginTransaction();
            try {
                // US 4.3 : Sécurisation de la détection de doublon (Séparée pour éviter les conflits SQL)
                $parCin = Stagiaire::where('cin', $ligne['cin'])->first();
                $parRef = Stagiaire::where('reference', $ligne['reference'])->first();

                if ($parCin || $parRef) {
                    // Si un doublon existe, on prend la ligne trouvée pour la mettre à jour
                    $existant = $parCin ?? $parRef;

                    // US 3.4 : Mise a jour si doublon detecte
                    $existant->update([
                        'nom_complet' => $ligne['nom_complet'],
                        'date_debut'  => $ligne['date_debut'],
                        'date_fin'    => $ligne['date_fin'],
                        'service'     => $ligne['service'] ?? null,
                    ]);
                    $mis_a_jour++;
                } else {
                    // Insertion d'un nouveau stagiaire
                    Stagiaire::create([
                        'cin'         => $ligne['cin'],
                        'reference'   => $ligne['reference'],
                        'nom_complet' => $ligne['nom_complet'],
                        'date_debut'  => $ligne['date_debut'],
                        'date_fin'    => $ligne['date_fin'],
                        'service'     => $ligne['service'] ?? null,
                    ]);
                    $inseres++;
                }

                DB::commit();

            } catch (\Exception $e) {
                DB::rollBack();
                $erreurs[] = [
                    'ligne'   => $numeroLigne,
                    'message' => 'Erreur technique (Base de données) : ' . $e->getMessage(),
                ];
            }
        }

        // 4. Bilan global de l'importation
        $toutEchoue = count($erreurs) === count($donnees);

        return response()->json([
            'message'    => $toutEchoue
                ? 'Importation échouée : toutes les lignes sont invalides.'
                : 'Importation terminée.' . (count($erreurs) === 0 ? ' (Succès total)' : ' (Avec alertes)'),
            'inseres'    => $inseres,
            'mis_a_jour' => $mis_a_jour,
            'erreurs'    => $erreurs,
        ], $toutEchoue ? 422 : 200);
    }
}