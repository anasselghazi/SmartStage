<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stagiaires', function (Blueprint $table) {
            // On rend le CIN obligatoire (NOT NULL) pour afficher l'étoile rouge
            $table->string('cin')->nullable(false)->change();

            // Ajout des autres colonnes
            $table->string('civilite')->nullable()->after('reference');
            $table->string('entite')->nullable()->after('service');
            $table->string('localisation')->nullable()->after('entite');
            $table->string('parrain')->nullable()->after('localisation');
            $table->string('niveau_etude')->nullable()->after('parrain');
            $table->string('email')->nullable()->after('email');
            $table->string('cycle_formation')->nullable()->after('email');
            $table->string('specialite')->nullable()->after('cycle_formation');
            $table->string('ville_ecole')->nullable()->after('specialite');
            $table->string('ecole')->nullable()->after('ville_ecole');
            $table->string('type_ecole')->nullable()->after('ecole');
            $table->string('remunere')->nullable()->after('type_ecole');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stagiaires', function (Blueprint $table) {
            // En cas de rollback, on le remet en nullable
            $table->string('cin')->nullable()->change();

            // On supprime les colonnes ajoutées
            $table->dropColumn([
                'civilite', 'entite', 'localisation', 'parrain', 
                'niveau_etude', 'email', 'cycle_formation', 
                'specialite', 'ville_ecole', 'ecole', 'type_ecole', 'remunere'
            ]);
        });
    }
};