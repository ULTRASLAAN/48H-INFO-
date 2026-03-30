from services.db_connection import DatabaseConnection

class MessageService:
    def __init__(self):
        self.db = DatabaseConnection()

    def send_message(self, sender_id, receiver_id, content):
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            query = "INSERT INTO messages (sender_id, receiver_id, content) VALUES (%s, %s, %s)"
            cursor.execute(query, (sender_id, receiver_id, content))
            conn.commit()
            msg_id = cursor.lastrowid
            
            cursor.execute("SELECT * FROM messages WHERE id = %s", (msg_id,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

    def get_messages_for_user(self, user_id):
        conn = self.db.get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            query = "SELECT * FROM messages WHERE receiver_id = %s OR sender_id = %s ORDER BY sent_at ASC"
            cursor.execute(query, (user_id, user_id))
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()