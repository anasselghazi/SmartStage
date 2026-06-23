<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'nom'      => 'Super Administrateur',
            'email'    => 'admin@smartstage.ma',
            'password' => 'Admin@1234',
            'role'     => 'admin',
            'statut'   => 'approuve',
        ]);
    }
}