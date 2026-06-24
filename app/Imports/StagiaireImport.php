<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class StagiaireImport implements WithMultipleSheets
{
    public StagiaireSheetImport $sheet;

    public function __construct()
    {
        $this->sheet = new StagiaireSheetImport();
    }

    public function sheets(): array
    {
        return [
            'Réf de Stagiaire' => $this->sheet,
        ];
    }

    public function getErreurs(): array  { return $this->sheet->erreurs; }
    public function getInseres(): int    { return $this->sheet->inseres; }
    public function getMisAJour(): int   { return $this->sheet->mis_a_jour; }
}