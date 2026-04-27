"""
Career Paths and Jobs API endpoints
Public access to browse career options
"""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models_extended import CareerPath, ExamPreparation, Job
from app import db
from app.data.career_library import CAREER_LIBRARY

careers_bp = Blueprint('careers', __name__)


@careers_bp.route('/paths', methods=['GET'])
def get_career_paths():
    """Get all career paths (Public)"""
    try:
        paths = CareerPath.query.all()
        return jsonify({
            'success': True,
            'career_paths': [path.to_dict() for path in paths]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@careers_bp.route('/paths/<int:path_id>', methods=['GET'])
def get_career_path(path_id):
    """Get single career path details (Public)"""
    try:
        path = CareerPath.query.get_or_404(path_id)
        
        # Get associated exams and jobs
        exams = ExamPreparation.query.filter_by(career_path_id=path_id).all()
        jobs = Job.query.filter_by(career_path_id=path_id).all()
        
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
    """Get all exam preparations (Public)"""
    try:
        exams = ExamPreparation.query.all()
        return jsonify({
            'success': True,
            'exams': [exam.to_dict() for exam in exams]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@careers_bp.route('/jobs', methods=['GET'])
def get_jobs():
    """Get all jobs - limited info for public, full for authenticated"""
    try:
        # Check if user is authenticated
        from flask_jwt_extended import verify_jwt_in_request
        try:
            verify_jwt_in_request(optional=True)
            is_authenticated = True
        except:
            is_authenticated = False
        
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
        
        jobs = query.all()
        
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
            'total': len(jobs_data),
            'authenticated': is_authenticated
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@careers_bp.route('/jobs/<int:job_id>', methods=['GET'])
@jwt_required()
def get_job_details(job_id):
    """Get detailed job information (Requires login)"""
    try:
        job = Job.query.get_or_404(job_id)
        career_path = CareerPath.query.get(job.career_path_id)
        
        return jsonify({
            'success': True,
            'job': job.to_dict(),
            'career_path': career_path.to_dict() if career_path else None
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
