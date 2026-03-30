from flask import Blueprint, request, jsonify
from services.feed_service import FeedService

class FeedRoutes:
    def __init__(self):
        self.blueprint = Blueprint('feed', __name__)
        self.feed_service = FeedService()
        self.register_routes()

    def register_routes(self):
        @self.blueprint.route('/api/feed', methods=['GET'])
        def get_feed():
            posts = self.feed_service.get_all_posts()
            return jsonify({"posts": posts}), 200

        @self.blueprint.route('/api/feed', methods=['POST'])
        def create_post():
            data = request.get_json()
            if not data or 'content' not in data or 'user_id' not in data:
                return jsonify({"erreur": "Contenu et user_id requis"}), 400
            
            post = self.feed_service.create_post(data['user_id'], data['content'])
            return jsonify({"message": "Post publie", "post": post}), 201