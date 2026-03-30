CREATE DATABASE IF NOT EXISTS Ybase;
USE Ybase;

-- =====================================================
-- Creation des tables (structure de la base de donnees)
-- =====================================================

-- Stocke les informations principales des utilisateurs de la plateforme
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    date_naissance DATE,
    age INT,
    cursus VARCHAR(100),
    phone_number VARCHAR(20),
    bio TEXT,
    status VARCHAR(50) DEFAULT 'Disponible',
    is_admin BOOLEAN DEFAULT FALSE,
    score DECIMAL(3,2) DEFAULT 0.0,
    date_last_login DATETIME,
    is_verified BOOLEAN DEFAULT FALSE,
    cv_filename VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reference toutes les competences disponibles
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Associe les utilisateurs a leurs competences avec un niveau
CREATE TABLE IF NOT EXISTS user_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    level VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Enregistre les experiences professionnelles des utilisateurs
CREATE TABLE IF NOT EXISTS experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    description TEXT,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Enregistre les diplomes et formations des utilisateurs
CREATE TABLE IF NOT EXISTS diplomas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    school VARCHAR(100),
    year INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Gere les notifications recues par chaque utilisateur
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Contient les annonces de produits publies sur la marketplace
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    seller_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Suit les transactions d'achat liees aux produits
CREATE TABLE IF NOT EXISTS product_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    buyer_id INT NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Stocke les groupes communautaires de la plateforme
CREATE TABLE IF NOT EXISTS groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gere les membres des groupes et leur role
CREATE TABLE IF NOT EXISTS group_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Conserve les messages prives entre utilisateurs
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Contient les publications du fil d'actualite
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Stocke les actualites affichees sur la plateforme
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Regroupe les offres d'emploi et de stage
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    cursus VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Insertion des donnees de base (seed)
-- =====================================================

INSERT INTO skills (name) VALUES 
('Python'), ('JavaScript'), ('Gestion de projet'), ('UI/UX Design'), ('Cybersécurité');

INSERT INTO news (title, category) VALUES 
('Challenge 48H', 'Hackathon'), 
('Evenement sportif du BDS', 'Sport'), 
('Soiree d''integration BDE', 'BDE');

INSERT INTO jobs (title, company, type, cursus) VALUES 
('Developpeur Fullstack', 'TechCorp', 'Alternance', 'Formation Informatique'), 
('Analyste SOC', 'CyberDefense', 'Stage', 'Formation Cybersécurité'), 
('Game Artist 3D', 'StudioPlay', 'Alternance', 'Formation 3D, Animation, Jeu Vidéo & Technologies Immersives'), 
('Prompt Engineer', 'AI Innovate', 'Stage', 'Formation Digital & IA'), 
('UX/UI Designer', 'CreativeAgency', 'Alternance', 'Formation Création & Digital Design');

INSERT INTO groups (name, description) VALUES 
('BDE 2026', 'Le bureau des eleves'), 
('Projet Dev', 'Groupe pour les projets de developpement');