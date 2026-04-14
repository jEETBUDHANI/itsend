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

