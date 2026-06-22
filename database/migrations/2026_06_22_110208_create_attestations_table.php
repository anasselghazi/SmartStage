<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attestations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stagiaire_id')
                ->constrained('stagiaires')
                ->cascadeOnDelete();
            $table->foreignId('genere_par_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->string('numero')->unique();
            $table->timestamp('date_generation')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attestations');
    }
};