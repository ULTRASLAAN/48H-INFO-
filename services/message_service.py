from services.db_connection import DatabaseConnection

class MessageService:
    def __init__(self):
        self.db = DatabaseConnection()

    def send_message(self, sender_id, content, receiver_id=None, group_id=None):
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            query = """
                INSERT INTO messages (sender_id, receiver_id, group_id, content) 
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(query, (sender_id, receiver_id, group_id, content))
            conn.commit()
            msg_id = cursor.lastrowid
            
            cursor.execute("SELECT * FROM messages WHERE id = %s", (msg_id,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

    def get_group_messages(self, group_id):
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            query = "SELECT * FROM messages WHERE group_id = %s ORDER BY sent_at ASC"
            cursor.execute(query, (group_id,))
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()

    def get_private_conversation(self, user1_id, user2_id):
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            query = """
                SELECT * FROM messages 
                WHERE (sender_id = %s AND receiver_id = %s) 
                   OR (sender_id = %s AND receiver_id = %s)
                ORDER BY sent_at ASC
            """
            cursor.execute(query, (user1_id, user2_id, user2_id, user1_id))
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()