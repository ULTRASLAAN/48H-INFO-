class JobService:
    def __init__(self):
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
        
        self.jobs_mock_db = [
            {"id": 1, "title": "Developpeur Fullstack", "company": "TechCorp", "type": "Alternance", "cursus": "Formation Informatique"},
            {"id": 2, "title": "Analyste SOC", "company": "CyberDefense", "type": "Stage", "cursus": "Formation Cybersécurité"},
            {"id": 3, "title": "Game Artist 3D", "company": "StudioPlay", "type": "Alternance", "cursus": "Formation 3D, Animation, Jeu Vidéo & Technologies Immersives"},
            {"id": 4, "title": "Prompt Engineer", "company": "AI Innovate", "type": "Stage", "cursus": "Formation Digital & IA"},
            {"id": 5, "title": "UX/UI Designer", "company": "CreativeAgency", "type": "Alternance", "cursus": "Formation Création & Digital Design"}
        ]

    def get_all_jobs(self):
        return self.jobs_mock_db

    def get_jobs_by_cursus(self, cursus_name):
        return [job for job in self.jobs_mock_db if job['cursus'] == cursus_name]

    def get_cursus_list(self):
        return self.cursus_ynov