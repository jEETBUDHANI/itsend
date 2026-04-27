"""Routes for roadmaps and simulator"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import HolisticProfile, User
from app.models import ModuleRoadmap
from app.data.career_roadmaps import CAREER_ROADMAPS, generate_personalized_roadmap
from app.ml.simulator import CareerSimulator

roadmap_bp = Blueprint('roadmap', __name__)
simulator = CareerSimulator()


@roadmap_bp.route('/career/<career_name>', methods=['GET'])
@jwt_required()
def get_career_roadmap(career_name):
    """Get roadmap for a specific career"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        module_key = user.education_module if user and user.education_module else None
        if module_key:
            modular = ModuleRoadmap.query.filter_by(
                user_id=user_id,
                module_type=module_key,
                is_active=True
            ).order_by(ModuleRoadmap.updated_at.desc()).first()
            if modular:
                return jsonify({
                    'career': career_name,
                    'roadmap': modular.roadmap_payload,
                    'education_level': module_key,
                    'personalized': True,
                    'module_based': True
                }), 200
        
        # Get user profile for personalization
        holistic = HolisticProfile.query.filter_by(user_id=user_id).first()
        
        if holistic:
            # Personalized roadmap
            roadmap = generate_personalized_roadmap(career_name, holistic.profile_data)
            education_level = (holistic.profile_data or {}).get('education_level') or (user.academic_stage if user else None)
        else:
            # Generic roadmap
            roadmap = CAREER_ROADMAPS.get(career_name, CAREER_ROADMAPS.get("Software Engineer"))
            education_level = user.academic_stage if user else None
        
        return jsonify({
            'career': career_name,
            'roadmap': roadmap,
            'education_level': education_level,
            'personalized': holistic is not None,
            'module_based': False
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@roadmap_bp.route('/simulate', methods=['POST'])
@jwt_required()
def simulate_career_changes():
    """Simulate how recommendations change with adjustments"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data or not data.get('adjustments'):
            return jsonify({'error': 'Adjustments are required'}), 400
        
        # Get base profile
        holistic = HolisticProfile.query.filter_by(user_id=user_id).first()
        
        if not holistic:
            return jsonify({'error': 'Complete assessments first'}), 404
        
        # Run simulation
        result = simulator.simulate_changes(
            holistic.profile_data,
            data['adjustments']
        )
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@roadmap_bp.route('/all-careers', methods=['GET'])
def get_all_careers():
    """Get list of all available career roadmaps"""
    careers = list(CAREER_ROADMAPS.keys())
    return jsonify({'careers': careers}), 200
