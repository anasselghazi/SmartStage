<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Attestation extends Model
{
    use HasFactory;

    protected $fillable = [
        'stagiaire_id',
        'genere_par_id',
        'numero',
        'date_generation',
    ];

    protected $casts = [
        'date_generation' => 'datetime',
    ];

    public function stagiaire()
    {
        return $this->belongsTo(Stagiaire::class);
    }

    public function generePar()
    {
        return $this->belongsTo(User::class, 'genere_par_id');
    }

    
    public static function genererNumero(): string
    {
        $annee = now()->year;
        
        $dernier = self::whereYear('created_at', $annee)
            ->lockForUpdate()
            ->count() + 1;
            
        return sprintf('ATT-%d-%06d', $annee, $dernier);
    }

    
    public static function creer(int $stagiaireId, int $genereParId): self
    {
        return DB::transaction(function () use ($stagiaireId, $genereParId) {
            return self::create([
                'stagiaire_id'    => $stagiaireId,
                'genere_par_id'   => $genereParId,
                'numero'          => self::genererNumero(), // هنا غايتطبق الـ Lock للي درنا لفوق
                'date_generation' => now(),
            ]);
        });
    }
}