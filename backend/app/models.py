from app import db
from datetime import datetime
import bcrypt

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # User role - Graduate Student Focus
    user_role = db.Column(db.String(50), default='graduate_student')  # Primary: 'graduate_student'
    
    # Graduate Student Profile
    degree = db.Column(db.String(100))  # 'B.Tech', 'BBA', 'B.Sc', 'B.A', etc.
    specialization = db.Column(db.String(100))  # 'Computer Science', 'Finance', etc.
    graduation_year = db.Column(db.Integer)  # 2024, 2025, etc.
    current_year = db.Column(db.String(50))  # 'final_year', 'fresher', 'graduated'
    
    # Skills & Interests
    current_skills = db.Column(db.JSON)  # ['Python', 'Java', 'React', ...]
    career_interests = db.Column(db.JSON)  # ['Software Engineer', 'Data Science', ...]
    
    # Legacy academic fields (for backward compatibility)
    academic_stage = db.Column(db.String(50))  # '9-10', '11-12', 'college', 'working'
    education_module = db.Column(db.String(30))  # 'class10', 'class12', 'college'
    module_goal = db.Column(db.String(255))
    current_stream = db.Column(db.String(50))  # 'Science', 'Commerce', 'Arts'
    target_exams = db.Column(db.JSON)  # ['JEE', 'NEET', 'CUET', etc.]
    class_grade = db.Column(db.String(20))  # '9', '10', '11', '12', '1st_year', etc.
    
    # Relationships
    test_results = db.relationship('TestResult', backref='user', lazy=True)
    assessments = db.relationship('Assessment', backref='user', lazy=True)
    holistic_profile = db.relationship('HolisticProfile', backref='user', uselist=False)
    feedback = db.relationship('CareerFeedback', backref='user', lazy=True)
    roadmaps = db.relationship('Roadmap', backref='user', lazy=True)
    module_assessments = db.relationship('ModuleAssessmentResult', backref='user', lazy=True)
    module_recommendations = db.relationship('ModuleRecommendation', backref='user', lazy=True)
    module_roadmaps = db.relationship('ModuleRoadmap', backref='user', lazy=True)
    job_readiness_scores = db.relationship('JobReadinessScore', backref='user', lazy=True)
    action_plans = db.relationship('ActionPlan', backref='user', lazy=True)
    placement_prep_attempts = db.relationship('PlacementPrepAttempt', backref='user', lazy=True)
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        """Check if password matches"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'user_role': self.user_role,
            'degree': self.degree,
            'specialization': self.specialization,
            'graduation_year': self.graduation_year,
            'current_year': self.current_year,
            'current_skills': self.current_skills or [],
            'career_interests': self.career_interests or [],
            'academic_stage': self.academic_stage,
            'education_module': self.education_module,
            'module_goal': self.module_goal,
            'current_stream': self.current_stream,
            'target_exams': self.target_exams or [],
            'class_grade': self.class_grade,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class TestResult(db.Model):
    __tablename__ = 'test_results'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    personality_type = db.Column(db.String(50))
    scores = db.Column(db.JSON)  # Store RIASEC scores
    recommendations = db.Column(db.JSON)  # Store course recommendations
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'personality_type': self.personality_type,
            'scores': self.scores,
            'recommendations': self.recommendations,
            'created_at': self.created_at.isoformat()
        }


class Assessment(db.Model):
    """Multi-dimensional assessment results"""
    __tablename__ = 'assessments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    assessment_type = db.Column(db.String(50), nullable=False)  # 'riasec', 'aptitude', 'personality', 'values', 'risk'
    scores = db.Column(db.JSON, nullable=False)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'assessment_type': self.assessment_type,
            'scores': self.scores,
            'completed_at': self.completed_at.isoformat()
        }


class ModuleAssessmentResult(db.Model):
    """Education-stage-specific assessment records."""
    __tablename__ = 'module_assessment_results'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    module_type = db.Column(db.String(30), nullable=False)  # class10 | class12 | college
    assessment_key = db.Column(db.String(80), nullable=False)
    schema_version = db.Column(db.String(20), default='v1')
    input_payload = db.Column(db.JSON, nullable=False)
    score_payload = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'module_type': self.module_type,
            'assessment_key': self.assessment_key,
            'schema_version': self.schema_version,
            'input_payload': self.input_payload,
            'score_payload': self.score_payload,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }


class ModuleRecommendation(db.Model):
    """Module-specific recommendation outputs and metadata."""
    __tablename__ = 'module_recommendations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    module_type = db.Column(db.String(30), nullable=False)
    output_type = db.Column(db.String(80), nullable=False)
    recommendation_payload = db.Column(db.JSON, nullable=False)
    confidence_score = db.Column(db.Float, default=0.0)
    generated_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'module_type': self.module_type,
            'output_type': self.output_type,
            'recommendation_payload': self.recommendation_payload,
            'confidence_score': self.confidence_score,
            'generated_at': self.generated_at.isoformat() if self.generated_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }


class ModuleRoadmap(db.Model):
    """Separate roadmap templates and generated plans per module."""
    __tablename__ = 'module_roadmaps'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    module_type = db.Column(db.String(30), nullable=False)
    roadmap_payload = db.Column(db.JSON, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'module_type': self.module_type,
            'roadmap_payload': self.roadmap_payload,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }


class HolisticProfile(db.Model):
    """User's holistic career profile"""
    __tablename__ = 'holistic_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    profile_data = db.Column(db.JSON, nullable=False)
    clarity_score = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'profile_data': self.profile_data,
            'clarity_score': self.clarity_score,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class CareerFeedback(db.Model):
    """User feedback on career recommendations"""
    __tablename__ = 'career_feedback'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    result_id = db.Column(db.Integer, db.ForeignKey('test_results.id'))
    career_name = db.Column(db.String(200), nullable=False)
    helpful = db.Column(db.Boolean)
    rating = db.Column(db.Integer)  # 1-5
    feedback_text = db.Column(db.Text)
    intent_to_pursue = db.Column(db.Boolean)
    doubts = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'result_id': self.result_id,
            'career_name': self.career_name,
            'helpful': self.helpful,
            'rating': self.rating,
            'feedback_text': self.feedback_text,
            'intent_to_pursue': self.intent_to_pursue,
            'doubts': self.doubts,
            'created_at': self.created_at.isoformat()
        }


class CareerSkill(db.Model):
    """Skills required for specific careers"""
    __tablename__ = 'career_skills'
    
    id = db.Column(db.Integer, primary_key=True)
    career_name = db.Column(db.String(200), nullable=False)
    skill_name = db.Column(db.String(200), nullable=False)
    proficiency_required = db.Column(db.Integer, nullable=False)  # 1-5 scale
    category = db.Column(db.String(100))  # 'technical', 'soft', 'domain'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'career_name': self.career_name,
            'skill_name': self.skill_name,
            'proficiency_required': self.proficiency_required,
            'category': self.category
        }


class UserCareerFeedback(db.Model):
    """User feedback on career recommendations for continuous learning"""
    __tablename__ = 'user_career_feedback'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    career_id = db.Column(db.String(200), nullable=False)  # Career name or ID
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    satisfied = db.Column(db.Boolean, default=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'career_id': self.career_id,
            'rating': self.rating,
            'satisfied': self.satisfied,
            'comment': self.comment,
            'created_at': self.created_at.isoformat()
        }


class UserProgressSnapshot(db.Model):
    """Track user progress over time"""
    __tablename__ = 'user_progress_snapshots'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    aptitude_score = db.Column(db.Float)
    confidence_score = db.Column(db.Float)
    readiness_score = db.Column(db.Float)
    assessment_type = db.Column(db.String(50))  # Which assessment triggered this snapshot
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'aptitude_score': self.aptitude_score,
            'confidence_score': self.confidence_score,
            'readiness_score': self.readiness_score,
            'assessment_type': self.assessment_type,
            'timestamp': self.timestamp.isoformat()
        }


# Import extended models
from app.models_extended import (
    CareerPath, ExamPreparation, Job, Roadmap,
    JobReadinessScore, CareerComparison, ActionPlan, 
    PlacementPrepAttempt, CareerSwitchSimulation
)
