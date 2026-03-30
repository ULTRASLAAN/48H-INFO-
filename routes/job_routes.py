from flask import Blueprint, request, jsonify
from services.job_service import JobService

class JobRoutes:
    def __init__(self):
        self.blueprint = Blueprint('jobs', __name__)
        self.job_service = JobService()
        self.register_routes()

    def register_routes(self):
        @self.blueprint.route('/api/jobs', methods=['GET'])
        def get_jobs():
            cursus_filter = request.args.get('cursus')
            
            if cursus_filter:
                jobs = self.job_service.get_jobs_by_cursus(cursus_filter)
            else:
                jobs = self.job_service.get_all_jobs()
                
            return jsonify({"jobs": jobs}), 200

        @self.blueprint.route('/api/cursus', methods=['GET'])
        def get_cursus():
            cursus_list = self.job_service.get_cursus_list()
            return jsonify({"cursus": cursus_list}), 200