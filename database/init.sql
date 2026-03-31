CREATE DATABASE IF NOT EXISTS Ybase;
USE Ybase;

-- =====================================================
-- 1. UTILISATEURS
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    cursus VARCHAR(100),
    bio TEXT,
    skills TEXT,
    role VARCHAR(20) DEFAULT 'user', -- Ajout de la gestion des roles (admin/user)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. MESSAGERIE (AMIS, GROUPES & GENERAL)
-- =====================================================
CREATE TABLE IF NOT EXISTS friends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS group_members (
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES chat_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    group_id INT DEFAULT 0, -- 0 = Chat General, sinon ID du groupe
    receiver_id INT DEFAULT NULL, -- Utilise pour les messages prives
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- 3. MARKETPLACE (ACHAT / VENTE)
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255) DEFAULT 'default.jpg',
    seller_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- 4. ACCUEIL (FEED & NEWS)
-- =====================================================
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. YMATCH (STAGES & ALTERNANCES)
-- =====================================================
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    description TEXT,
    target_cursus VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DONNEES DE TEST INITIALES
-- =====================================================
INSERT INTO news (title, content) VALUES 
('Challenge 48H', 'Le Hackathon Ynov bat son plein ! Courage aux equipes.'), 
('BDE Info', 'Vente de pulls Ynov demain au foyer a partir de 12h.'), 
('Workshop IA', 'Conference sur Gemini 3 Flash ce jeudi en amphi A.');

INSERT INTO jobs (title, company, description, target_cursus) VALUES 
('Developpeur Web', 'Avanade', 'Alternance en React/NodeJS.', 'Informatique'), 
('Analyste SOC', 'Orange Cyber', 'Stage 6 mois en surveillance reseau.', 'Cybersecurite'), 
('UX Designer', 'Ubisoft', 'Stage assistant sur une interface de jeu.', 'Design');