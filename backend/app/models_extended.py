"""
Extended models for Career Guidance Platform
Includes: CareerPath, ExamPreparation, Job, Roadmap
"""
from app import db
from datetime import datetime


class CareerPath(db.Model):
    """Career paths (Engineering, Medical, Commerce, etc.)"""
    __tablename__ = 'career_paths'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    icon = db.Column(db.String(50))  # Emoji or icon identifier
    category = db.Column(db.String(100))  # 'Technical', 'Medical', 'Business', etc.
    required_stream = db.Column(db.String(50))  # 'Science', 'Commerce', 'Arts', 'Any'
    difficulty_level = db.Column(db.String(20))  # 'Easy', 'Medium', 'Hard'
    popularity_score = db.Column(db.Integer, default=0)
    
    # Relationships
    jobs = db.relationship('Job', backref='career_path', lazy=True)
    exam_preparations = db.relationship('ExamPreparation', backref='career_path', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon': self.icon,
            'category': self.category,
            'required_stream': self.required_stream,
            'difficulty_level': self.difficulty_level,
            'popularity_score': self.popularity_score
        }


class ExamPreparation(db.Model):
    """Exam preparation paths (JEE, NEET, CUET, etc.)"""
    __tablename__ = 'exam_preparations'
    
    id = db.Column(db.Integer, primary_key=True)
    career_path_id = db.Column(db.Integer, db.ForeignKey('career_paths.id'))
    name = db.Column(db.String(200), nullable=False)  # 'JEE Main', 'NEET UG', etc.
    exam_type = db.Column(db.String(100))  # 'Engineering', 'Medical', 'Commerce'
    difficulty = db.Column(db.String(20))  # 'High', 'Medium', 'Low'
    timeline = db.Column(db.String(100))  # '2 years', '1 year', etc.
    required_subjects = db.Column(db.JSON)  # ['Physics', 'Chemistry', 'Mathematics']
    recommended_coaching = db.Column(db.Boolean, default=False)
    syllabus_overview = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'career_path_id': self.career_path_id,
            'name': self.name,
            'exam_type': self.exam_type,
            'difficulty': self.difficulty,
            'timeline': self.timeline,
            'required_subjects': self.required_subjects,
            'recommended_coaching': self.recommended_coaching,
            'syllabus_overview': self.syllabus_overview
        }


class Job(db.Model):
    """Job roles with Indian salary data"""
    __tablename__ = 'jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    career_path_id = db.Column(db.Integer, db.ForeignKey('career_paths.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    
    # Salary in INR (Lakhs per annum)
    avg_salary_min = db.Column(db.Float)  # e.g., 6.0 for 6 LPA
    avg_salary_max = db.Column(db.Float)  # e.g., 15.0 for 15 LPA
    
    required_education = db.Column(db.String(200))  # 'B.Tech', 'MBBS', etc.
    required_skills = db.Column(db.JSON)  # ['Python', 'React', 'SQL']
    growth_rate = db.Column(db.String(20))  # 'High', 'Medium', 'Low'
    demand_level = db.Column(db.String(20))  # 'High', 'Medium', 'Low'
    work_environment = db.Column(db.String(100))  # 'Office', 'Hybrid', 'Remote'
    
    # Recruiter criteria for job fit scoring (Module 5)
    required_aptitude_level = db.Column(db.JSON)  # {'logical': 70, 'numerical': 60, ...}
    preferred_riasec_traits = db.Column(db.JSON)  # {'I': 0.5, 'R': 0.3, 'C': 0.2}
    acceptable_risk_tolerance = db.Column(db.String(50))  # 'conservative', 'moderate', 'aggressive'
    
    def to_dict(self):
        return {
            'id': self.id,
            'career_path_id': self.career_path_id,
            'title': self.title,
            'description': self.description,
            'avg_salary_min': self.avg_salary_min,
            'avg_salary_max': self.avg_salary_max,
            'salary_range': f'₹{self.avg_salary_min}-{self.avg_salary_max} LPA',
            'required_education': self.required_education,
            'required_skills': self.required_skills,
            'growth_rate': self.growth_rate,
            'demand_level': self.demand_level,
            'work_environment': self.work_environment,
            'required_aptitude_level': self.required_aptitude_level,
            'preferred_riasec_traits': self.preferred_riasec_traits,
            'acceptable_risk_tolerance': self.acceptable_risk_tolerance
        }


class Roadmap(db.Model):
    """Personalized academic and career roadmaps"""
    __tablename__ = 'roadmaps'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    stage = db.Column(db.String(50), nullable=False)  # '9-10', '11-12', 'college'
    
    # Roadmap content as structured JSON
    content = db.Column(db.JSON, nullable=False)
    # Example structure:
    # {
    #   "current_year": { "tasks": [...], "milestones": [...] },
    #   "next_year": { "tasks": [...], "milestones": [...] },
    #   "future": { "goals": [...], "potential_careers": [...] }
    # }
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'stage': self.stage,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class JobReadinessScore(db.Model):
    """Job Readiness Predictor: Calculates readiness score based on skills, projects, resume"""
    __tablename__ = 'job_readiness_scores'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Readiness metrics (0-100 scale)
    skills_score = db.Column(db.Float, default=0.0)  # Based on technical skills
    projects_score = db.Column(db.Float, default=0.0)  # Based on projects built
    resume_completeness = db.Column(db.Float, default=0.0)  # % of resume complete
    interview_readiness = db.Column(db.Float, default=0.0)  # Based on assessments
    
    # Overall readiness
    overall_score = db.Column(db.Float, default=0.0)  # Weighted average
    
    # Improvement suggestions
    improvement_suggestions = db.Column(db.JSON)  # [{'area': 'DSA', 'priority': 'high', 'action': '...'}]
    next_milestones = db.Column(db.JSON)  # Next 3 actionable steps
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'skills_score': self.skills_score,
            'projects_score': self.projects_score,
            'resume_completeness': self.resume_completeness,
            'interview_readiness': self.interview_readiness,
            'overall_score': self.overall_score,
            'improvement_suggestions': self.improvement_suggestions or [],
            'next_milestones': self.next_milestones or [],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class CareerComparison(db.Model):
    """Career Confusion Resolver: Compare 2-3 careers side-by-side"""
    __tablename__ = 'career_comparisons'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Careers being compared (store names/ids)
    careers_compared = db.Column(db.JSON, nullable=False)  # ['Software Engineer', 'Data Scientist', 'Product Manager']
    
    # Comparison data
    comparison_metrics = db.Column(db.JSON, nullable=False)
    # {
    #   'Software Engineer': {'skills_required': [...], 'difficulty': 'Medium', 'salary_range': '6-15 LPA', 'time_to_ready': '6-12 months'},
    #   'Data Scientist': {'skills_required': [...], 'difficulty': 'Hard', 'salary_range': '8-20 LPA', 'time_to_ready': '12-18 months'}
    # }
    
    # Final recommendation
    best_fit_career = db.Column(db.String(200))
    recommendation_reason = db.Column(db.Text)  # Explanation based on user profile
    confidence_score = db.Column(db.Float)  # 0-100
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'careers_compared': self.careers_compared,
            'comparison_metrics': self.comparison_metrics,
            'best_fit_career': self.best_fit_career,
            'recommendation_reason': self.recommendation_reason,
            'confidence_score': self.confidence_score,
            'created_at': self.created_at.isoformat()
        }


class ActionPlan(db.Model):
    """Action Plan Generator: 30/60/90 day execution plans"""
    __tablename__ = 'action_plans'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Plan details
    target_career = db.Column(db.String(200), nullable=False)
    plan_type = db.Column(db.String(50), nullable=False)  # '30_day', '60_day', '90_day'
    duration_days = db.Column(db.Integer)  # 30, 60, or 90
    
    # Weekly breakdown
    weekly_tasks = db.Column(db.JSON, nullable=False)
    # {
    #   'week_1': {'skills_to_learn': [...], 'tasks': [...], 'priority': 'high'},
    #   'week_2': {...}
    # }
    
    # Tracking
    completion_percentage = db.Column(db.Float, default=0.0)
    is_active = db.Column(db.Boolean, default=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    started_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'target_career': self.target_career,
            'plan_type': self.plan_type,
            'duration_days': self.duration_days,
            'weekly_tasks': self.weekly_tasks,
            'completion_percentage': self.completion_percentage,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }


class PlacementPrepAttempt(db.Model):
    """Placement Preparation Mode: Track aptitude, coding, and interview performance"""
    __tablename__ = 'placement_prep_attempts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Test details
    question_type = db.Column(db.String(50), nullable=False)  # 'aptitude', 'coding', 'interview'
    category = db.Column(db.String(100))  # 'logical_reasoning', 'quantitative', 'python', 'sql', 'hr', etc.
    difficulty = db.Column(db.String(20))  # 'easy', 'medium', 'hard'
    
    # Performance
    total_questions = db.Column(db.Integer)
    correct_answers = db.Column(db.Integer)
    score = db.Column(db.Float)  # Percentage (0-100)
    time_taken = db.Column(db.Integer)  # Seconds
    
    # Detailed feedback
    weak_areas = db.Column(db.JSON)  # Areas to improve
    strong_areas = db.Column(db.JSON)  # Areas of strength
    recommendations = db.Column(db.JSON)  # Personalized improvement suggestions
    
    attempted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'question_type': self.question_type,
            'category': self.category,
            'difficulty': self.difficulty,
            'total_questions': self.total_questions,
            'correct_answers': self.correct_answers,
            'score': self.score,
            'time_taken': self.time_taken,
            'weak_areas': self.weak_areas or [],
            'strong_areas': self.strong_areas or [],
            'recommendations': self.recommendations or [],
            'attempted_at': self.attempted_at.isoformat()
        }


class CareerSwitchSimulation(db.Model):
    """Career Switch Simulator: Simulate switching from one career to another"""
    __tablename__ = 'career_switch_simulations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Careers involved
    from_career = db.Column(db.String(200), nullable=False)  # Current/starting career
    to_career = db.Column(db.String(200), nullable=False)  # Target career
    
    # Simulation results
    skills_overlap = db.Column(db.Float)  # % of transferable skills
    new_skills_required = db.Column(db.JSON)  # Skills to learn
    estimated_time_months = db.Column(db.Integer)  # Time to transition
    difficulty_level = db.Column(db.String(20))  # 'easy', 'medium', 'hard'
    
    # Actionable path
    transition_roadmap = db.Column(db.JSON)  # Step-by-step plan
    pros_cons = db.Column(db.JSON)  # {'pros': [...], 'cons': [...]}
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'from_career': self.from_career,
            'to_career': self.to_career,
            'skills_overlap': self.skills_overlap,
            'new_skills_required': self.new_skills_required or [],
            'estimated_time_months': self.estimated_time_months,
            'difficulty_level': self.difficulty_level,
            'transition_roadmap': self.transition_roadmap or [],
            'pros_cons': self.pros_cons or {},
            'created_at': self.created_at.isoformat()
        }
