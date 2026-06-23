<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'uuid',
        'nom',
        'email',
        'password',
        'role',
        'statut',
    ];

    protected $hidden = [
        'id',
        'password',
        'remember_token',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    // ---- UUID auto-generation ----

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($user) {
            $user->uuid = Str::uuid();
        });
    }

    /**
     * Utiliser uuid dans les routes au lieu de id
     */
    // public function getRouteKeyName(): string
    // {
    //     return 'uuid';
    // }

    // ---- Relations ----

    public function attestationsGenerees()
    {
        return $this->hasMany(Attestation::class, 'genere_par_id');
    }

    // ---- Role helpers ----

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