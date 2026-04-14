"""Assessment routes for multi-dimensional testing"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Assessment, HolisticProfile, UserProgressSnapshot
from app.ml.profile_analyzer import ProfileAnalyzer, CareerAnalyzer

assessment_bp = Blueprint('assessment', __name__)
analyzer = ProfileAnalyzer()
career_analyzer = CareerAnalyzer()


def create_progress_snapshot(user_id, assessment_type, scores):
    """Create a progress snapshot after assessment completion"""
    try:
        # Calculate aptitude score (average of all aptitude scores)
        aptitude_score = None
        if assessment_type == 'aptitude':
            aptitude_score = sum(scores.values()) / len(scores) if scores else 0
        else:
            # Get existing aptitude assessment
            aptitude_assessment = Assessment.query.filter_by(
                user_id=user_id, 
                assessment_type='aptitude'
            ).first()
            if aptitude_assessment:
                aptitude_score = sum(aptitude_assessment.scores.values()) / len(aptitude_assessment.scores)
        
        # Get holistic profile for confidence score
        holistic = HolisticProfile.query.filter_by(user_id=user_id).first()
        confidence_score = holistic.clarity_score if holistic else 0
        
        # Calculate readiness score (based on completion percentage + score quality)
        all_assessments = Assessment.query.filter_by(user_id=user_id).all()
        assessment_types = set(a.assessment_type for a in all_assessments)
        completion_percentage = len(assessment_types) / 5 * 100  # 5 assessment types
        
        readiness_score = (completion_percentage * 0.6 + confidence_score * 0.4)
        
        # Create snapshot
        snapshot = UserProgressSnapshot(
            user_id=user_id,
            aptitude_score=aptitude_score,
            confidence_score=confidence_score,
            readiness_score=readiness_score,
            assessment_type=assessment_type
        )
        
        db.session.add(snapshot)
        db.session.commit()
        
    except Exception as e:
        print(f"Error creating progress snapshot: {str(e)}")
        # Don't fail the assessment if snapshot creation fails



@assessment_bp.route('/aptitude', methods=['POST'])
@jwt_required()
def submit_aptitude():
    """Submit aptitude test"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data or not data.get('answers'):
            return jsonify({'error': 'Answers are required'}), 400
        
        # Calculate scores
        scores = calculate_aptitude_scores(data['answers'])
        
        # Save assessment
        assessment = Assessment(
            user_id=user_id,
            assessment_type='aptitude',
            scores=scores
        )
        db.session.add(assessment)
        db.session.commit()
        
        # Create progress snapshot
        create_progress_snapshot(user_id, 'aptitude', scores)
        
        # Update holistic profile
        holistic = analyzer.generate_holistic_profile(user_id)
        
        return jsonify({
            'message': 'Aptitude test submitted',
            'scores': scores,
            'holistic_profile': holistic.to_dict() if holistic else None
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@assessment_bp.route('/personality', methods=['POST'])
@jwt_required()
def submit_personality():
    """Submit personality test (Big 5)"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data or not data.get('answers'):
            return jsonify({'error': 'Answers are required'}), 400
        
        # Calculate Big 5 scores
        scores = calculate_personality_scores(data['answers'])
        
        assessment = Assessment(
            user_id=user_id,
            assessment_type='personality',
            scores=scores
        )
        db.session.add(assessment)
        db.session.commit()
        
        # Create progress snapshot
        create_progress_snapshot(user_id, 'personality', scores)
        
        holistic = analyzer.generate_holistic_profile(user_id)
        
        return jsonify({
            'message': 'Personality test submitted',
            'scores': scores,
            'holistic_profile': holistic.to_dict() if holistic else None
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@assessment_bp.route('/values', methods=['POST'])
@jwt_required()
def submit_values():
    """Submit work values assessment"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data or not data.get('answers'):
            return jsonify({'error': 'Answers are required'}), 400
        
        scores = calculate_values_scores(data['answers'])
        
        assessment = Assessment(
            user_id=user_id,
            assessment_type='values',
            scores=scores
        )
        db.session.add(assessment)
        db.session.commit()
        
        # Create progress snapshot
        create_progress_snapshot(user_id, 'values', scores)
        
        holistic = analyzer.generate_holistic_profile(user_id)
        
        return jsonify({
            'message': 'Values assessment submitted',
            'scores': scores,
            'holistic_profile': holistic.to_dict() if holistic else None
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@assessment_bp.route('/risk', methods=['POST'])
@jwt_required()
def submit_risk():
    """Submit risk tolerance assessment"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data or not data.get('answers'):
            return jsonify({'error': 'Answers are required'}), 400
        
        score = calculate_risk_score(data['answers'])
        
        assessment = Assessment(
            user_id=user_id,
            assessment_type='risk',
            scores={'risk_tolerance': score}
        )
        db.session.add(assessment)
        db.session.commit()
        
        # Create progress snapshot
        create_progress_snapshot(user_id, 'risk', {'risk_tolerance': score})
        
        holistic = analyzer.generate_holistic_profile(user_id)
        
        return jsonify({
            'message': 'Risk assessment submitted',
            'score': score,
            'holistic_profile': holistic.to_dict() if holistic else None
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@assessment_bp.route('/holistic', methods=['GET'])
@jwt_required()
def get_holistic_profile():
    """Get user's holistic career profile"""
    try:
        user_id = int(get_jwt_identity())
        
        holistic = HolisticProfile.query.filter_by(user_id=user_id).first()
        
        if not holistic:
            # Generate if doesn't exist
            holistic = analyzer.generate_holistic_profile(user_id)
        
        if not holistic:
            return jsonify({'error': 'No assessments completed yet'}), 404
        
        return jsonify({
            'profile': holistic.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@assessment_bp.route('/career-analysis/<career_name>', methods=['GET'])
@jwt_required()
def analyze_career(career_name):
    """Get confidence and risk analysis for a specific career"""
    try:
        user_id = int(get_jwt_identity())
        
        holistic = HolisticProfile.query.filter_by(user_id=user_id).first()
        
        if not holistic:
            return jsonify({'error': 'Complete assessments first'}), 404
        
        profile_data = holistic.profile_data
        
        # Calculate confidence and risk
        confidence = career_analyzer.calculate_career_confidence(profile_data, career_name)
        risk = career_analyzer.calculate_career_risk(profile_data, career_name)
        
        return jsonify({
            'career': career_name,
            'confidence': confidence,
            'risk': risk
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Helper functions
def calculate_aptitude_scores(answers):
    """Calculate aptitude scores from answers"""
    scores = {
        'logical': 0,
        'numerical': 0,
        'verbal': 0,
        'spatial': 0
    }
    
    # Simplified - count correct answers by type
    for answer in answers:
        q_type = answer.get('type', 'logical')
        if answer.get('correct', False):
            scores[q_type] = scores.get(q_type, 0) + 20
    
    return scores


def calculate_personality_scores(answers):
    """Calculate Big 5 personality scores"""
    scores = {
        'openness': 0,
        'conscientiousness': 0,
        'extraversion': 0,
        'agreeableness': 0,
        'neuroticism': 0
    }
    
    # Calculate average per trait
    trait_counts = {trait: 0 for trait in scores.keys()}
    
    for answer in answers:
        trait = answer.get('trait')
        value = answer.get('value', 3)  # 1-5 scale
        
        if trait in scores:
            scores[trait] += value * 20  # Convert to 0-100
            trait_counts[trait] += 1
    
    # Average
    for trait in scores:
        if trait_counts[trait] > 0:
            scores[trait] = scores[trait] / trait_counts[trait]
    
    return scores


def calculate_values_scores(answers):
    """Calculate work values scores"""
    scores = {
        'autonomy': 0,
        'security': 0,
        'creativity': 0,
        'helping': 0,
        'achievement': 0
    }
    
    value_counts = {v: 0 for v in scores.keys()}
    
    for answer in answers:
        value = answer.get('value')
        rating = answer.get('rating', 3)  # 1-5 scale
        
        if value in scores:
            scores[value] += rating
            value_counts[value] += 1
    
    # Average
    for value in scores:
        if value_counts[value] > 0:
            scores[value] = scores[value] / value_counts[value]
    
    return scores


def calculate_risk_score(answers):
    """Calculate risk tolerance score"""
    total = sum(answer.get('value', 3) for answer in answers)
    avg = total / len(answers) if answers else 3
    return (avg / 5) * 100  # Convert to 0-100
