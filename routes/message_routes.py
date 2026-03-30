from flask import Blueprint, request, jsonify
from services.message_service import MessageService

class MessageRoutes:
    def __init__(self):
        self.blueprint = Blueprint('messages', __name__)
        self.message_service = MessageService()
        self.register_routes()

    def register_routes(self):
        @self.blueprint.route('/api/messages/<int:user_id>', methods=['GET'])
        def get_messages(user_id):
            messages = self.message_service.get_messages_for_user(user_id)
            return jsonify({"messages": messages}), 200

        @self.blueprint.route('/api/messages', methods=['POST'])
        def send_message():
            data = request.get_json()
            if not data or 'sender_id' not in data or 'receiver_id' not in data or 'content' not in data:
                return jsonify({"erreur": "Donnees manquantes"}), 400
            
            message = self.message_service.send_message(
                data['sender_id'], 
                data['receiver_id'], 
                data['content']
            )
            return jsonify({"message": "Message envoye", "data": message}), 201