from flask import Blueprint, request, jsonify
from services.gemini_service import GeminiService

class AIRoutes:
    def __init__(self):
        self.blueprint = Blueprint('ai', __name__)
        self.gemini_service = GeminiService()
        self.register_routes()

    def register_routes(self):
        @self.blueprint.route('/api/ai/scan-cv', methods=['POST'])
        def scan_cv():
            data = request.json
            if not data or 'file_b64' not in data:
                return jsonify({"erreur": "Fichier manquant"}), 400
                
            skills = self.gemini_service.extraire_competences(data['file_b64'], data['mime_type'])
            return jsonify({"skills": skills}), 200