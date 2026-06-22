<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stagiaires', function (Blueprint $table) {
            $table->id();
            $table->string('cin')->unique();
            $table->string('reference')->unique();
            $table->string('nom_complet');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->string('service')->nullable();
            $table->timestamps();
            $table->index('cin');
            $table->index('reference');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stagiaires');
    }
};