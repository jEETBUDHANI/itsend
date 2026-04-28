"""
Career Paths and Jobs API endpoints
Public access to browse career options
"""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.orm import joinedload
from app.models_extended import CareerPath, ExamPreparation, Job
from app import db
from app.data.career_library import CAREER_LIBRARY

careers_bp = Blueprint('careers', __name__)

# Pagination constants
DEFAULT_PAGE = 1
DEFAULT_PER_PAGE = 20
MAX_PER_PAGE = 100


@careers_bp.route('/paths', methods=['GET'])
def get_career_paths():
    """Get all career paths with pagination (Public)"""
    try:
        page = request.args.get('page', DEFAULT_PAGE, type=int)
        per_page = min(request.args.get('per_page', DEFAULT_PER_PAGE, type=int), MAX_PER_PAGE)
        
        # Eager load relationships to avoid N+1 queries
        pagination = CareerPath.query.options(
            joinedload(CareerPath.jobs),
            joinedload(CareerPath.exam_preparations)
        ).paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'success': True,
            'career_paths': [path.to_dict() for path in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@careers_bp.route('/paths/<int:path_id>', methods=['GET'])
def get_career_path(path_id):
    """Get single career path details with eager loading (Public)"""
    try:
        # Use eager loading to fetch path with related exams and jobs in ONE query
        path = CareerPath.query.options(
            joinedload(CareerPath.exam_preparations),
            joinedload(CareerPath.jobs)
        ).get_or_404(path_id)
        
        # Data is already loaded, no separate queries needed
        exams = path.exam_preparations
        jobs = path.jobs
        
        return jsonify({
            'success': True,
            'career_path': path.to_dict(),
            'exam_preparations': [exam.to_dict() for exam in exams],
            'jobs': [job.to_dict() for job in jobs]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@careers_bp.route('/exams', methods=['GET'])
def get_exams():
    """Get all exam preparations with pagination (Public)"""
    try:
        page = request.args.get('page', DEFAULT_PAGE, type=int)
        per_page = min(request.args.get('per_page', DEFAULT_PER_PAGE, type=int), MAX_PER_PAGE)
        
        pagination = ExamPreparation.query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'exams': [exam.to_dict() for exam in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@careers_bp.route('/jobs', methods=['GET'])
def get_jobs():
    """Get all jobs with pagination and filters"""
    try:
        # Check if user is authenticated
        from flask_jwt_extended import verify_jwt_in_request
        try:
            verify_jwt_in_request(optional=True)
            is_authenticated = True
        except:
            is_authenticated = False
        
        # Pagination
        page = request.args.get('page', DEFAULT_PAGE, type=int)
        per_page = min(request.args.get('per_page', DEFAULT_PER_PAGE, type=int), MAX_PER_PAGE)
        
        # Query filters
        career_path_id = request.args.get('career_path_id', type=int)
        min_salary = request.args.get('min_salary', type=float)
        max_salary = request.args.get('max_salary', type=float)
        
        query = Job.query
        
        if career_path_id:
            query = query.filter_by(career_path_id=career_path_id)
        if min_salary:
            query = query.filter(Job.avg_salary_min >= min_salary)
        if max_salary:
            query = query.filter(Job.avg_salary_max <= max_salary)
        
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        jobs = pagination.items
        
        # For public users, show limited info
        if not is_authenticated:
            jobs_data = [{
                'id': job.id,
                'title': job.title,
                'avg_salary_min': job.avg_salary_min,
                'avg_salary_max': job.avg_salary_max,
                'salary_range': f'₹{job.avg_salary_min}-{job.avg_salary_max} LPA',
                'required_education': job.required_education,
                'career_path_id': job.career_path_id
            } for job in jobs]
        else:
            jobs_data = [job.to_dict() for job in jobs]
        
        return jsonify({
            'success': True,
            'jobs': jobs_data,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
            'authenticated': is_authenticated
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@careers_bp.route('/jobs/<int:job_id>', methods=['GET'])
@jwt_required()
def get_job_details(job_id):
    """Get detailed job information with eager loading (Requires login)"""
    try:
        # Use eager loading to fetch job with related career_path in one query
        job = Job.query.options(
            joinedload(Job.career_path)
        ).get_or_404(job_id)
        
        return jsonify({
            'success': True,
            'job': job.to_dict(),
            'career_path': job.career_path.to_dict() if job.career_path else None
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@careers_bp.route('/detail/<career_name>', methods=['GET'])
@jwt_required()
def get_career_detail_by_name(career_name):
    """Get detailed career data from CAREER_LIBRARY by career name."""
    try:
        # Route params may come URL-encoded from frontend.
        normalized_key = career_name.strip()
        career = CAREER_LIBRARY.get(normalized_key)

        if not career:
            # Case-insensitive fallback.
            lowered = normalized_key.lower()
            for key, value in CAREER_LIBRARY.items():
                if key.lower() == lowered:
                    career = value
                    normalized_key = key
                    break

        if not career:
            return jsonify({'error': 'Career not found'}), 404

        required_skills = []
        for skill in career.get('required_skills', {}).get('technical', []):
            required_skills.append({'name': skill, 'level': 85, 'category': 'technical'})
        for skill in career.get('required_skills', {}).get('soft', []):
            required_skills.append({'name': skill, 'level': 70, 'category': 'soft'})

        salary = career.get('salary', {})
        salary_data = [
            {'exp': '0-2 years', 'avg': 800000},
            {'exp': '2-5 years', 'avg': 1500000},
            {'exp': '5-8 years', 'avg': 2500000},
            {'exp': '8+ years', 'avg': 4000000}
        ]

        return jsonify({
            'name': normalized_key,
            'title': normalized_key,
            'description': career.get('overview', ''),
            'demand': career.get('market_outlook', {}).get('demand', 'High'),
            'avgSalary': salary.get('mid', 'Varies'),
            'salaryRange': f"{salary.get('entry', 'Varies')} - {salary.get('senior', 'Varies')}",
            'requiredSkills': required_skills,
            'education': [
                {
                    'degree': career.get('education', {}).get('minimum', 'Relevant degree'),
                    'duration': '3-4 years'
                },
                {
                    'degree': career.get('education', {}).get('preferred', 'Portfolio and practical experience'),
                    'duration': 'Ongoing'
                }
            ],
            'salaryData': salary_data,
            'growthPath': career.get('growth_path', []),
            'pros': career.get('pros', []),
            'cons': career.get('cons', [])
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
