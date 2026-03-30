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
        self.app.config['UPLOAD_FOLDER'] = 'uploads'
        os.makedirs(self.app.config['UPLOAD_FOLDER'], exist_ok=True)
        self.setup_blueprints()
        self.setup_frontend_routes()

    def setup_blueprints(self):
        auth_routes = AuthRoutes()
        feed_routes = FeedRoutes()
        news_routes = NewsRoutes()
        profile_routes = ProfileRoutes()
        message_routes = MessageRoutes()
        job_routes = JobRoutes()
        ai_routes = AIRoutes()
        market_routes = MarketRoutes()
        group_routes = GroupRoutes()
        
        self.app.register_blueprint(auth_routes.blueprint)
        self.app.register_blueprint(feed_routes.blueprint)
        self.app.register_blueprint(news_routes.blueprint)
        self.app.register_blueprint(profile_routes.blueprint)
        self.app.register_blueprint(message_routes.blueprint)
        self.app.register_blueprint(job_routes.blueprint)
        self.app.register_blueprint(ai_routes.blueprint)
        self.app.register_blueprint(market_routes.blueprint)
        self.app.register_blueprint(group_routes.blueprint)

    def setup_frontend_routes(self):
        @self.app.route('/')
        def index():
            return render_template('test_api.html')

    def run(self):
        self.app.run(debug=True, port=5000)

if __name__ == "__main__":
    serveur = SocialNetworkApp()
    serveur.run()