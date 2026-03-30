import datetime

class FeedService:
    def __init__(self):
        self.posts_mock_db = []
        self.post_id_counter = 1

    def create_post(self, user_id, content):
        new_post = {
            "id": self.post_id_counter,
            "user_id": user_id,
            "content": content,
            "timestamp": datetime.datetime.now().isoformat()
        }
        self.posts_mock_db.append(new_post)
        self.post_id_counter += 1
        return new_post

    def get_all_posts(self):
        return sorted(self.posts_mock_db, key=lambda x: x['timestamp'], reverse=True)