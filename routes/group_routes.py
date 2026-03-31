from flask import Blueprint, request, jsonify
from .db_config import get_db_connection

class GroupRoutes:
    def __init__(self):
        self.blueprint = Blueprint('groups', __name__)
        self.setup_routes()

    def setup_routes(self):
        # 1. CRÉER UN GROUPE (et ajouter les amis)
        @self.blueprint.route('/api/groups/create', methods=['POST'])
        def create_group():
            data = request.json
            db = get_db_connection()
            cursor = db.cursor()
            try:
                cursor.execute("INSERT INTO chat_groups (name, created_by) VALUES (%s, %s)", (data['name'], data['user_id']))
                g_id = cursor.lastrowid
                
                # Ajout du créateur
                cursor.execute("INSERT INTO group_members (group_id, user_id) VALUES (%s, %s)", (g_id, data['user_id']))
                
                # Ajout des amis sélectionnés
                friend_ids = data.get('friend_ids', [])
                for f_id in friend_ids:
                    cursor.execute("INSERT INTO group_members (group_id, user_id) VALUES (%s, %s)", (g_id, f_id))
                    
                db.commit()
                return jsonify({"status": "ok", "group_id": g_id}), 201
            finally:
                db.close()

        # 2. RÉCUPÉRER LA LISTE DE MES GROUPES (La route manquante !)
        @self.blueprint.route('/api/groups', methods=['GET'])
        def get_groups():
            u_id = request.args.get('user_id')
            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            try:
                # On récupère tous les groupes dont l'utilisateur fait partie
                query = """
                    SELECT cg.id, cg.name 
                    FROM chat_groups cg 
                    JOIN group_members gm ON cg.id = gm.group_id 
                    WHERE gm.user_id = %s
                """
                cursor.execute(query, (u_id,))
                groups = cursor.fetchall()
                return jsonify({"groups": groups}), 200
            except Exception as e:
                return jsonify({"erreur": str(e)}), 500
            finally:
                db.close()