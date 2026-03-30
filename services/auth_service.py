import hashlib
from services.db_connection import DatabaseConnection

class AuthService:
    def __init__(self):
        self.db = DatabaseConnection()

    def hash_password(self, password):
        return hashlib.sha256(password.encode()).hexdigest()

    def register_user(self, nom, prenom, email, password, date_naissance, age, cursus, cv_filename=None):
        if not email.endswith("@ynov.com"):
            raise ValueError("L'adresse mail doit se terminer par @ynov.com")

        hashed_password = self.hash_password(password)
        
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        try:
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cursor.fetchone():
                raise ValueError("Cet email est deja utilise")

            query = """
                INSERT INTO users (nom, prenom, email, password, date_naissance, age, cursus, cv_filename)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (nom, prenom, email, hashed_password, date_naissance, age, cursus, cv_filename))
            conn.commit()
            
            return {"email": email}
        finally:
            cursor.close()
            conn.close()

    def login_user(self, email, password):
        hashed_password = self.hash_password(password)
        
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        try:
            cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, hashed_password))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()