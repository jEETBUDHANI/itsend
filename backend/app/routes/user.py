from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, UserProgressSnapshot

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update basic fields
        if 'full_name' in data:
            user.full_name = data['full_name']
        
        # Update graduate-specific fields
        if 'degree' in data:
            user.degree = data['degree']

        # Accept both legacy and new field names from frontend
        if 'specialization' in data:
            user.specialization = data['specialization']

        if 'branch' in data:
            user.specialization = data['branch']

        if 'current_year' in data:
            user.current_year = data['current_year']

        if 'skills' in data:
            user.current_skills = data['skills']

        if 'current_skills' in data:
            user.current_skills = data['current_skills']

        if 'career_interests' in data:
            user.career_interests = data['career_interests']

        if 'graduation_year' in data:
            user.graduation_year = data['graduation_year']

        if 'academic_stage' in data:
            user.academic_stage = data['academic_stage']

        if 'education_module' in data:
            user.education_module = data['education_module']

        if 'module_goal' in data:
            user.module_goal = data['module_goal']

        if 'current_stream' in data:
            user.current_stream = data['current_stream']

        if 'target_exams' in data:
            user.target_exams = data['target_exams']

        if 'class_grade' in data:
            user.class_grade = data['class_grade']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@user_bp.route('/progress', methods=['GET'])
@jwt_required()
def get_progress():
    """Get user progress snapshots over time"""
    try:
        user_id = int(get_jwt_identity())
        
        snapshots = UserProgressSnapshot.query.filter_by(user_id=user_id).order_by(
            UserProgressSnapshot.timestamp.asc()
        ).all()
        
        return jsonify({
            'progress': [snapshot.to_dict() for snapshot in snapshots],
            'total_snapshots': len(snapshots)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@user_bp.route('/complete-onboarding', methods=['POST'])
@jwt_required()
def complete_onboarding():
    """Persist onboarding selections for assessment and roadmap personalization."""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json() or {}

        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        education_level = data.get('education_level')
        education_module = data.get('education_module')
        stream = data.get('stream')
        career_interests = data.get('career_interests', [])
        degree = data.get('degree')
        specialization = data.get('specialization')
        current_year = data.get('current_year')

        # Normalize stage values for existing schema compatibility.
        if education_level in ('10', 'class_10', '10th_pass'):
            user.academic_stage = '9-10'
            user.education_module = 'class10'
        elif education_level in ('12', 'class_12', '12th_pass'):
            user.academic_stage = '11-12'
            user.education_module = 'class12'
        elif education_level in ('college', 'college_student'):
            user.academic_stage = 'college'
            user.education_module = 'college'

        if education_module in ('class10', 'class12', 'college'):
            user.education_module = education_module

        if stream:
            stream_map = {
                'science_pcm': 'Science',
                'science_pcb': 'Science',
                'commerce': 'Commerce',
                'arts': 'Arts'
            }
            user.current_stream = stream_map.get(stream, stream)

        if isinstance(career_interests, list):
            user.career_interests = career_interests

        if degree:
            user.degree = degree
        if specialization:
            user.specialization = specialization
        if current_year:
            user.current_year = current_year

        db.session.commit()

        return jsonify({
            'message': 'Onboarding completed',
            'user': user.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

