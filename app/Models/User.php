<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nom',
        'email',
        'password',
        'role',
        'statut',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    public function attestationsGenerees()
    {
        return $this->hasMany(Attestation::class, 'genere_par_id');
    }

    public function estAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function estRh(): bool
    {
        return $this->role === 'rh';
    }

    public function estApprouve(): bool
    {
        return $this->estAdmin() || $this->statut === 'approuve';
    }

    public function estBloque(): bool
    {
        return $this->statut === 'bloque';
    }

    public function estEnAttente(): bool
    {
        return $this->estRh() && $this->statut === 'en_attente';
    }
}