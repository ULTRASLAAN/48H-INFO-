from flask import Blueprint, request, jsonify
from .db_config import get_db_connection

class ProfileRoutes:
    def __init__(self):
        self.blueprint = Blueprint('profile', __name__)
        self.setup_routes()

    def setup_routes(self):
        @self.blueprint.route('/api/profile/update', methods=['POST'])
        def update_profile():
            data = request.json
            db = get_db_connection()
            cursor = db.cursor()
            try:
                cursor.execute(
                    "UPDATE users SET prenom=%s, nom=%s, cursus=%s, bio=%s WHERE id=%s",
                    (data['prenom'], data['nom'], data['cursus'], data['bio'], data['id'])
                )
                db.commit()
                return jsonify({"status": "ok"}), 200
            except Exception as e:
                return jsonify({"erreur": str(e)}), 500
            finally:
                db.close()