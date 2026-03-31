import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from .db_config import get_db_connection

class MarketRoutes:
    def __init__(self):
        self.blueprint = Blueprint('market', __name__)
        self.setup_routes()

    def setup_routes(self):
        @self.blueprint.route('/api/products', methods=['GET'])
        def get_products():
            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            query = "SELECT p.*, u.prenom FROM products p JOIN users u ON p.seller_id = u.id ORDER BY p.id DESC"
            cursor.execute(query)
            products = cursor.fetchall()
            db.close()
            return jsonify({"products": products})

        @self.blueprint.route('/api/products', methods=['POST'])
        def add_product():
            try:
                title = request.form.get('title')
                price = request.form.get('price')
                description = request.form.get('description')
                seller_id = request.form.get('seller_id')
                file = request.files.get('image')

                filename = "default.jpg"
                if file:
                    filename = secure_filename(file.filename)
                    file.save(os.path.join('static/uploads', filename))

                db = get_db_connection()
                cursor = db.cursor()
                cursor.execute(
                    "INSERT INTO products (title, price, description, seller_id, image_url) VALUES (%s, %s, %s, %s, %s)",
                    (title, price, description, seller_id, filename)
                )
                db.commit()
                db.close()
                return jsonify({"status": "ok"}), 201
            except Exception as e:
                return jsonify({"erreur": str(e)}), 500