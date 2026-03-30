from flask import Blueprint, request, jsonify
from services.gemini_service import GeminiService

class AIRoutes:
    def __init__(self):
        self.blueprint = Blueprint('ai', __name__)
        self.gemini_service = GeminiService()
        self.register_routes()

    def register_routes(self):
        @self.blueprint.route('/api/ai/resume', methods=['POST'])
        def generate_resume():
            data = request.get_json()
            if not data or 'competences' not in data:
                return jsonify({"erreur": "Veuillez fournir des competences"}), 400
                
            competences = data['competences']
            resume = self.gemini_service.generer_resume_profil(competences)
            
            return jsonify({"resume": resume}), 200