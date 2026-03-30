from services.db_connection import DatabaseConnection

class GroupService:
    def __init__(self):
        self.db = DatabaseConnection()

    def create_group(self, creator_id, name, description):
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            query = "INSERT INTO groups (name, description) VALUES (%s, %s)"
            cursor.execute(query, (name, description))
            conn.commit()
            group_id = cursor.lastrowid
            
            member_query = "INSERT INTO group_members (group_id, user_id, role) VALUES (%s, %s, 'admin')"
            cursor.execute(member_query, (group_id, creator_id))
            conn.commit()
            
            cursor.execute("SELECT * FROM groups WHERE id = %s", (group_id,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

    def get_all_groups(self):
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM groups ORDER BY created_at DESC")
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()