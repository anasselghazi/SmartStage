<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stagiaires', function (Blueprint $table) {
            // cin déjà présent mais on le rend nullable
            $table->string('cin')->nullable()->change();

            $table->string('civilite')->nullable()->after('reference');
            $table->string('entite')->nullable()->after('service');
            $table->string('localisation')->nullable()->after('entite');
            $table->string('parrain')->nullable()->after('localisation');
            $table->string('niveau_etude')->nullable()->after('parrain');
            $table->string('email')->nullable()->after('niveau_etude');
            $table->string('cycle_formation')->nullable()->after('email');
            $table->string('specialite')->nullable()->after('cycle_formation');
            $table->string('ville_ecole')->nullable()->after('specialite');
            $table->string('ecole')->nullable()->after('ville_ecole');
            $table->string('type_ecole')->nullable()->after('ecole');
            $table->string('remunere')->nullable()->after('type_ecole');
        });
    }

    public function down(): void
    {
        Schema::table('stagiaires', function (Blueprint $table) {
            $table->string('cin')->nullable(false)->change();
            $table->dropColumn([
                'civilite',
                'entite',
                'localisation',
                'parrain',
                'niveau_etude',
                'email',
                'cycle_formation',
                'specialite',
                'ville_ecole',
                'ecole',
                'type_ecole',
                'remunere',
            ]);
        });
    }
};