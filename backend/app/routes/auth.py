from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import func
from app import db
from app.models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """Register a new user"""
    try:
        data = request.get_json()
        email = (data.get('email') or '').strip().lower() if data else ''
        password = data.get('password') if data else None
        full_name = (data.get('full_name') or '').strip() if data else ''
        
        print(f"[SIGNUP] Received request - Email: {email}, Password length: {len(password) if password else 0}, Name: {full_name}")
        
        # Validate input
        if not email or not password:
            print(f"[SIGNUP] Missing required fields")
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Check if user already exists
        existing = User.query.filter(func.lower(User.email) == email).first()
        if existing:
            print(f"[SIGNUP] User with email '{email}' already exists")
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create new user
        user = User(
            email=email,
            full_name=full_name
        )
        user.set_password(password)
        print(f"[SIGNUP] Created user object - Email: {user.email}, Hash length: {len(user.password_hash)}")
        
        db.session.add(user)
        db.session.commit()
        print(f"[SIGNUP] User saved to database - ID: {user.id}")
        
        # Create access token
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'User created successfully',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        email = (data.get('email') or '').strip().lower() if data else ''
        password = data.get('password') if data else None
        
        print(f"[LOGIN] Received request - Email: {email}, Password length: {len(password) if password else 0}")
        
        # Validate input
        if not email or not password:
            print(f"[LOGIN] Missing credentials - Email: {bool(email)}, Password: {bool(password)}")
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user
        user = User.query.filter(func.lower(User.email) == email).first()
        print(f"[LOGIN] User found: {user is not None}")
        
        if not user:
            print(f"[LOGIN] User with email '{email}' not found in database")
            return jsonify({
                'error': 'Account not found. Please sign up first.',
                'code': 'ACCOUNT_NOT_FOUND'
            }), 401
        
        # Check password
        pwd_check = user.check_password(password)
        print(f"[LOGIN] Password check result: {pwd_check}")
        
        if not pwd_check:
            return jsonify({
                'error': 'Incorrect password. Please try again.',
                'code': 'INVALID_PASSWORD'
            }), 401
        
        # Create access token
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")  # Add logging
        import traceback
        traceback.print_exc()  # Print full stack trace
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify_token():
    """Verify if token is valid"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'message': 'Token is valid',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
