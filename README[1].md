# DIGIT STORE

Starter sécurisé pour une boutique de codes numériques.

## Contenu
- Catalogue et formulaire de commande
- Import massif des codes par CSV dans l'espace admin
- Base Supabase (schéma SQL + fonctions serveur)
- Fonction Netlify de création de paiement (mode démonstration par défaut)
- Webhook serveur pour confirmer un paiement, réserver un code et envoyer l'e-mail via Resend

## Important avant toute vente réelle
Le projet démarre en **mode démonstration**. Aucun paiement réel n'est activé.
L'adulte responsable doit créer/valider les comptes marchands Wave Business, Supabase, Netlify et Resend, puis configurer les secrets côté serveur.
Ne place JAMAIS de clé secrète dans `index.html`, `script.js`, GitHub ou un message ChatGPT.

## Déploiement
1. Décompressez ce dossier.
2. Déposez son contenu dans le dépôt GitHub du site (remplacez les anciens fichiers uniquement après sauvegarde).
3. Dans Netlify, reliez le dépôt et activez les Netlify Functions.
4. Créez un projet Supabase et exécutez `supabase/schema.sql` dans SQL Editor.
5. Configurez les variables d'environnement listées dans `.env.example` dans Netlify.
6. Laissez `PAYMENTS_MODE=demo` jusqu'à ce que l'adulte responsable ait terminé la configuration Wave et les tests.

## Import CSV
Modèle : `examples/codes-import.csv`

Colonnes obligatoires :
- `sku` : identifiant du produit (ex. `VBUCKS-1000`)
- `code` : code numérique à délivrer

Ne partagez pas le fichier contenant les vrais codes. L'import doit être effectué depuis un poste sécurisé par l'administrateur.

## État de l'intégration Wave
Le fichier `netlify/functions/create-checkout.mjs` refuse les paiements réels tant que `PAYMENTS_MODE=demo`.
Le webhook est un squelette volontairement fermé : il ne délivre rien tant que la vérification de signature Wave n'a pas été implémentée et testée avec la documentation officielle et les identifiants du compte marchand.
Ne contournez jamais cette vérification.

## Accès administrateur
L'import CSV est protégé par `ADMIN_IMPORT_TOKEN` côté serveur. Pour une version de production, remplacez ce mécanisme par une authentification administrateur Supabase Auth avec MFA et rôles.
