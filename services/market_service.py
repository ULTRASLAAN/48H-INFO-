from services.db_connection import DatabaseConnection

class MarketService:
    def __init__(self):
        self.db = DatabaseConnection()

    def create_product(self, seller_id, title, description, price):
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            query = "INSERT INTO products (seller_id, title, description, price) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (seller_id, title, description, price))
            conn.commit()
            prod_id = cursor.lastrowid
            
            cursor.execute("SELECT * FROM products WHERE id = %s", (prod_id,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

    def get_all_products(self):
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM products ORDER BY created_at DESC")
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()