import os
from flask import Flask, render_template
from flask_cors import CORS
from routes.auth_routes import AuthRoutes
from routes.feed_routes import FeedRoutes
from routes.news_routes import NewsRoutes
from routes.profile_routes import ProfileRoutes
from routes.message_routes import MessageRoutes
from routes.job_routes import JobRoutes
from routes.ai_routes import AIRoutes
from routes.market_routes import MarketRoutes
from routes.group_routes import GroupRoutes
class SocialNetworkApp:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)
        # Configuration du dossier pour les images de la Marketplace
        self.app.config['UPLOAD_FOLDER'] = os.path.join('static', 'uploads')
        os.makedirs(self.app.config['UPLOAD_FOLDER'], exist_ok=True)
        self.setup_blueprints()
        self.setup_frontend_routes()
    def setup_blueprints(self):
        # Initialisation et enregistrement de chaque module
        self.app.register_blueprint(AuthRoutes().blueprint)
        self.app.register_blueprint(FeedRoutes().blueprint)
        self.app.register_blueprint(NewsRoutes().blueprint)
        self.app.register_blueprint(ProfileRoutes().blueprint)
        self.app.register_blueprint(MessageRoutes().blueprint)
        self.app.register_blueprint(JobRoutes().blueprint)
        self.app.register_blueprint(AIRoutes().blueprint)
        self.app.register_blueprint(MarketRoutes().blueprint)
        self.app.register_blueprint(GroupRoutes().blueprint)
    def setup_frontend_routes(self):
        # Route principale qui sert ton fichier index.html
        @self.app.route('/')
        def index():
            return render_template('index.html')
        # Route de secours pour les tests API
        @self.app.route('/test')
        def test_api():
            return "Serveur Ynov Connect opérationnel."
    def run(self):
        # Lancement du serveur sur le port 5000
        self.app.run(debug=True, port=5000)
if __name__ == "__main__":
    serveur = SocialNetworkApp()
    serveur.run()