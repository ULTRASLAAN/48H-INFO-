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
                print("Données reçues pour maj profil :", data) # Pour le debug
                cursor.execute(
                    "UPDATE users SET prenom=%s, nom=%s, cursus=%s, bio=%s, skills=%s WHERE id=%s",
                    (data.get('prenom'), data.get('nom'), data.get('cursus'), data.get('bio'), data.get('skills', ''), data.get('id'))
                )
                db.commit()
                return jsonify({"status": "ok"}), 200
            except Exception as e:
                print("ERREUR SQL PROFIL :", str(e)) # Regarde ta console Python (Terminal) !
                return jsonify({"erreur": str(e)}), 500
            finally:
                db.close()