import hashlib

class AuthService:
    def __init__(self):
        self.users_mock_db = []

    def hash_password(self, password):
        return hashlib.sha256(password.encode()).hexdigest()

    def register_user(self, nom, prenom, email, password, date_naissance, age, cursus):
        if not email.endswith("@ynov.com"):
            raise ValueError("L'adresse mail doit se terminer par @ynov.com")

        for user in self.users_mock_db:
            if user['email'] == email:
                raise ValueError("Cet email est deja utilise")

        hashed_password = self.hash_password(password)
        
        new_user = {
            "nom": nom,
            "prenom": prenom,
            "email": email,
            "password": hashed_password,
            "date_naissance": date_naissance,
            "age": age,
            "cursus": cursus
        }
        self.users_mock_db.append(new_user)
        return new_user

    def login_user(self, email, password):
        hashed_password = self.hash_password(password)
        for user in self.users_mock_db:
            if user['email'] == email and user['password'] == hashed_password:
                return user
        return None