"""
YEAR 3 (INTERNSHIP MODE) ROUTES
Internship readiness assessment and preparation
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import User, ModuleAssessmentResult
from app.data.year3_internship_questions import YEAR3_QUESTIONS
from app.ml.year3_internship_engine import Year3InternshipEngine
from datetime import datetime
import json

year3_bp = Blueprint('year3_internship', __name__, url_prefix='/api/year3-internship')

@year3_bp.route('/questions/base', methods=['GET'])
def get_base_questions():
    """Get all Year 3 internship assessment questions"""
    try:
        return jsonify({
            "questions": YEAR3_QUESTIONS,
            "total_questions": len(YEAR3_QUESTIONS),
            "message": "Year 3 Internship Assessment Questions"
        }), 200
    
    except Exception as e:
        print(f"[ERROR] Failed to fetch questions: {str(e)}")
        return jsonify({"error": str(e)}), 500

@year3_bp.route('/submit/assessment', methods=['POST'])
@jwt_required()
def submit_assessment():
    """Submit Year 3 internship assessment"""
    try:
        from flask_jwt_extended import get_jwt_identity
        user_id = get_jwt_identity()
        
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No assessment data provided"}), 400
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Prepare assessment input payload
        input_payload = {
            "projects_count": data.get("projects_count"),
            "portfolio": data.get("portfolio"),
            "technical_depth": int(data.get("technical_depth", 3)),
            "technologies": data.get("technologies", []),
            "internship_type": data.get("internship_type", []),
            "internship_duration": data.get("internship_duration"),
            "problem_solving": int(data.get("problem_solving", 3)),
            "communication": int(data.get("communication", 3)),
            "previous_internships": data.get("previous_internships"),
            "internship_goal": data.get("internship_goal"),
            "interested_domains": data.get("interested_domains", [])
        }
        
        # Run assessment engine
        engine = Year3InternshipEngine(input_payload)
        assessment_result = engine.generate_full_assessment()
        
        # Store in database
        result = ModuleAssessmentResult(
            user_id=user_id,
            module_type="college_year3",
            stage="internship",
            input_payload=json.dumps(input_payload),
            score_payload=json.dumps(assessment_result),
            created_at=datetime.utcnow()
        )
        
        db.session.add(result)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "assessment_id": result.id,
            "assessment": assessment_result,
            "message": "Year 3 internship assessment completed successfully"
        }), 200
    
    except Exception as e:
        print(f"[ERROR] Assessment submission failed: {str(e)}")
        db.session.rollback()
        return jsonify({"error": str(e), "traceback": str(e)}), 500

@year3_bp.route('/results', methods=['GET'])
@jwt_required()
def get_results():
    """Get latest Year 3 internship assessment results"""
    try:
        from flask_jwt_extended import get_jwt_identity
        user_id = get_jwt_identity()
        
        result = ModuleAssessmentResult.query.filter_by(
            user_id=user_id,
            module_type="college_year3"
        ).order_by(ModuleAssessmentResult.created_at.desc()).first()
        
        if not result:
            return jsonify({"error": "No assessment results found"}), 404
        
        return jsonify({
            "assessment_id": result.id,
            "created_at": result.created_at.isoformat(),
            "input": json.loads(result.input_payload) if result.input_payload else {},
            "results": json.loads(result.score_payload) if result.score_payload else {},
            "message": "Year 3 internship assessment results retrieved"
        }), 200
    
    except Exception as e:
        print(f"[ERROR] Failed to fetch results: {str(e)}")
        return jsonify({"error": str(e)}), 500

@year3_bp.route('/roadmap', methods=['GET'])
@jwt_required()
def get_roadmap():
    """Get internship preparation roadmap"""
    try:
        from flask_jwt_extended import get_jwt_identity
        user_id = get_jwt_identity()
        
        result = ModuleAssessmentResult.query.filter_by(
            user_id=user_id,
            module_type="college_year3"
        ).order_by(ModuleAssessmentResult.created_at.desc()).first()
        
        if not result:
            return jsonify({"error": "Please complete assessment first"}), 404
        
        score_data = json.loads(result.score_payload)
        
        return jsonify({
            "readiness_score": score_data.get("readiness_score", 0),
            "readiness_level": score_data.get("readiness_level", {}).get("level"),
            "roadmap": score_data.get("internship_roadmap", {}),
            "message": "Internship roadmap retrieved"
        }), 200
    
    except Exception as e:
        print(f"[ERROR] Failed to fetch roadmap: {str(e)}")
        return jsonify({"error": str(e)}), 500

@year3_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    """Get internship role recommendations"""
    try:
        from flask_jwt_extended import get_jwt_identity
        user_id = get_jwt_identity()
        
        result = ModuleAssessmentResult.query.filter_by(
            user_id=user_id,
            module_type="college_year3"
        ).order_by(ModuleAssessmentResult.created_at.desc()).first()
        
        if not result:
            return jsonify({"error": "Please complete assessment first"}), 404
        
        score_data = json.loads(result.score_payload)
        
        return jsonify({
            "internship_recommendations": score_data.get("internship_recommendations", []),
            "skill_gaps": score_data.get("skill_gaps", {}),
            "application_strategy": score_data.get("application_strategy", {}),
            "message": "Internship recommendations retrieved"
        }), 200
    
    except Exception as e:
        print(f"[ERROR] Failed to fetch recommendations: {str(e)}")
        return jsonify({"error": str(e)}), 500
