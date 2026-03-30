from services.db_connection import DatabaseConnection

class FeedService:
    def __init__(self):
        self.db = DatabaseConnection()

    def create_post(self, user_id, content):
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            query = "INSERT INTO posts (user_id, content) VALUES (%s, %s)"
            cursor.execute(query, (user_id, content))
            conn.commit()
            post_id = cursor.lastrowid
            
            cursor.execute("SELECT * FROM posts WHERE id = %s", (post_id,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

    def get_all_posts(self):
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM posts ORDER BY created_at DESC")
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()