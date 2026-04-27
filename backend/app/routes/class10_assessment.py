"""Class 10 Assessment Routes - Two-Layer Stream Selection"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, ModuleAssessmentResult
from app.ml.class10_engine import create_class10_engine

class10_bp = Blueprint('class10', __name__, url_prefix='/api/class10')
engine = create_class10_engine()


@class10_bp.route('/questions/base', methods=['GET'])
@jwt_required()
def get_base_questions():
    """Get Layer 1 base assessment questions for Class 10"""
    try:
        questions = engine.get_base_questions()
        return jsonify({
            'message': 'Base assessment questions loaded',
            'layer': 'layer1',
            'questions': questions,
            'total_questions': len(questions),
            'instructions': 'Answer all questions to help us understand your interests and strengths. This will help predict the best stream for you.'
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@class10_bp.route('/submit/base', methods=['POST'])
@jwt_required()
def submit_base_assessment():
    """Submit Layer 1 base assessment and get stream prediction"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data or not data.get('answers'):
            return jsonify({'error': 'Answers are required'}), 400
        
        answers = data['answers']
        
        # Process base assessment through engine
        stream_prediction = engine.process_base_assessment(answers)
        
        # Store Layer 1 result in database
        layer1_result = ModuleAssessmentResult(
            user_id=user_id,
            module_type='class10',
            assessment_key='layer1_base',
            input_payload=answers,
            score_payload={
                'stream_prediction': stream_prediction['stream_prediction'],
                'stream_confidence': stream_prediction['stream_confidence'],
                'stream_scores': stream_prediction['stream_scores'],
                'predicted_specialization': stream_prediction.get('predicted_specialization')
            }
        )
        db.session.add(layer1_result)
        db.session.commit()
        
        return jsonify({
            'message': 'Layer 1 assessment completed',
            'stream_prediction': stream_prediction['stream_prediction'],
            'stream_confidence': stream_prediction['stream_confidence'],
            'stream_scores': stream_prediction['stream_scores'],
            'description': stream_prediction['prediction_details']['description'],
            'career_matches': stream_prediction['prediction_details']['career_matches'],
            'predicted_specialization': stream_prediction.get('predicted_specialization'),
            'next_step': 'layer2_assessment',
            'layer1_complete': True
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@class10_bp.route('/questions/layer2', methods=['POST'])
@jwt_required()
def get_layer2_questions():
    """Get Layer 2 stream-specific questions"""
    try:
        data = request.get_json()
        
        if not data or not data.get('stream'):
            return jsonify({'error': 'Stream is required'}), 400
        
        stream = data['stream']
        if stream not in ['science', 'commerce', 'arts']:
            return jsonify({'error': 'Invalid stream. Must be science, commerce, or arts'}), 400
        
        questions = engine.get_layer2_questions(stream)
        
        return jsonify({
            'message': f'Layer 2 {stream.capitalize()} assessment questions loaded',
            'layer': 'layer2',
            'stream': stream,
            'questions': questions,
            'total_questions': len(questions),
            'instructions': f'Answer these {stream.capitalize()}-specific questions to refine your career recommendations.'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@class10_bp.route('/submit/layer2', methods=['POST'])
@jwt_required()
def submit_layer2_assessment():
    """Submit Layer 2 stream-specific assessment and get final recommendations"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        required_fields = ['stream', 'layer1_results', 'answers']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': 'stream, layer1_results, and answers are required'}), 400
        
        stream = data['stream']
        layer1_results = data['layer1_results']
        layer2_answers = data['answers']
        specialization = data.get('predicted_specialization', 'PCM' if stream == 'science' else None)
        
        # Validate stream
        if stream not in ['science', 'commerce', 'arts']:
            return jsonify({'error': 'Invalid stream'}), 400
        
        # Process Layer 2 through engine
        final_results = engine.process_layer2_assessment(
            stream=stream,
            specialization=specialization,
            layer1_results=layer1_results,
            layer2_answers=layer2_answers
        )
        
        # Store Layer 2 result
        layer2_result = ModuleAssessmentResult(
            user_id=user_id,
            module_type='class10',
            assessment_key='layer2_stream_specific',
            input_payload={
                'stream': stream,
                'specialization': specialization,
                'layer2_answers': layer2_answers
            },
            score_payload={
                'layer2_scores': final_results['layer2_scores'],
                'career_clusters': [c['name'] for c in final_results['career_clusters']],
                'top_3_careers': [c['name'] for c in final_results['recommended_careers']],
                'roadmap_phases': len(final_results['roadmap']['phases'])
            }
        )
        db.session.add(layer2_result)
        
        # Update user profile with stream and specialization
        user = User.query.get(user_id)
        if user:
            user.current_stream = stream
            if specialization:
                user.module_goal = f"{stream.upper()}: {specialization}"
            db.session.add(user)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Class 10 assessment completed successfully',
            'stream': stream,
            'specialization': specialization,
            'layer2_scores': final_results['layer2_scores'],
            'career_clusters': final_results['career_clusters'],
            'recommended_careers': final_results['recommended_careers'],
            'why_this_stream': final_results['why_this_stream'],
            'roadmap': final_results['roadmap'],
            'next_step': 'show_dashboard',
            'assessment_complete': True
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@class10_bp.route('/results/<int:result_id>', methods=['GET'])
@jwt_required()
def get_assessment_result(result_id):
    """Retrieve saved assessment result"""
    try:
        user_id = int(get_jwt_identity())
        
        result = ModuleAssessmentResult.query.filter_by(
            id=result_id,
            user_id=user_id,
            module_type='class10'
        ).first()
        
        if not result:
            return jsonify({'error': 'Result not found'}), 404
        
        return jsonify({
            'id': result.id,
            'assessment_key': result.assessment_key,
            'input_payload': result.input_payload,
            'score_payload': result.score_payload,
            'created_at': result.created_at.isoformat() if result.created_at else None,
            'updated_at': result.updated_at.isoformat() if result.updated_at else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@class10_bp.route('/results', methods=['GET'])
@jwt_required()
def get_user_class10_results():
    """Get all Class 10 assessment results for current user"""
    try:
        user_id = int(get_jwt_identity())
        
        results = ModuleAssessmentResult.query.filter_by(
            user_id=user_id,
            module_type='class10'
        ).order_by(ModuleAssessmentResult.created_at.desc()).all()
        
        return jsonify({
            'total_results': len(results),
            'results': [r.to_dict() for r in results]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@class10_bp.route('/progress', methods=['GET'])
@jwt_required()
def get_assessment_progress():
    """Check user's assessment progress through Class 10 flow"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        # Check which layers are completed
        layer1_result = ModuleAssessmentResult.query.filter_by(
            user_id=user_id,
            module_type='class10',
            assessment_key='layer1_base'
        ).first()
        
        layer2_result = ModuleAssessmentResult.query.filter_by(
            user_id=user_id,
            module_type='class10',
            assessment_key='layer2_stream_specific'
        ).first()
        
        return jsonify({
            'layer1_complete': layer1_result is not None,
            'layer2_complete': layer2_result is not None,
            'current_stream': user.current_stream if user else None,
            'module_goal': user.module_goal if user else None,
            'progress_percentage': 100 if (layer1_result and layer2_result) else 50 if layer1_result else 0
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
