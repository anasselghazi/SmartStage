<?php

namespace App\Imports;

use App\Models\Stagiaire;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithStartRow;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

class StagiaireSheetImport implements ToCollection, WithStartRow
{
    public array $erreurs    = [];
    public int   $inseres    = 0;
    public int   $mis_a_jour = 0;

    /**
     * On lit à partir de la ligne 2 (headers)
     * On gère manuellement le mapping des colonnes par index
     */
    public function startRow(): int
    {
        return 2;
    }

    public function collection(Collection $rows)
    {
        \Log::info('TOTAL ROWS: ' . $rows->count());
        \Log::info('FIRST ROW:', $rows->first()->toArray());

        $isFirstRow = true;

        foreach ($rows as $index => $row) {
            // Ignorer la première ligne (headers)
            if ($isFirstRow) {
                $isFirstRow = false;
                continue;
            }

            $numeroLigne = $index + 2;

            // Mapping par index de colonne (évite problème encodage)
            // Index: 0=vide, 1=Réf, 2=CIN, 3=QR, 4=Civilité, 5=NOM, 6=Prénom
            //        7=Début stage, 8=Fin stage, 9=Service, 10=Entité
            //        11=Localisation, 12=Parrain, 13=Niveau Etude
            //        14=Adresse Email, 15=Cycle Formation, 16=Specialite
            //        17=Ville Ecole, 18=Ecole, 19=Public/Privé, 20=Rémunéré

            $reference = trim($row[1] ?? '');
            $cin       = trim($row[2] ?? '');

            // Protection ligne vide
            if (empty($reference) && empty($cin)) {
                continue;
            }

            $nom        = trim($row[5] ?? '');
            $prenom     = trim($row[6] ?? '');
            $nomComplet = trim("$nom $prenom");

            $dateDebut = $this->convertirDate($row[7] ?? null);
            $dateFin   = $this->convertirDate($row[8] ?? null);

            $ligne = [
                'cin'             => $cin ,
                'reference'       => $reference,
                'civilite'        => trim($row[4]  ?? '') ?: null,
                'nom_complet'     => $nomComplet,
                'date_debut'      => $dateDebut,
                'date_fin'        => $dateFin,
                'service'         => trim($row[9]  ?? '') ?: null,
                'entite'          => trim($row[10] ?? '') ?: null,
                'localisation'    => trim($row[11] ?? '') ?: null,
                'parrain'         => trim($row[12] ?? '') ?: null,
                'niveau_etude'    => trim($row[13] ?? '') ?: null,
                'email'           => trim($row[14] ?? '') ?: null,
                'cycle_formation' => trim($row[15] ?? '') ?: null,
                'specialite'      => trim($row[16] ?? '') ?: null,
                'ville_ecole'     => trim($row[17] ?? '') ?: null,
                'ecole'           => trim($row[18] ?? '') ?: null,
                'type_ecole'      => trim($row[19] ?? '') ?: null,
                'remunere'        => trim($row[20] ?? '') ?: null,
            ];

            if (!Stagiaire::champsValides($ligne)) {
                $this->erreurs[] = [
                    'ligne'   => $numeroLigne,
                    'message' => 'Champs obligatoires manquants (reference, nom_complet, date_debut, date_fin).',
                ];
                continue;
            }

            DB::beginTransaction();
            try {
                $parCin = !empty($ligne['cin'])
                    ? Stagiaire::where('cin', $ligne['cin'])->first()
                    : null;

                $parRef = Stagiaire::where('reference', $ligne['reference'])->first();

                if ($parCin || $parRef) {
                    $existant = $parCin ?? $parRef;
                    $existant->update($ligne);
                    $this->mis_a_jour++;
                } else {
                    Stagiaire::create($ligne);
                    $this->inseres++;
                }

                DB::commit();

            } catch (\Exception $e) {
                DB::rollBack();
                $this->erreurs[] = [
                    'ligne'   => $numeroLigne,
                    'message' => 'Erreur : ' . $e->getMessage(),
                ];
            }
        }
    }

    private function convertirDate($valeur): ?string
    {
        if (empty($valeur)) return null;

        if (is_string($valeur) && strtotime($valeur)) {
            return date('Y-m-d', strtotime($valeur));
        }

        if (is_numeric($valeur)) {
            return ExcelDate::excelToDateTimeObject($valeur)->format('Y-m-d');
        }

        return null;
    }
}