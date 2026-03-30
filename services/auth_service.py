import hashlib

class AuthService:
    def __init__(self):
        self.users_mock_db = []

    def hash_password(self, password):
        return hashlib.sha256(password.encode()).hexdigest()

    def register_user(self, email, password):
        hashed_password = self.hash_password(password)
        new_user = {"email": email, "password": hashed_password}
        self.users_mock_db.append(new_user)
        return new_user