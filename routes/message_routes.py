from flask import Blueprint, request, jsonify
from .db_config import get_db_connection

class MessageRoutes:
    def __init__(self):
        self.blueprint = Blueprint('messages', __name__)
        self.setup_routes()

    def setup_routes(self):
        @self.blueprint.route('/api/chat/messages', methods=['GET'])
        def get_messages():
            last_id = request.args.get('last_id', 0)
            group_id = request.args.get('group_id')
            receiver_id = request.args.get('receiver_id')
            user_id = request.args.get('user_id')
            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            try:
                if receiver_id and receiver_id != 'null':
                    query = """
                        SELECT m.*, u.prenom as sender_name 
                        FROM messages m JOIN users u ON m.sender_id = u.id 
                        WHERE m.id > %s AND (
                            (m.sender_id = %s AND m.receiver_id = %s) OR 
                            (m.sender_id = %s AND m.receiver_id = %s)
                        ) ORDER BY m.created_at ASC
                    """
                    cursor.execute(query, (last_id, user_id, receiver_id, receiver_id, user_id))
                else:
                    grp_val = int(group_id) if group_id and group_id != 'null' else 0
                    query = "SELECT m.*, u.prenom as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.group_id = %s AND m.receiver_id IS NULL AND m.id > %s ORDER BY m.created_at ASC"
                    cursor.execute(query, (grp_val, last_id))
                messages = cursor.fetchall()
                return jsonify({"messages": messages}), 200
            except Exception as e:
                return jsonify({"erreur": str(e)}), 500
            finally:
                db.close()

        @self.blueprint.route('/api/chat/messages', methods=['POST'])
        def send_message():
            data = request.json
            if not data or 'content' not in data:
                return jsonify({"erreur": "Message vide"}), 400
                
            group_id = data.get('group_id')
            receiver_id = data.get('receiver_id')
            
            db = get_db_connection()
            cursor = db.cursor()
            try:
                if receiver_id:
                    # Insertion Message Privé
                    query = "INSERT INTO messages (sender_id, receiver_id, content) VALUES (%s, %s, %s)"
                    cursor.execute(query, (data['sender_id'], receiver_id, data['content']))
                else:
                    # Insertion Groupe
                    grp_val = int(group_id) if group_id else 0
                    query = "INSERT INTO messages (sender_id, group_id, content) VALUES (%s, %s, %s)"
                    cursor.execute(query, (data['sender_id'], grp_val, data['content']))
                db.commit()
                return jsonify({"status": "ok"}), 201
            except Exception as e:
                return jsonify({"erreur": str(e)}), 500
            finally:
                db.close()