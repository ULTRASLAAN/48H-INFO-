from flask import Blueprint, request, jsonify
from services.profile_service import ProfileService

class ProfileRoutes:
    def __init__(self):
        self.blueprint = Blueprint('profile', __name__)
        self.profile_service = ProfileService()
        self.register_routes()

    def register_routes(self):
        @self.blueprint.route('/api/profile/<int:user_id>', methods=['GET'])
        def get_profile(user_id):
            profile = self.profile_service.get_profile(user_id)
            return jsonify(profile), 200

        @self.blueprint.route('/api/profile', methods=['PUT'])
        def update_profile():
            data = request.get_json()
            if not data or 'user_id' not in data:
                return jsonify({"erreur": "user_id requis"}), 400
            
            profile = self.profile_service.update_profile(
                data['user_id'], 
                data.get('skills', []), 
                data.get('bio', ''),
                data.get('status', 'Disponible')
            )
            return jsonify({"message": "Profil mis a jour", "profile": profile}), 200