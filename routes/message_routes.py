from flask import Blueprint, request, jsonify
from .db_config import get_db_connection
class MessageRoutes:
    def __init__(self):
        self.blueprint = Blueprint('messages', __name__)
        self.setup_routes()
    def setup_routes(self):
        # RÉCUPÉRER LES MESSAGES
        @self.blueprint.route('/api/chat/general', methods=['GET'])
        def get_general_messages():
            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            try:
                # Jointure pour afficher le PRÉNOM de celui qui a envoyé le message
                query = "SELECT m.*, u.prenom as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.group_id = 0 ORDER BY m.created_at ASC"
                cursor.execute(query)
                messages = cursor.fetchall()
                return jsonify({"messages": messages}), 200
            except Exception as e:
                return jsonify({"erreur": str(e)}), 500
            finally:
                db.close()
        # ENVOYER UN MESSAGE
        @self.blueprint.route('/api/chat/general', methods=['POST'])
        def send_general_message():
            data = request.json
            if not data or 'content' not in data:
                return jsonify({"erreur": "Message vide"}), 400
            db = get_db_connection()
            cursor = db.cursor()
            try:
                # On insère sender_id, le contenu et group_id=0 pour le chat global
                query = "INSERT INTO messages (sender_id, content, group_id) VALUES (%s, %s, 0)"
                cursor.execute(query, (data['sender_id'], data['content']))
                db.commit()
                return jsonify({"status": "ok"}), 201
            except Exception as e:
                return jsonify({"erreur": str(e)}), 500
            finally:
                db.close()