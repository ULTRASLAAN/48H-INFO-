from flask import Blueprint, request, jsonify
from services.market_service import MarketService

class MarketRoutes:
    def __init__(self):
        self.blueprint = Blueprint('market', __name__)
        self.market_service = MarketService()
        self.register_routes()

    def register_routes(self):
        @self.blueprint.route('/api/market', methods=['GET'])
        def get_products():
            products = self.market_service.get_all_products()
            return jsonify({"products": products}), 200

        @self.blueprint.route('/api/market', methods=['POST'])
        def create_product():
            data = request.get_json()
            if not data or 'seller_id' not in data or 'title' not in data or 'price' not in data:
                return jsonify({"erreur": "Donnees manquantes"}), 400
            
            product = self.market_service.create_product(
                data['seller_id'], 
                data['title'], 
                data.get('description', ''), 
                data['price']
            )
            return jsonify({"message": "Produit ajoute", "product": product}), 201