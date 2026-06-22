# 📌 Plateforme Web Sécurisée de Gestion et d’Impression d’Attestations de Stage

## 🧾 Description du projet

Cette application web permet la gestion centralisée des stagiaires et la génération automatisée des attestations de stage.  
Elle remplace les traitements manuels par une solution rapide, sécurisée et automatisée.

Le système repose sur une séparation stricte des rôles (Administrateur / RH) et permet l’importation massive de données, la recherche sécurisée et l’impression directe des attestations.

---

## 🚀 Fonctionnalités principales

### 👤 Gestion des utilisateurs & rôles
- Système d’inscription avec validation par l’administrateur
- Deux rôles :
  - **Super Administrateur**
    - Validation des comptes RH
    - Importation des fichiers Excel
    - Accès total au système
  - **Gestionnaire RH**
    - Accès après approbation
    - Recherche et impression uniquement

---

### 📥 Importation Excel (Admin uniquement)
- Import de fichiers Excel (drag & drop ou upload)
- Validation automatique des champs obligatoires :
  - CIN
  - Référence
  - Nom complet
  - Dates de stage
- Insertion ou mise à jour automatique en base de données

---

### 🔎 Recherche sécurisée
- Recherche unique par :
  - CIN
  - Référence
- Affichage d’un seul résultat (aucune liste globale)
- Protection des données sensibles

---

### 🖨️ Génération & impression d’attestation
- Génération dynamique d’une attestation de stage officielle
- Template professionnel format A4
- Mode impression optimisé :
  - Masquage automatique de l’interface
  - Impression propre via navigateur

---

## 🏗️ Architecture technique

### Backend
- Laravel (PHP) API REST sécurisée
- Gestion de la logique métier
- Traitement des fichiers Excel
- Middlewares de sécurité

### Frontend
- React.js (SPA)
- Interface utilisateur dynamique
- Protected Routes

### Styling
- Tailwind CSS
- Interface responsive + mode impression A4

### Authentification
- Laravel Sanctum
- Authentification par tokens API

---

## 🔐 Sécurité

- Mots de passe hashés
- Middleware de contrôle des rôles
- Accès bloqué pour les comptes non validés
- Aucune liste globale des stagiaires
- Sécurisation complète des routes API

---

## 🗂️ Structure du projet

project-root/
│
├── backend/ (Laravel API)
│   ├── app/
│   ├── routes/api.php
│   ├── database/migrations/
│   └── ...
│
├── frontend/ (React SPA)
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── routes/
│
└── README.md

---

## ⚙️ Installation & configuration

### 1️⃣ Cloner le projet
git clone https://github.com/your-repo/project.git
cd project

---

### 2️⃣ Backend (Laravel)

cd backend
composer install
cp .env.example .env
php artisan key:generate

Configurer la base de données dans `.env` :

DB_DATABASE=your_db
DB_USERNAME=root
DB_PASSWORD=

---

Exécuter les migrations :

php artisan migrate

---

Lancer le serveur :

php artisan serve

---

### 3️⃣ Frontend (React)

cd frontend
npm install
npm run dev

---

## 📊 Format Excel attendu

| CIN | Référence | Nom | Date début | Date fin |
|-----|----------|-----|------------|----------|

---

## 🧪 Tests

- Test import Excel
- Test login Admin / RH
- Test recherche CIN / Référence
- Test génération d’attestation
- Test impression PDF

---

## 📌 Objectif du projet

Développer une plateforme sécurisée permettant :
- Gestion automatisée des stagiaires
- Réduction des erreurs humaines
- Génération rapide des attestations
- Sécurité et contrôle d’accès avancé

---

## 👨‍💻 Auteur
Anass Elghazi
Projet de stage – Développement Web Full Stack