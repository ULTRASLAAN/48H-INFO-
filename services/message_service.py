import datetime

class MessageService:
    def __init__(self):
        self.messages_mock_db = []
        self.message_id_counter = 1

    def send_message(self, sender_id, receiver_id, content):
        new_message = {
            "id": self.message_id_counter,
            "sender_id": sender_id,
            "receiver_id": receiver_id,
            "content": content,
            "timestamp": datetime.datetime.now().isoformat()
        }
        self.messages_mock_db.append(new_message)
        self.message_id_counter += 1
        return new_message

    def get_messages_for_user(self, user_id):
        return [m for m in self.messages_mock_db if m['receiver_id'] == user_id or m['sender_id'] == user_id]