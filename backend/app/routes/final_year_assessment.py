"""
FINAL YEAR (PLACEMENT MODE) ROUTES
Comprehensive placement preparation and assessment
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import User, ModuleAssessmentResult
from app.data.final_year_questions import FINAL_YEAR_QUESTIONS
from app.ml.final_year_engine import FinalYearPlacementEngine
from datetime import datetime
import json

final_year_bp = Blueprint('final_year', __name__, url_prefix='/api/final-year')

@final_year_bp.route('/questions/base', methods=['GET'])
def get_base_questions():
    """Get all final year placement assessment questions"""
    try:
        # Organize questions by section
        sections = {}
        for question in FINAL_YEAR_QUESTIONS:
            section = question.get("section", "General")
            if section not in sections:
                sections[section] = []
            sections[section].append(question)
        
        return jsonify({
            "questions": FINAL_YEAR_QUESTIONS,
            "sections": sections,
            "total_questions": len(FINAL_YEAR_QUESTIONS),
            "message": "Final Year Placement Assessment Questions"
        }), 200
    
    except Exception as e:
        print(f"[ERROR] Failed to fetch questions: {str(e)}")
        return jsonify({"error": str(e)}), 500

@final_year_bp.route('/submit/assessment', methods=['POST'])
@jwt_required()
def submit_assessment():
    """Submit final year placement assessment"""
    try:
        from flask_jwt_extended import get_jwt_identity
        user_id = get_jwt_identity()
        
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No assessment data provided"}), 400
        
        # Extract and normalize answers
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Prepare assessment input payload
        input_payload = {
            "internships": data.get("internships"),
            "communication_skill": int(data.get("communication_skill", 3)),
            "technical_level": int(data.get("technical_level", 3)),
            "programming_languages": data.get("programming_languages", []),
            "interested_domains": data.get("interested_domains", []),
            "projects_count": data.get("projects_count"),
            "github_profile": data.get("github_profile"),
            "job_preference": data.get("job_preference", []),
            "salary_expectation": data.get("salary_expectation"),
            "interviews_done": data.get("interviews_done"),
            "dsa_level": int(data.get("dsa_level", 3)),
            "system_design": int(data.get("system_design", 2))
        }
        
        # Run assessment engine
        engine = FinalYearPlacementEngine(input_payload)
        assessment_result = engine.generate_full_assessment()
        
        # Store in database
        result = ModuleAssessmentResult(
            user_id=user_id,
            module_type="college_final_year",
            stage="placement",
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
            "message": "Final year placement assessment completed successfully"
        }), 200
    
    except Exception as e:
        print(f"[ERROR] Assessment submission failed: {str(e)}")
        db.session.rollback()
        return jsonify({"error": str(e), "traceback": str(e)}), 500

@final_year_bp.route('/results', methods=['GET'])
@jwt_required()
def get_results():
    """Get latest final year placement assessment results"""
    try:
        from flask_jwt_extended import get_jwt_identity
        user_id = get_jwt_identity()
        
        result = ModuleAssessmentResult.query.filter_by(
            user_id=user_id,
            module_type="college_final_year"
        ).order_by(ModuleAssessmentResult.created_at.desc()).first()
        
        if not result:
            return jsonify({"error": "No assessment results found"}), 404
        
        return jsonify({
            "assessment_id": result.id,
            "created_at": result.created_at.isoformat(),
            "input": json.loads(result.input_payload) if result.input_payload else {},
            "results": json.loads(result.score_payload) if result.score_payload else {},
            "message": "Final year assessment results retrieved"
        }), 200
    
    except Exception as e:
        print(f"[ERROR] Failed to fetch results: {str(e)}")
        return jsonify({"error": str(e)}), 500

@final_year_bp.route('/progress', methods=['GET'])
@jwt_required()
def get_progress():
    """Get placement preparation progress"""
    try:
        from flask_jwt_extended import get_jwt_identity
        user_id = get_jwt_identity()
        
        # Get all final year assessments for this user
        results = ModuleAssessmentResult.query.filter_by(
            user_id=user_id,
            module_type="college_final_year"
        ).all()
        
        if not results:
            return jsonify({
                "total_assessments": 0,
                "latest_score": None,
                "progress_trend": [],
                "message": "No placement assessments yet"
            }), 200
        
        # Extract scores from each assessment
        progress_data = []
        for result in results:
            try:
                score_data = json.loads(result.score_payload)
                progress_data.append({
                    "date": result.created_at.isoformat(),
                    "placement_readiness": score_data.get("placement_readiness_score", 0),
                    "readiness_level": score_data.get("readiness_level", "Unknown")
                })
            except:
                pass
        
        return jsonify({
            "total_assessments": len(results),
            "latest_score": progress_data[-1] if progress_data else None,
            "progress_trend": progress_data,
            "message": "Placement preparation progress retrieved"
        }), 200
    
    except Exception as e:
        print(f"[ERROR] Failed to fetch progress: {str(e)}")
        return jsonify({"error": str(e)}), 500

@final_year_bp.route('/roadmap', methods=['GET'])
@jwt_required()
def get_roadmap():
    """Get personalized placement roadmap"""
    try:
        from flask_jwt_extended import get_jwt_identity
        user_id = get_jwt_identity()
        
        # Get latest assessment
        result = ModuleAssessmentResult.query.filter_by(
            user_id=user_id,
            module_type="college_final_year"
        ).order_by(ModuleAssessmentResult.created_at.desc()).first()
        
        if not result:
            return jsonify({"error": "Please complete assessment first"}), 404
        
        score_data = json.loads(result.score_payload)
        
        return jsonify({
            "placement_readiness": score_data.get("placement_readiness_score", 0),
            "readiness_level": score_data.get("readiness_level", "Unknown"),
            "roadmap": score_data.get("placement_roadmap", {}),
            "key_milestones": score_data.get("placement_roadmap", {}).get("key_milestones", []),
            "message": "Placement roadmap retrieved"
        }), 200
    
    except Exception as e:
        print(f"[ERROR] Failed to fetch roadmap: {str(e)}")
        return jsonify({"error": str(e)}), 500

@final_year_bp.route('/skill-gaps', methods=['GET'])
@jwt_required()
def get_skill_gaps():
    """Get identified skill gaps and recommendations"""
    try:
        from flask_jwt_extended import get_jwt_identity
        user_id = get_jwt_identity()
        
        result = ModuleAssessmentResult.query.filter_by(
            user_id=user_id,
            module_type="college_final_year"
        ).order_by(ModuleAssessmentResult.created_at.desc()).first()
        
        if not result:
            return jsonify({"error": "Please complete assessment first"}), 404
        
        score_data = json.loads(result.score_payload)
        
        return jsonify({
            "skill_gaps": score_data.get("skill_gaps", {}),
            "interview_prep_plan": score_data.get("interview_prep_plan", {}),
            "message": "Skill gaps and preparation plan retrieved"
        }), 200
    
    except Exception as e:
        print(f"[ERROR] Failed to fetch skill gaps: {str(e)}")
        return jsonify({"error": str(e)}), 500

@final_year_bp.route('/job-recommendations', methods=['GET'])
@jwt_required()
def get_job_recommendations():
    """Get job role and domain recommendations"""
    try:
        from flask_jwt_extended import get_jwt_identity
        user_id = get_jwt_identity()
        
        result = ModuleAssessmentResult.query.filter_by(
            user_id=user_id,
            module_type="college_final_year"
        ).order_by(ModuleAssessmentResult.created_at.desc()).first()
        
        if not result:
            return jsonify({"error": "Please complete assessment first"}), 404
        
        score_data = json.loads(result.score_payload)
        
        return jsonify({
            "job_recommendations": score_data.get("job_recommendations", []),
            "placement_readiness_score": score_data.get("placement_readiness_score", 0),
            "next_steps": score_data.get("next_steps", []),
            "message": "Job recommendations retrieved"
        }), 200
    
    except Exception as e:
        print(f"[ERROR] Failed to fetch recommendations: {str(e)}")
        return jsonify({"error": str(e)}), 500
