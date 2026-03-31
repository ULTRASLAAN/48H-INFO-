from flask import Blueprint, request, jsonify
from .db_config import get_db_connection

class FeedRoutes:
    def __init__(self):
        self.blueprint = Blueprint('feed', __name__)
        self.setup_routes()

    def setup_routes(self):
        # Récupérer les posts
        @self.blueprint.route('/api/feed', methods=['GET'])
        def get_posts():
            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            # On joint la table users pour avoir le nom de l'auteur
            query = """
                SELECT p.*, u.prenom as author_name 
                FROM posts p 
                JOIN users u ON p.user_id = u.id 
                ORDER BY p.created_at DESC
            """
            cursor.execute(query)
            posts = cursor.fetchall()
            db.close()
            return jsonify({"posts": posts})

        # Créer un post
        @self.blueprint.route('/api/feed', methods=['POST'])
        def create_post():
            data = request.json
            db = get_db_connection()
            cursor = db.cursor()
            try:
                # Vérifie que user_id et content sont présents
                query = "INSERT INTO posts (user_id, content) VALUES (%s, %s)"
                cursor.execute(query, (data['user_id'], data['content']))
                db.commit()
                return jsonify({"status": "ok"}), 201
            except Exception as e:
                print(f"Erreur BDD : {e}")
                return jsonify({"erreur": str(e)}), 500
            finally:
                db.close()