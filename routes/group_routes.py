from flask import Blueprint, request, jsonify
from services.group_service import GroupService

class GroupRoutes:
    def __init__(self):
        self.blueprint = Blueprint('groups', __name__)
        self.group_service = GroupService()
        self.register_routes()

    def register_routes(self):
        @self.blueprint.route('/api/groups', methods=['GET'])
        def get_groups():
            groups = self.group_service.get_all_groups()
            return jsonify({"groups": groups}), 200

        @self.blueprint.route('/api/groups', methods=['POST'])
        def create_group():
            data = request.get_json()
            if not data or 'creator_id' not in data or 'name' not in data:
                return jsonify({"erreur": "Donnees manquantes"}), 400
            
            group = self.group_service.create_group(
                data['creator_id'], 
                data['name'], 
                data.get('description', '')
            )
            return jsonify({"message": "Groupe cree", "group": group}), 201