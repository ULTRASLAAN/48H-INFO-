# YSTUDENT - Plateforme Étudiante Ynov  
*(Hackathon 48H)*

---

## Description du projet

**YSTUDENT** est une application web développée dans le cadre du Hackathon 48H Ynov.  
Elle vise à centraliser et faciliter la vie étudiante en regroupant plusieurs services essentiels sur une seule et même plateforme :

- Communication  
- Entraide  
- Employabilité  
- Actualités  

---

## Fonctionnalités principales

### Authentification et profils
- Inscription  
- Connexion  
- Gestion de profil  

### Analyse de CV par IA
- Intégration de **Google Gemini**  
- Scan de CV (PDF / Texte)  
- Extraction automatique des compétences  

### Messagerie instantanée (Chat)
- Canal général  
- Groupes privés  
- Messages privés  
- Système d'ajout d'amis  

### Marketplace (Achat / Vente)
- Vente et achat de matériel entre étudiants  
- Système de modération administrateur  

### Fil d’actualité (Feed)
- Publication de messages visibles par tous  

### Ymatch
- Offres de stages  
- Offres d’alternances  

---

## Choix techniques

Le projet a été conçu avec des technologies fiables et adaptées à un développement rapide (MVP) dans le cadre d’un hackathon de 48 heures.

---

### Backend

- **Langage** : Python  
- **Framework** : Flask  

**Pourquoi Flask ?**
- Micro-framework léger et flexible  
- Idéal pour créer rapidement une API RESTful  
- Plus simple que Django pour un projet court  

**Architecture**
- Utilisation des **Blueprints Flask**  
- Séparation des routes par domaine :
  - auth  
  - chat  
  - market  
  - etc.  

**Sécurité**
- Requêtes préparées via `mysql-connector-python`  
- Protection contre les injections SQL  

---

### Frontend

- HTML / CSS  
- JavaScript Vanilla (ES Modules)  

**Pourquoi Vanilla JS ?**
- Pas besoin de configuration lourde (Webpack, Vite, React, Vue)  
- Architecture modulaire avec ES Modules  

**SPA hybride**
- Navigation dynamique via manipulation du DOM  
- Pas de rechargement de page  

**Gestion de l’état**
- `localStorage` :
  - Session utilisateur  
  - Notifications (toasts)  

---

### Base de données

- **SGBD** : MySQL  

**Pourquoi MySQL ?**
- Base relationnelle robuste  
- Gestion efficace des relations :
  - utilisateurs  
  - messages  
  - groupes  
  - produits  

**Suppression en cascade**
- `ON DELETE CASCADE`  
- Évite les données orphelines  

---

## Fonctionnalités spécifiques

### Temps réel (Chat)
- Implémentation de **Smart Polling**
  - Requête toutes les 2 secondes en activité  
  - Jusqu’à 15 secondes en inactivité  
- Alternative aux WebSockets (plus simples à déployer en 48h)

---

### Intelligence Artificielle
- API **Google Gemini (gemini-1.5-flash)**  
- Traitement de documents encodés en Base64  
- Extraction de texte structuré  

---

## Pré-requis

Avant de commencer, assurez-vous d’avoir :

- Python **3.8+**  
- Serveur MySQL (XAMPP, WAMP, MAMP ou Docker)  
- Git  

---

## Installation et lancement

### 1. Clonage du projet

```bash
git clone <URL_DU_DEPOT>
cd 48H-INFO--back-end
```

---

### 2. Configuration de la base de données

- Démarrer MySQL  
- Importer le fichier :

```
database/init.sql
```

Cela va :
- Créer la base `Ybase`  
- Créer les tables  
- Insérer des données de test  

---

### 3. Environnement Python

Créer un environnement virtuel :

```bash
python -m venv venv
```

Activer :

- Windows :
```bash
venv\Scripts\activate
```

- macOS / Linux :
```bash
source venv/bin/activate
```

Installer les dépendances :

```bash
pip install -r requirements.txt
```

---

### 4. .env

- Créer un fichier .env et y ajouter la clé gemini:
  ```
  .env :
    GEMINI_API_KEY=VOTRE_CLE_GEMINI
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=Ybase
  ```

---

### 5. Lancement de l’application

```bash
python app.py
```

Accès :
```
http://127.0.0.1:5000
```

---

## Structure du projet

```
app.py                  # Point d'entrée Flask
requirements.txt        # Dépendances Python

database/
  └── init.sql          # Script SQL

routes/                 # Contrôleurs API (Blueprints)

services/               # Logique métier

static/                 # Fichiers statiques
  ├── js/
  ├── css/
  └── uploads/

templates/
  └── index.html        # SPA principale
```

---

## Conclusion

YSTUDENT est une plateforme complète pensée pour améliorer l'expérience étudiante en centralisant des outils essentiels dans une interface unique, avec une architecture simple, efficace et adaptée aux contraintes d’un hackathon.
