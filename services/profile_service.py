from services.db_connection import DatabaseConnection

class ProfileService:
    def __init__(self):
        self.db = DatabaseConnection()

    def get_profile(self, user_id):
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            query = "SELECT id, nom, prenom, email, age, cursus, bio, status, cv_filename FROM users WHERE id = %s"
            cursor.execute(query, (user_id,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

    def update_profile(self, user_id, skills, bio, status):
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            query = "UPDATE users SET bio = %s, status = %s WHERE id = %s"
            cursor.execute(query, (bio, status, user_id))
            conn.commit()
            
            query_select = "SELECT id, nom, prenom, email, age, cursus, bio, status, cv_filename FROM users WHERE id = %s"
            cursor.execute(query_select, (user_id,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()