"""
CLASS 12 ASSESSMENT ROUTES
API endpoints for Class 12 (Decision phase) assessment
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import ModuleAssessmentResult, db, User
from app.data.class12_questions import CLASS12_BASE_QUESTIONS
from app.ml.class12_engine import Class12AssessmentEngine

class12_bp = Blueprint('class12_assessment', __name__, url_prefix='/api/class12')

engine = Class12AssessmentEngine()


@class12_bp.route('/questions/base', methods=['GET'])
@jwt_required()
def get_class12_base_questions():
    """Get all 12 Class 12 base assessment questions"""
    try:
        return jsonify({
            'questions': CLASS12_BASE_QUESTIONS,
            'total': len(CLASS12_BASE_QUESTIONS),
            'description': 'Class 12 Decision Phase Assessment'
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@class12_bp.route('/submit/assessment', methods=['POST'])
@jwt_required()
def submit_class12_assessment():
    """Submit Class 12 assessment answers and get recommendations"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        # Get user's Class 10 stream info
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user's previous Class 10 stream info
        stream_info = {
            'stream': user.current_stream or 'SCIENCE',
            'specialization': user.specialization or 'PCM'
        }
        
        # Process answers
        answers = {
            'stream': data.get('stream', stream_info.get('specialization', 'PCM')),
            'marks_range': data.get('marks_range', ''),
            'preferred_subjects': data.get('preferred_subjects', []),
            'exams': data.get('exams', []),
            'primary_goal': data.get('primary_goal', data.get('goal', '')),
            'exam_prep_level': data.get('exam_prep_level', 3),
            'college_env': data.get('college_env', ''),
            'placement_importance': data.get('placement_importance', 3),
            'budget': data.get('budget', ''),
            'scholarship_interest': data.get('scholarship_interest', ''),
            'specialization': data.get('specialization', ''),
            'campus_life': data.get('campus_life', 3),
            'abroad_interest': data.get('abroad_interest', ''),
            'interest_logical': data.get('interest_logical', 3),
            'interest_biology': data.get('interest_biology', 3),
            'interest_creative': data.get('interest_creative', 3),
            'interest_computers': data.get('interest_computers', 3),
            'interest_business': data.get('interest_business', 3),
            'self_math': data.get('self_math', 3),
            'self_communication': data.get('self_communication', 3),
            'self_creativity': data.get('self_creativity', 3),
            'self_analytical': data.get('self_analytical', 3),
            'self_discipline': data.get('self_discipline', 3),
            'preferred_location': data.get('preferred_location', ''),
            'target_rank': data.get('target_rank', ''),
        }
        
        # Run assessment engine
        result = engine.process_assessment(answers, stream_info)
        
        # Store result in database
        assessment_result = ModuleAssessmentResult(
            user_id=user_id,
            module_type='class12',
            assessment_key='base_assessment',
            input_payload=answers,
            score_payload=result
        )
        db.session.add(assessment_result)
        
        # Update user's module info
        user.education_module = 'class12'
        user.module_goal = result.get('selected_career') or result.get('degree_recommendations', [{}])[0].get('name', '')
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'result': result,
            'message': 'Class 12 assessment completed successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@class12_bp.route('/results', methods=['GET'])
@jwt_required()
def get_user_class12_results():
    """Get all Class 12 assessment results for current user"""
    try:
        user_id = int(get_jwt_identity())
        
        results = ModuleAssessmentResult.query.filter_by(
            user_id=user_id,
            module_type='class12'
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


@class12_bp.route('/progress', methods=['GET'])
@jwt_required()
def get_class12_progress():
    """Get Class 12 assessment progress"""
    try:
        user_id = int(get_jwt_identity())
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if assessment is completed
        result = ModuleAssessmentResult.query.filter_by(
            user_id=user_id,
            module_type='class12'
        ).first()
        
        return jsonify({
            'completed': result is not None,
            'module': 'class12',
            'current_stream': user.current_stream,
            'specialization': user.specialization,
            'module_goal': user.module_goal
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
