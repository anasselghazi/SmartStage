<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stagiaire extends Model
{
    use HasFactory;

    protected $fillable = [
        'cin',
        'reference',
        'nom_complet',
        'date_debut',
        'date_fin',
        'service',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin'   => 'date',
    ];

    public function attestations()
    {
        return $this->hasMany(Attestation::class);
    }

    public static function trouverParCinOuRef(string $cle): ?self
    {
        return self::where('cin', $cle)
            ->orWhere('reference', $cle)
            ->first();
    }

    public static function champsValides(array $ligne): bool
    {
        return !empty($ligne['cin'])
            && !empty($ligne['reference'])
            && !empty($ligne['nom_complet'])
            && !empty($ligne['date_debut'])
            && !empty($ligne['date_fin']);
    }
}