from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from .db_config import get_db_connection

class AuthRoutes:
    def __init__(self):
        self.blueprint = Blueprint('auth', __name__)
        self.setup_routes()

    def setup_routes(self):
        # 1. INSCRIPTION
        @self.blueprint.route('/api/auth/register', methods=['POST'])
        def register():
            data = request.json
            if not data:
                return jsonify({"erreur": "Données manquantes"}), 400
            
            # Hachage du mot de passe pour la sécurité
            hashed_password = generate_password_hash(data['password'])
            db = get_db_connection()
            cursor = db.cursor()
            
            try:
                query = "INSERT INTO users (nom, prenom, email, password, cursus) VALUES (%s, %s, %s, %s, %s)"
                cursor.execute(query, (data['nom'], data['prenom'], data['email'].lower(), hashed_password, data.get('cursus', 'Etudiant')))
                db.commit()
                return jsonify({"status": "ok", "message": "Compte créé avec succès"}), 201
            except Exception as e:
                return jsonify({"erreur": "Cet email est déjà utilisé ou la base est inaccessible"}), 400
            finally:
                db.close()

        # 2. CONNEXION
        @self.blueprint.route('/api/auth/login', methods=['POST'])
        def login():
            data = request.json
            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            
            try:
                cursor.execute("SELECT * FROM users WHERE email = %s", (data['email'].lower(),))
                user = cursor.fetchone()
                
                if user and check_password_hash(user['password'], data['password']):
                    # On retire le mot de passe avant d'envoyer au front-end
                    user.pop('password')
                    return jsonify({"status": "ok", "user": user}), 200
                else:
                    return jsonify({"erreur": "Email ou mot de passe incorrect"}), 401
            finally:
                db.close()

        # 3. AJOUTER UN AMI PAR EMAIL
        @self.blueprint.route('/api/friends/add', methods=['POST'])
        def add_friend():
            data = request.json
            user_id = data.get('user_id')
            friend_email = data.get('friend_email').lower()
            
            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            
            try:
                # Trouver l'ID de l'ami via son email
                cursor.execute("SELECT id FROM users WHERE email = %s", (friend_email,))
                friend = cursor.fetchone()
                
                if not friend:
                    return jsonify({"erreur": "Aucun utilisateur trouvé avec cet email"}), 404
                
                if friend['id'] == user_id:
                    return jsonify({"erreur": "Vous ne pouvez pas vous ajouter vous-même"}), 400

                # Vérifier si déjà amis
                cursor.execute("SELECT id FROM friends WHERE (user_id = %s AND friend_id = %s)", (user_id, friend['id']))
                if cursor.fetchone():
                    return jsonify({"erreur": "Vous êtes déjà amis"}), 400

                # Ajouter la relation (on l'ajoute dans les deux sens pour simplifier le chat)
                query = "INSERT INTO friends (user_id, friend_id) VALUES (%s, %s)"
                cursor.execute(query, (user_id, friend['id']))
                cursor.execute(query, (friend['id'], user_id))
                
                db.commit()
                return jsonify({"status": "ok", "message": "Ami ajouté"}), 201
            except Exception as e:
                return jsonify({"erreur": str(e)}), 500
            finally:
                db.close()

        # 4. RÉCUPÉRER LA LISTE DES AMIS
        @self.blueprint.route('/api/friends', methods=['GET'])
        def get_friends():
            user_id = request.args.get('user_id')
            if not user_id:
                return jsonify({"erreur": "ID utilisateur manquant"}), 400
                
            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            
            try:
                query = """
                    SELECT u.id, u.prenom, u.nom, u.cursus 
                    FROM friends f 
                    JOIN users u ON f.friend_id = u.id 
                    WHERE f.user_id = %s
                """
                cursor.execute(query, (user_id,))
                friends = cursor.fetchall()
                return jsonify({"friends": friends}), 200
            except Exception as e:
                return jsonify({"erreur": str(e)}), 500
            finally:
                db.close()