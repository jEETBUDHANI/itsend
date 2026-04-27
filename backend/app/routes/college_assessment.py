"""
COLLEGE ASSESSMENT ROUTES
API endpoints for College (Execution phase) assessment
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import ModuleAssessmentResult, db, User
from app.data.college_questions import COLLEGE_BASE_QUESTIONS
from app.ml.college_engine import CollegeAssessmentEngine

college_bp = Blueprint('college_assessment', __name__, url_prefix='/api/college')

engine = CollegeAssessmentEngine()


@college_bp.route('/questions/base', methods=['GET'])
@jwt_required()
def get_college_base_questions():
    """Get all 12 College base assessment questions"""
    try:
        return jsonify({
            'questions': COLLEGE_BASE_QUESTIONS,
            'total': len(COLLEGE_BASE_QUESTIONS),
            'description': 'College Execution Phase Assessment'
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@college_bp.route('/submit/assessment', methods=['POST'])
@jwt_required()
def submit_college_assessment():
    """Submit College assessment answers and get recommendations"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        # Get user's specialization
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Use specialization from data or user profile, default to CS
        specialization = data.get('specialization') or user.specialization or 'COMPUTER_SCIENCE'
        
        # Ensure skill level is int
        internship_count = int(data.get('internship_count', 0)) if data.get('internship_count') else 0
        skill_level = int(data.get('skill_level', 3)) if data.get('skill_level') else 3
        communication_level = int(data.get('communication_level', 3)) if data.get('communication_level') else 3
        interview_confidence = int(data.get('interview_confidence', 3)) if data.get('interview_confidence') else 3
        network_strength = int(data.get('network_strength', 2)) if data.get('network_strength') else 2
        
        # Process answers
        answers = {
            'internship_count': internship_count,
            'skill_level': skill_level,
            'skill_areas': data.get('skill_areas', []),
            'target_companies': str(data.get('target_companies', '')),
            'salary_expectation': str(data.get('salary_expectation', '')),
            'portfolio_status': str(data.get('portfolio_status', 'Not yet')),
            'communication_level': communication_level,
            'interview_confidence': interview_confidence,
            'environment_pref': str(data.get('environment_pref', '')),
            'network_strength': network_strength,
            'higher_studies': str(data.get('higher_studies', '')),
            'placement_timeline': str(data.get('placement_timeline', 'Immediate'))
        }
        
        # Run assessment engine
        result = engine.process_assessment(answers, specialization)
        
        # Store result in database
        assessment_result = ModuleAssessmentResult(
            user_id=user_id,
            module_type='college',
            assessment_key='base_assessment',
            input_payload=answers,
            score_payload=result
        )
        db.session.add(assessment_result)
        
        # Update user's module info
        user.education_module = 'college'
        user.module_goal = result.get('job_recommendations', [{}])[0].get('title', '')
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'result': result,
            'message': 'College assessment completed successfully'
        }), 200
        
    except Exception as e:
        import traceback
        db.session.rollback()
        print("Error in college assessment:", str(e))
        print(traceback.format_exc())
        return jsonify({'error': str(e), 'trace': traceback.format_exc()}), 500


@college_bp.route('/results', methods=['GET'])
@jwt_required()
def get_user_college_results():
    """Get all College assessment results for current user"""
    try:
        user_id = int(get_jwt_identity())
        
        results = ModuleAssessmentResult.query.filter_by(
            user_id=user_id,
            module_type='college'
        ).order_by(ModuleAssessmentResult.created_at.desc()).all()
        
        return jsonify({
            'total_results': len(results),
            'results': [
                {
                    'id': r.id,
                    'created_at': r.created_at.isoformat(),
                    'input_payload': r.input_payload,
                    'score_payload': r.score_payload
                } for r in results
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@college_bp.route('/progress', methods=['GET'])
@jwt_required()
def get_college_progress():
    """Get College assessment progress"""
    try:
        user_id = int(get_jwt_identity())
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if assessment is completed
        result = ModuleAssessmentResult.query.filter_by(
            user_id=user_id,
            module_type='college'
        ).first()
        
        return jsonify({
            'completed': result is not None,
            'module': 'college',
            'specialization': user.specialization,
            'module_goal': user.module_goal
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
