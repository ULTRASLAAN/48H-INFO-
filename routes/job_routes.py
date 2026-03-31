from flask import Blueprint, jsonify
from .db_config import get_db_connection

class JobRoutes:
    def __init__(self):
        self.blueprint = Blueprint('job', __name__)
        self.setup_routes()

    def setup_routes(self):
        @self.blueprint.route('/api/jobs', methods=['GET'])
        def get_jobs():
            db = get_db_connection()
            cursor = db.cursor(dictionary=True)
            cursor.execute("SELECT * FROM jobs ORDER BY created_at DESC")
            jobs = cursor.fetchall()
            db.close()
            return jsonify({"jobs": jobs})