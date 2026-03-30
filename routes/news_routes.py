from flask import Blueprint, jsonify
from services.news_service import NewsService

class NewsRoutes:
    def __init__(self):
        self.blueprint = Blueprint('news', __name__)
        self.news_service = NewsService()
        self.register_routes()

    def register_routes(self):
        @self.blueprint.route('/api/news', methods=['GET'])
        def get_news():
            news = self.news_service.get_all_news()
            return jsonify({"news": news}), 200