<?php

namespace App\Http\Controllers;

use App\Imports\StagiaireImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ImportController extends Controller
{
    public function importer(Request $request)
    {
        $request->validate([
            'fichier' => 'required|file|mimes:xlsx,xls,xlsm,csv|max:10240',
        ]);

        $import = new StagiaireImport();
        Excel::import($import, $request->file('fichier'));

        $erreurs    = $import->getErreurs();
        $inseres    = $import->getInseres();
        $mis_a_jour = $import->getMisAJour();
        $toutEchoue = count($erreurs) > 0 && ($inseres + $mis_a_jour) === 0;

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