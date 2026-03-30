from flask import Blueprint, request, jsonify
from services.message_service import MessageService

class MessageRoutes:
    def __init__(self):
        self.blueprint = Blueprint('messages', __name__)
        self.message_service = MessageService()
        self.register_routes()

    def register_routes(self):
        @self.blueprint.route('/api/messages/group/<int:group_id>', methods=['GET'])
        def get_group_messages(group_id):
            messages = self.message_service.get_group_messages(group_id)
            return jsonify({"messages": messages}), 200

        @self.blueprint.route('/api/messages/private/<int:user_id>/<int:contact_id>', methods=['GET'])
        def get_private_messages(user_id, contact_id):
            messages = self.message_service.get_private_conversation(user_id, contact_id)
            return jsonify({"messages": messages}), 200

        @self.blueprint.route('/api/messages', methods=['POST'])
        def send_message():
            data = request.get_json()
            if not data or 'sender_id' not in data or 'content' not in data:
                return jsonify({"erreur": "Donnees manquantes"}), 400
            
            receiver_id = data.get('receiver_id')
            group_id = data.get('group_id')
            
            message = self.message_service.send_message(
                data['sender_id'], 
                data['content'],
                receiver_id=receiver_id,
                group_id=group_id
            )
            return jsonify({"message": "Envoye", "data": message}), 201