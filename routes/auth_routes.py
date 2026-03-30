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
            if not data or 'email' not in data or 'password' not in data:
                return jsonify({"erreur": "Email et mot de passe requis"}), 400
            
            user = self.auth_service.register_user(data['email'], data['password'])
            return jsonify({"message": "Inscription reussie", "user": user['email']}), 201