<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\StagiaireController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\AttestationController;
use Illuminate\Support\Facades\Route;

// -----------------------------------------------
// Routes publiques (sans authentification)
// -----------------------------------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// -----------------------------------------------
// Routes protegees (token Sanctum requis)
// -----------------------------------------------
Route::middleware('auth:sanctum')->group(function () {

    // Deconnexion
    Route::post('/logout', [AuthController::class, 'logout']);

    // -----------------------------------------------
    // Routes Admin uniquement (is_admin middleware)
    // -----------------------------------------------
    Route::middleware('is_admin')->group(function () {

        // Gestion des comptes RH (US 3.3)
        Route::get('/admin/comptes',              [AdminController::class, 'listerComptes']);
        Route::patch('/admin/comptes/{user}/approuver', [AdminController::class, 'approuver']);
        Route::patch('/admin/comptes/{user}/bloquer',   [AdminController::class, 'bloquer']);
        Route::patch('/admin/comptes/{user}/debloquer', [AdminController::class, 'debloquer']);

        // Import Excel (US 4.1)
        Route::post('/admin/import', [ImportController::class, 'importer']);
    });

    // -----------------------------------------------
    // Routes RH approuve (is_approuve middleware)
    // -----------------------------------------------
    Route::middleware('is_approuve')->group(function () {

        // Recherche stagiaire (US 5.1)
        Route::get('/stagiaires/rechercher', [StagiaireController::class, 'rechercher']);

        // Generation attestation (US 5.1 / 5.2)
        Route::post('/attestations/generer',              [AttestationController::class, 'generer']);
        Route::get('/attestations/{stagiaire}/historique', [AttestationController::class, 'historique']);
    });
});