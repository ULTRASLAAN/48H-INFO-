import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from services.auth_service import AuthService

class AuthRoutes:
    def __init__(self):
        self.blueprint = Blueprint('auth', __name__)
        self.auth_service = AuthService()
        self.register_routes()

    def register_routes(self):
        @self.blueprint.route('/api/auth/register', methods=['POST'])
        def register():
            data = request.form if request.form else request.get_json()
            cv_file = request.files.get('cv')

            required_fields = ['nom', 'prenom', 'email', 'password', 'date_naissance', 'age', 'cursus']
            
            if not data or not all(field in data for field in required_fields):
                return jsonify({"erreur": "Tous les champs sont requis"}), 400
            
            cv_filename = None
            if cv_file and cv_file.filename.endswith('.pdf'):
                cv_filename = secure_filename(cv_file.filename)
                cv_path = os.path.join(current_app.config['UPLOAD_FOLDER'], cv_filename)
                cv_file.save(cv_path)
            
            try:
                user = self.auth_service.register_user(
                    data['nom'],
                    data['prenom'],
                    data['email'],
                    data['password'],
                    data['date_naissance'],
                    data['age'],
                    data['cursus'],
                    cv_filename
                )
                return jsonify({"message": "Inscription reussie", "email": user['email'], "cv": cv_filename}), 201
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