from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

graduate_bp = Blueprint('graduate', __name__)

@graduate_bp.route('/', methods=['GET'])
def get_graduate_info():
    """Get graduate career information and resources"""
    return jsonify({
        'message': 'Graduate career resources',
        'status': 'available'
    }), 200

@graduate_bp.route('/pathways', methods=['GET'])
@jwt_required()
def get_graduate_pathways():
    """Get graduate career pathways"""
    return jsonify({
        'pathways': []
    }), 200
