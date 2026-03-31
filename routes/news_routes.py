from flask import Blueprint, jsonify
from .db_config import get_db_connection

class NewsRoutes:
    def __init__(self):
        self.blueprint = Blueprint('news', __name__)
        self.setup_routes()

    def setup_routes(self):
        @self.blueprint.route('/api/news', methods=['GET'])
        def get_news():
            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            cursor.execute("SELECT * FROM news ORDER BY created_at DESC LIMIT 5")
            news = cursor.fetchall()
            db.close()
            # TRÈS IMPORTANT : renvoyer un objet avec la clé "news"
            return jsonify({"news": news})