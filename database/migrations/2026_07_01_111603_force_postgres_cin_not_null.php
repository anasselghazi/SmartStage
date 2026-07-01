<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Kan3mro ay ligne fiha cin NULL b'chaine khawia '' bach Postgres maybloquich
        DB::statement("UPDATE stagiaires SET cin = '' WHERE cin IS NULL");

        // 2. Kanforcew Postgres b'SQL direct bach yred l'colonne NOT NULL
        DB::statement("ALTER TABLE stagiaires ALTER COLUMN cin SET NOT NULL");
    }

    public function down(): void
    {
        // En cas de rollback, n7iydo NOT NULL
        DB::statement("ALTER TABLE stagiaires ALTER COLUMN cin DROP NOT NULL");
    }
};