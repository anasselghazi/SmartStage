<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToArray;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class SimpleImport implements ToArray, WithHeadingRow
{
    /**
     * Récupère les données sous forme de tableau PHP classique
     * en utilisant la première ligne du fichier Excel comme clés (Headers)
     */
    public function array(array $array): array
    {
        return $array;
    }
}