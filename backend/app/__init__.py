from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from sqlalchemy import inspect, text
from sqlalchemy.pool import QueuePool, NullPool

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()


def _migrate_sqlite_schema(app):
    """Add missing columns to existing SQLite tables without dropping data."""
    if not app.config['SQLALCHEMY_DATABASE_URI'].startswith('sqlite'):
        return

    user_columns = {
        'user_role': "VARCHAR(50) DEFAULT 'graduate_student'",
        'degree': 'VARCHAR(100)',
        'specialization': 'VARCHAR(100)',
        'graduation_year': 'INTEGER',
        'current_year': 'VARCHAR(50)',
        'current_skills': 'JSON',
        'career_interests': 'JSON',
        'academic_stage': 'VARCHAR(50)',
        'education_module': 'VARCHAR(30)',
        'module_goal': 'VARCHAR(255)',
        'current_stream': 'VARCHAR(50)',
        'target_exams': 'JSON',
        'class_grade': 'VARCHAR(20)',
    }

    inspector = inspect(db.engine)
    if not inspector.has_table('users'):
        return

    existing_columns = {column['name'] for column in inspector.get_columns('users')}
    missing_columns = [
        (column_name, column_type)
        for column_name, column_type in user_columns.items()
        if column_name not in existing_columns
    ]

    if not missing_columns:
        return

    with db.engine.begin() as connection:
        for column_name, column_type in missing_columns:
            connection.execute(text(f"ALTER TABLE users ADD COLUMN {column_name} {column_type}"))
            print(f"[DB MIGRATION] Added missing column: users.{column_name}")

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///career_system.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Database connection pooling for better performance
    # Use QueuePool for production (PostgreSQL), NullPool for SQLite (development)
    db_uri = app.config['SQLALCHEMY_DATABASE_URI']
    if db_uri.startswith('postgresql'):
        app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
            'poolclass': QueuePool,
            'pool_size': 10,
            'max_overflow': 20,
            'pool_recycle': 3600,
            'pool_pre_ping': True,
        }
    else:
        # For SQLite (development), use NullPool to avoid threading issues
        app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
            'poolclass': NullPool,
        }
    
    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    
    # Configure CORS to allow frontend origins
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
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
    from app.routes.modules import modules_bp
    from app.routes.class10_assessment import class10_bp
    from app.routes.class12_assessment import class12_bp
    from app.routes.college_assessment import college_bp
    from app.routes.college_selection import college_skeleton_bp
    from app.routes.final_year_assessment import final_year_bp
    from app.routes.year3_internship_assessment import year3_bp
    from app.routes.foundation import foundation_bp
    
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
    app.register_blueprint(modules_bp, url_prefix='/api/modules')
    app.register_blueprint(class10_bp)  # Already has /api/class10 prefix in blueprint
    app.register_blueprint(class12_bp)  # Already has /api/class12 prefix in blueprint
    app.register_blueprint(college_bp)  # Already has /api/college prefix in blueprint
    app.register_blueprint(college_skeleton_bp, url_prefix='/api/college/selection')
    app.register_blueprint(final_year_bp)  # Already has /api/final-year prefix in blueprint
    app.register_blueprint(year3_bp)  # Already has /api/year3-internship prefix in blueprint
    app.register_blueprint(foundation_bp)  # Already has /api/foundation prefix in blueprint
    
    # Create tables
    with app.app_context():
        try:
            db.create_all()
            _migrate_sqlite_schema(app)
        except Exception as e:
            # Database not accessible (OK for local testing, will work on Render)
            print(f"[INFO] Database not accessible during startup: {type(e).__name__}")
            print("[INFO] This is normal for local testing - tables will be created on Render")
    
    @app.route('/')
    def index():
        return {'message': 'Career Recommendation System API', 'status': 'running'}
    
    return app
