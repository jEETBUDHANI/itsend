"""
YEAR 1-2 FOUNDATION ROUTES
Assessment and recommendation APIs for foundation mode
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app.models import db, User, Assessment
from app.ml.foundation_engine import FoundationEngine

foundation_bp = Blueprint('foundation', __name__, url_prefix='/api/foundation')

@foundation_bp.route('/assessment', methods=['POST'])
@jwt_required()
def submit_foundation_assessment():
    """Submit foundation assessment responses"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        # Prepare assessment data
        assessment_data = {
            "foundation_knowledge": data.get("foundation_knowledge", 3),
            "interests": data.get("interests", []),
            "projects_done": data.get("projects_done", "No"),
            "learning_style": data.get("learning_style", "Mix of everything"),
            "learning_time": data.get("learning_time", "10-15 hours"),
            "primary_goal": data.get("primary_goal", "Build strong fundamentals"),
            "self_discipline": data.get("self_discipline", 3),
        }
        
        # Calculate assessment using foundation engine
        engine = FoundationEngine(assessment_data)
        assessment_result = engine.generate_full_assessment()
        
        # Save assessment to database
        assessment = Assessment(
            user_id=user_id,
            assessment_type='foundation',
            score=assessment_result['foundation_score'],
            result_data=assessment_result,
            completed_at=datetime.utcnow()
        )
        
        db.session.add(assessment)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Foundation assessment submitted successfully",
            "assessment": assessment_result,
            "assessment_id": assessment.id
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@foundation_bp.route('/assessment/<int:assessment_id>', methods=['GET'])
@jwt_required()
def get_foundation_assessment(assessment_id):
    """Get foundation assessment results"""
    user_id = get_jwt_identity()
    
    assessment = Assessment.query.filter_by(
        id=assessment_id,
        user_id=user_id,
        assessment_type='foundation'
    ).first()
    
    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404
    
    return jsonify({
        "assessment_id": assessment.id,
        "score": assessment.score,
        "result": assessment.result_data,
        "completed_at": assessment.completed_at.isoformat()
    }), 200

@foundation_bp.route('/roadmap', methods=['GET'])
@jwt_required()
def get_foundation_roadmap():
    """Get personalized foundation learning roadmap"""
    user_id = get_jwt_identity()
    
    # Get latest foundation assessment
    assessment = Assessment.query.filter_by(
        user_id=user_id,
        assessment_type='foundation'
    ).order_by(Assessment.completed_at.desc()).first()
    
    if not assessment:
        return jsonify({"error": "No foundation assessment found. Please complete assessment first."}), 404
    
    engine = FoundationEngine(assessment.result_data)
    roadmap = engine.create_learning_roadmap()
    
    return jsonify({
        "roadmap": roadmap,
        "score": assessment.score,
        "generated_at": datetime.utcnow().isoformat()
    }), 200

@foundation_bp.route('/domains', methods=['GET'])
@jwt_required()
def get_recommended_domains():
    """Get recommended learning domains"""
    user_id = get_jwt_identity()
    
    # Get latest foundation assessment
    assessment = Assessment.query.filter_by(
        user_id=user_id,
        assessment_type='foundation'
    ).order_by(Assessment.completed_at.desc()).first()
    
    if not assessment:
        return jsonify({"error": "No foundation assessment found. Please complete assessment first."}), 404
    
    engine = FoundationEngine(assessment.result_data)
    domains = engine.recommend_domains()
    
    return jsonify({
        "recommended_domains": domains,
        "learning_level": engine.get_foundation_level(),
        "learning_plan": engine.generate_learning_plan()
    }), 200

@foundation_bp.route('/progress', methods=['GET'])
@jwt_required()
def get_foundation_progress():
    """Get foundation learning progress"""
    user_id = get_jwt_identity()
    
    # Get all foundation assessments for user
    assessments = Assessment.query.filter_by(
        user_id=user_id,
        assessment_type='foundation'
    ).order_by(Assessment.completed_at.desc()).all()
    
    if not assessments:
        return jsonify({"message": "No foundation assessments yet"}), 404
    
    # Get latest assessment
    latest = assessments[0]
    engine = FoundationEngine(latest.result_data)
    
    return jsonify({
        "latest_score": latest.score,
        "foundation_level": engine.get_foundation_level(),
        "total_assessments": len(assessments),
        "assessment_history": [
            {
                "id": a.id,
                "score": a.score,
                "date": a.completed_at.isoformat()
            } for a in assessments[-5:]  # Last 5 assessments
        ]
    }), 200

@foundation_bp.route('/learning-plan', methods=['POST'])
@jwt_required()
def generate_learning_plan():
    """Generate custom learning plan"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        assessment_data = {
            "learning_style": data.get("learning_style", "Mix of everything"),
            "learning_time": data.get("learning_time", "10-15 hours"),
        }
        
        engine = FoundationEngine(assessment_data)
        plan = engine.generate_learning_plan()
        
        return jsonify({
            "learning_plan": plan,
            "generated_at": datetime.utcnow().isoformat()
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400
