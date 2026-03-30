class ProfileService:
    def __init__(self):
        self.profiles_mock_db = {}

    def get_profile(self, user_id):
        return self.profiles_mock_db.get(user_id, {"user_id": user_id, "skills": [], "bio": "", "status": "Disponible"})

    def update_profile(self, user_id, skills, bio, status):
        self.profiles_mock_db[user_id] = {
            "user_id": user_id, 
            "skills": skills, 
            "bio": bio,
            "status": status
        }
        return self.profiles_mock_db[user_id]