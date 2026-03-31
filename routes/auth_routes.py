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
            if not data: return jsonify({"erreur": "Données manquantes"}), 400
            hashed_password = generate_password_hash(data['password'])
            db = get_db_connection()
            cursor = db.cursor()
            try:
                query = "INSERT INTO users (nom, prenom, email, password, cursus) VALUES (%s, %s, %s, %s, %s)"
                cursor.execute(query, (data['nom'], data['prenom'], data['email'].lower(), hashed_password, data.get('cursus', 'Etudiant')))
                db.commit()
                return jsonify({"status": "ok", "message": "Compte créé avec succès"}), 201
            except Exception as e:
                return jsonify({"erreur": "Cet email est déjà utilisé"}), 400
            finally: db.close()

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
                    user.pop('password')
                    return jsonify({"status": "ok", "user": user}), 200
                else:
                    return jsonify({"erreur": "Email ou mot de passe incorrect"}), 401
            finally: db.close()

        # 3. ENVOYER UNE DEMANDE D'AMI
        @self.blueprint.route('/api/friends/request', methods=['POST'])
        def send_request():
            data = request.json
            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            try:
                cursor.execute("SELECT id FROM users WHERE email = %s", (data['friend_email'].lower(),))
                friend = cursor.fetchone()
                if not friend: return jsonify({"erreur": "Utilisateur introuvable"}), 404
                cursor.execute("INSERT INTO friends (user_id, friend_id, status) VALUES (%s, %s, 'pending')", (data['user_id'], friend['id']))
                db.commit()
                return jsonify({"status": "ok"}), 201
            except: return jsonify({"erreur": "Demande déjà envoyée"}), 400
            finally: db.close()

        # 4. VOIR LES DEMANDES REÇUES
        @self.blueprint.route('/api/friends/requests/received', methods=['GET'])
        def get_received_requests():
            user_id = request.args.get('user_id')
            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            cursor.execute("SELECT f.id as request_id, u.prenom, u.nom, u.id as sender_id FROM friends f JOIN users u ON f.user_id = u.id WHERE f.friend_id = %s AND f.status = 'pending'", (user_id,))
            reqs = cursor.fetchall()
            db.close()
            return jsonify({"requests": reqs})

        # 5. ACCEPTER UN AMI
        @self.blueprint.route('/api/friends/accept', methods=['POST'])
        def accept_friend():
            data = request.json
            db = get_db_connection()
            cursor = db.cursor()
            try:
                cursor.execute("UPDATE friends SET status = 'accepted' WHERE id = %s", (data['request_id'],))
                cursor.execute("INSERT INTO friends (user_id, friend_id, status) VALUES (%s, %s, 'accepted')", (data['my_id'], data['friend_id']))
                db.commit()
                return jsonify({"status": "ok"})
            finally: db.close()

        # 6. RÉCUPÉRER LA LISTE DES AMIS
        @self.blueprint.route('/api/friends/list', methods=['GET'])
        def list_friends():
            user_id = request.args.get('user_id')
            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            cursor.execute("SELECT u.id, u.prenom, u.nom FROM friends f JOIN users u ON f.friend_id = u.id WHERE f.user_id = %s AND f.status = 'accepted'", (user_id,))
            friends = cursor.fetchall()
            db.close()
            return jsonify({"friends": friends})