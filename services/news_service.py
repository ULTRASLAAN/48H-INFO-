class NewsService:
    def __init__(self):
        self.news_mock_db = [
            {"id": 1, "title": "Challenge 48H", "category": "Hackathon"},
            {"id": 2, "title": "Evenement sportif du BDS", "category": "Sport"},
            {"id": 3, "title": "Soiree d'integration BDE", "category": "BDE"}
        ]

    def get_all_news(self):
        return self.news_mock_db