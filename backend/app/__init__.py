from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///career_system.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    
    # Configure CORS to allow frontend origins
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:8080",
                "http://localhost:8081",
                "http://localhost:8082",
                "http://localhost:80801",
                "http://localhost:80802"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        print(f"DEBUG: Token expired - Header: {jwt_header}, Payload: {jwt_payload}")
        return jsonify({'error': 'Token has expired'}), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        print(f"DEBUG: Invalid token - Error: {error}")
        return jsonify({'error': 'Invalid token'}), 422
    
    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        print(f"DEBUG: Unauthorized - Error: {error}")
        return jsonify({'error': 'Missing authorization header'}), 401
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.prediction import prediction_bp
    from app.routes.user import user_bp
    from app.routes.assessment import assessment_bp
    from app.routes.roadmap import roadmap_bp
    from app.routes.services import services_bp
    from app.routes.careers import careers_bp
    from app.routes.roadmaps_api import roadmaps_bp
    from app.routes.chatbot import chatbot_bp
    from app.routes.skills import skills_bp
    from app.routes.feedback import feedback_bp
    from app.routes.admin import admin_bp
    from app.routes.recruiter import recruiter_bp
    from app.routes.graduate import graduate_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(prediction_bp, url_prefix='/api/predict')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(assessment_bp, url_prefix='/api/assessment')
    app.register_blueprint(roadmap_bp, url_prefix='/api/roadmap')
    app.register_blueprint(services_bp, url_prefix='/api/services')
    app.register_blueprint(careers_bp, url_prefix='/api/careers')
    app.register_blueprint(roadmaps_bp, url_prefix='/api/roadmaps')
    app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')
    app.register_blueprint(skills_bp, url_prefix='/api/skills')
    app.register_blueprint(feedback_bp, url_prefix='/api/feedback')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(recruiter_bp, url_prefix='/api/recruiter')
    app.register_blueprint(graduate_bp, url_prefix='/api/graduate')
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    @app.route('/')
    def index():
        return {'message': 'Career Recommendation System API', 'status': 'running'}
    
    return app
