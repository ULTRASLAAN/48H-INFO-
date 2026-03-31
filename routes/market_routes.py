import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from .db_config import get_db_connection

class MarketRoutes:
    def __init__(self):
        self.blueprint = Blueprint('market', __name__)
        self.setup_routes()

    def setup_routes(self):
        # 1. RÉCUPÉRER TOUS LES PRODUITS
        @self.blueprint.route('/api/products', methods=['GET'])
        def get_products():
            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            query = "SELECT p.*, u.prenom FROM products p JOIN users u ON p.seller_id = u.id ORDER BY p.id DESC"
            cursor.execute(query)
            products = cursor.fetchall()
            db.close()
            return jsonify({"products": products})

        # 2. AJOUTER UN PRODUIT
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
                    upload_folder = 'static/uploads'
                    if not os.path.exists(upload_folder):
                        os.makedirs(upload_folder)
                    file.save(os.path.join(upload_folder, filename))

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

        # 3. MODIFIER UN PRODUIT (Sécurisé : Uniquement le vendeur)
        @self.blueprint.route('/api/products/<int:product_id>', methods=['PUT'])
        def update_product(product_id):
            data = request.json
            user_id = data.get('user_id')
            
            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            try:
                cursor.execute("SELECT seller_id FROM products WHERE id = %s", (product_id,))
                prod = cursor.fetchone()
                if not prod: return jsonify({"erreur": "Produit introuvable"}), 404
                
                if int(prod['seller_id']) != int(user_id):
                    return jsonify({"erreur": "Non autorisé : Seul le vendeur peut modifier cette annonce."}), 403

                cursor.execute(
                    "UPDATE products SET title=%s, price=%s, description=%s WHERE id=%s",
                    (data['title'], data['price'], data['description'], product_id)
                )
                db.commit()
                return jsonify({"status": "ok"})
            finally:
                db.close()

        # 4. SUPPRIMER UN PRODUIT (Sécurisé : Vendeur OU Admin)
        @self.blueprint.route('/api/products/<int:product_id>', methods=['DELETE'])
        def delete_product(product_id):
            user_id = request.args.get('user_id')
            user_role = request.args.get('user_role')
            
            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            try:
                cursor.execute("SELECT seller_id FROM products WHERE id = %s", (product_id,))
                prod = cursor.fetchone()
                if not prod: return jsonify({"erreur": "Produit introuvable"}), 404
                
                # SÉCURITÉ : Le vendeur ou l'admin ont le droit de supprimer
                if int(prod['seller_id']) != int(user_id) and user_role != 'admin':
                    return jsonify({"erreur": "Non autorisé"}), 403

                cursor.execute("DELETE FROM products WHERE id = %s", (product_id,))
                db.commit()
                return jsonify({"status": "ok"})
            finally:
                db.close()