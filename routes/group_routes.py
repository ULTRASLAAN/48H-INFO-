from flask import Blueprint, request, jsonify
from .db_config import get_db_connection

class GroupRoutes:
    def __init__(self):
        self.blueprint = Blueprint('groups', __name__)
        self.setup_routes()

    def setup_routes(self):
        @self.blueprint.route('/api/groups/create', methods=['POST'])
        def create_group():
            data = request.json
            db = get_db_connection()
            cursor = db.cursor()
            cursor.execute("INSERT INTO groups_list (name, created_by) VALUES (%s, %s)", (data['name'], data['user_id']))
            g_id = cursor.lastrowid
            cursor.execute("INSERT INTO group_members (group_id, user_id) VALUES (%s, %s)", (g_id, data['user_id']))
            db.commit()
            db.close()
            return jsonify({"status": "ok"}), 201

        @self.blueprint.route('/api/groups', methods=['GET'])
        def get_groups():
            u_id = request.args.get('user_id')
            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            cursor.execute("SELECT g.* FROM groups_list g JOIN group_members gm ON g.id = gm.group_id WHERE gm.user_id = %s", (u_id,))
            res = cursor.fetchall()
            db.close()
            return jsonify({"groups": res})