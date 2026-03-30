from services.db_connection import DatabaseConnection

class NewsService:
    def __init__(self):
        self.db = DatabaseConnection()

    def get_all_news(self):
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM news ORDER BY created_at DESC")
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()