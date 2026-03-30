from flask import Blueprint, request, jsonify
from services.auth_service import AuthService

class AuthRoutes:
    def __init__(self):
        self.blueprint = Blueprint('auth', __name__)
        self.auth_service = AuthService()
        self.register_routes()

    def register_routes(self):
        @self.blueprint.route('/api/auth/register', methods=['POST'])
        def register():
            data = request.get_json()
            required_fields = ['nom', 'prenom', 'email', 'password', 'date_naissance', 'age', 'cursus']
            
            if not data or not all(field in data for field in required_fields):
                return jsonify({"erreur": "Tous les champs sont requis"}), 400
            
            try:
                user = self.auth_service.register_user(
                    data['nom'],
                    data['prenom'],
                    data['email'],
                    data['password'],
                    data['date_naissance'],
                    data['age'],
                    data['cursus']
                )
                return jsonify({"message": "Inscription reussie", "email": user['email']}), 201
            except ValueError as e:
                return jsonify({"erreur": str(e)}), 400

        @self.blueprint.route('/api/auth/login', methods=['POST'])
        def login():
            data = request.get_json()
            if not data or 'email' not in data or 'password' not in data:
                return jsonify({"erreur": "Email et mot de passe requis"}), 400
            
            user = self.auth_service.login_user(data['email'], data['password'])
            
            if user:
                return jsonify({"message": "Connexion reussie", "email": user['email'], "cursus": user['cursus']}), 200
            else:
                return jsonify({"erreur": "Identifiants incorrects"}), 401