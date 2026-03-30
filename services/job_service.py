from services.db_connection import DatabaseConnection

class JobService:
    def __init__(self):
        self.db = DatabaseConnection()
        self.cursus_ynov = [
            "Formation 3D, Animation, Jeu Vidéo & Technologies Immersives",
            "Formation Architecture d'Intérieur",
            "Formation Audiovisuel",
            "Formation Bâtiment Numérique",
            "Formation Création & Digital Design",
            "Formation Cybersécurité",
            "Formation Digital & IA",
            "Formation Informatique"
        ]

    def get_all_jobs(self):
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM jobs ORDER BY created_at DESC")
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()

    def get_jobs_by_cursus(self, cursus_name):
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM jobs WHERE cursus = %s ORDER BY created_at DESC", (cursus_name,))
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()

    def get_cursus_list(self):
        return self.cursus_ynov