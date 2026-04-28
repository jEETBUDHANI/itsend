"""
Seed data for Career Guidance Platform
Populates database with Indian career paths, exams, and jobs
"""
from app import create_app, db
from app.models_extended import CareerPath, ExamPreparation, Job


def seed_career_paths():
    """Seed career paths"""
    paths = [
        {
            'name': 'Engineering (JEE Path)',
            'description': 'Technical and engineering careers through JEE examination',
            'icon': '⚙️',
            'category': 'Technical',
            'required_stream': 'Science',
            'difficulty_level': 'Hard'
        },
        {
            'name': 'Medical (NEET Path)',
            'description': 'Medical and healthcare careers through NEET examination',
            'icon': '🏥',
            'category': 'Medical',
            'required_stream': 'Science',
            'difficulty_level': 'Hard'
        },
        {
            'name': 'Commerce & Management',
            'description': 'Business, finance, and management careers',
            'icon': '💼',
            'category': 'Business',
            'required_stream': 'Commerce',
            'difficulty_level': 'Medium'
        },
        {
            'name': 'Arts, Design & Humanities',
            'description': 'Creative and social science careers',
            'icon': '🎨',
            'category': 'Creative',
            'required_stream': 'Arts',
            'difficulty_level': 'Medium'
        },
        {
            'name': 'Skill-based & Alternative Careers',
            'description': 'Modern skill-based and digital careers',
            'icon': '💻',
            'category': 'Skills',
            'required_stream': 'Any',
            'difficulty_level': 'Easy'
        },
        {
            'name': 'Law & Legal Services',
            'description': 'Legal profession through CLAT and other law entrances',
            'icon': '⚖️',
            'category': 'Legal',
            'required_stream': 'Any',
            'difficulty_level': 'Hard'
        }
    ]
    
    for path_data in paths:
        existing = CareerPath.query.filter_by(name=path_data['name']).first()
        if not existing:
            career_path = CareerPath(**path_data)
            db.session.add(career_path)
    
    db.session.commit()
    print("✓ Career paths seeded")


def seed_exam_preparations():
    """Seed exam preparation paths"""
    exams = [
        {
            'career_path_id': 1,  # Engineering
            'name': 'JEE Main',
            'exam_type': 'Engineering',
            'difficulty': 'High',
            'timeline': '2 years (Class 11-12)',
            'required_subjects': ['Physics', 'Chemistry', 'Mathematics'],
            'recommended_coaching': True,
            'syllabus_overview': 'Physics, Chemistry, Mathematics - Class 11 & 12 CBSE/State syllabus'
        },
        {
            'career_path_id': 1,  # Engineering
            'name': 'JEE Advanced',
            'exam_type': 'Engineering',
            'difficulty': 'High',
            'timeline': '2 years (Class 11-12)',
            'required_subjects': ['Physics', 'Chemistry', 'Mathematics'],
            'recommended_coaching': True,
            'syllabus_overview': 'Advanced Physics, Chemistry, Mathematics for IITs'
        },
        {
            'career_path_id': 2,  # Medical
            'name': 'NEET UG',
            'exam_type': 'Medical',
            'difficulty': 'High',
            'timeline': '2 years (Class 11-12)',
            'required_subjects': ['Physics', 'Chemistry', 'Biology'],
            'recommended_coaching': True,
            'syllabus_overview': 'Physics, Chemistry, Biology - Class 11 & 12 CBSE/State syllabus'
        },
        {
            'career_path_id': 3,  # Commerce
            'name': 'CA Foundation',
            'exam_type': 'Commerce',
            'difficulty': 'Medium',
            'timeline': '4 months after 12th',
            'required_subjects': ['Accounts', 'Economics', 'Mathematics', 'Law'],
            'recommended_coaching': False,
            'syllabus_overview': 'Accounting, Law, Economics, Quantitative Aptitude'
        },
        {
            'career_path_id': 3,  # Commerce
            'name': 'CAT (MBA)',
            'exam_type': 'Management',
            'difficulty': 'High',
            'timeline': '6-12 months',
            'required_subjects': ['Quantitative Ability', 'Verbal Ability', 'Logical Reasoning'],
            'recommended_coaching': False,
            'syllabus_overview': 'QA, VARC, DILR for IIMs and top B-schools'
        },
        {
            'career_path_id': 4,  # Arts
            'name': 'CUET',
            'exam_type': 'University Entrance',
            'difficulty': 'Medium',
            'timeline': '1 year (Class 12)',
            'required_subjects': ['Language', 'Domain Subject', 'General Test'],
            'recommended_coaching': False,
            'syllabus_overview': 'Common University Entrance Test for central universities'
        },
        {
            'career_path_id': 6,  # Law
            'name': 'CLAT',
            'exam_type': 'Law',
            'difficulty': 'High',
            'timeline': '1-2 years',
            'required_subjects': ['Legal Reasoning', 'Logical Reasoning', 'English', 'GK', 'Quantitative'],
            'recommended_coaching': True,
            'syllabus_overview': 'Common Law Admission Test for National Law Universities'
        }
    ]
    
    for exam_data in exams:
        existing = ExamPreparation.query.filter_by(
            name=exam_data['name'],
            career_path_id=exam_data['career_path_id']
        ).first()
        if not existing:
            exam = ExamPreparation(**exam_data)
            db.session.add(exam)
    
    db.session.commit()
    print("✓ Exam preparations seeded")


def seed_jobs():
    """Seed jobs with Indian salary data"""
    jobs = [
        # Engineering jobs
        {
            'career_path_id': 1,
            'title': 'Software Engineer',
            'description': 'Design and develop software applications',
            'avg_salary_min': 6.0,
            'avg_salary_max': 15.0,
            'required_education': 'B.Tech/B.E. in Computer Science or related field',
            'required_skills': ['Python', 'Java', 'React', 'SQL', 'Git'],
            'growth_rate': 'High',
            'demand_level': 'High',
            'work_environment': 'Hybrid'
        },
        {
            'career_path_id': 1,
            'title': 'Data Scientist',
            'description': 'Analyze data and build ML models',
            'avg_salary_min': 8.0,
            'avg_salary_max': 18.0,
            'required_education': 'B.Tech/M.Tech in CSE/Data Science',
            'required_skills': ['Python', 'Machine Learning', 'Statistics', 'SQL', 'TensorFlow'],
            'growth_rate': 'High',
            'demand_level': 'High',
            'work_environment': 'Hybrid'
        },
        {
            'career_path_id': 1,
            'title': 'Mechanical Engineer',
            'description': 'Design and manufacture mechanical systems',
            'avg_salary_min': 4.5,
            'avg_salary_max': 10.0,
            'required_education': 'B.Tech/B.E. in Mechanical Engineering',
            'required_skills': ['CAD', 'AutoCAD', 'SolidWorks', 'Manufacturing'],
            'growth_rate': 'Medium',
            'demand_level': 'Medium',
            'work_environment': 'Office'
        },
        # Medical jobs
        {
            'career_path_id': 2,
            'title': 'Doctor (MBBS)',
            'description': 'Medical practitioner treating patients',
            'avg_salary_min': 8.0,
            'avg_salary_max': 25.0,
            'required_education': 'MBBS',
            'required_skills': ['Medical Knowledge', 'Patient Care', 'Diagnosis', 'Communication'],
            'growth_rate': 'Medium',
            'demand_level': 'High',
            'work_environment': 'Hospital'
        },
        {
            'career_path_id': 2,
            'title': 'Dentist',
            'description': 'Dental health specialist',
            'avg_salary_min': 6.0,
            'avg_salary_max': 20.0,
            'required_education': 'BDS',
            'required_skills': ['Dental Surgery', 'Patient Care', 'Diagnosis'],
            'growth_rate': 'Medium',
            'demand_level': 'Medium',
            'work_environment': 'Clinic'
        },
        # Commerce jobs
        {
            'career_path_id': 3,
            'title': 'Chartered Accountant',
            'description': 'Financial expert and auditor',
            'avg_salary_min': 7.0,
            'avg_salary_max': 20.0,
            'required_education': 'CA',
            'required_skills': ['Accounting', 'Taxation', 'Auditing', 'Financial Analysis'],
            'growth_rate': 'High',
            'demand_level': 'High',
            'work_environment': 'Office'
        },
        {
            'career_path_id': 3,
            'title': 'MBA Graduate',
            'description': 'Management professional',
            'avg_salary_min': 10.0,
            'avg_salary_max': 30.0,
            'required_education': 'MBA from top B-school',
            'required_skills': ['Leadership', 'Strategy', 'Communication', 'Analytics'],
            'growth_rate': 'High',
            'demand_level': 'High',
            'work_environment': 'Office'
        },
        {
            'career_path_id': 3,
            'title': 'Financial Analyst',
            'description': 'Analyze financial data and investments',
            'avg_salary_min': 5.0,
            'avg_salary_max': 12.0,
            'required_education': 'B.Com/BBA/MBA',
            'required_skills': ['Excel', 'Financial Modeling', 'Data Analysis', 'Market Research'],
            'growth_rate': 'Medium',
            'demand_level': 'High',
            'work_environment': 'Office'
        },
        # Arts & Humanities
        {
            'career_path_id': 4,
            'title': 'Graphic Designer',
            'description': 'Create visual content and designs',
            'avg_salary_min': 3.5,
            'avg_salary_max': 8.0,
            'required_education': 'B.Des/BFA or related',
            'required_skills': ['Adobe Photoshop', 'Illustrator', 'Creativity', 'UI/UX'],
            'growth_rate': 'Medium',
            'demand_level': 'Medium',
            'work_environment': 'Office/Remote'
        },
        {
            'career_path_id': 4,
            'title': 'Content Writer',
            'description': 'Write engaging content for digital media',
            'avg_salary_min': 3.0,
            'avg_salary_max': 7.0,
            'required_education': 'BA in English/Journalism or related',
            'required_skills': ['Writing', 'SEO', 'Research', 'Creativity'],
            'growth_rate': 'Medium',
            'demand_level': 'High',
            'work_environment': 'Remote'
        },
        # Skill-based
        {
            'career_path_id': 5,
            'title': 'Full-Stack Developer',
            'description': 'Build complete web applications',
            'avg_salary_min': 6.0,
            'avg_salary_max': 16.0,
            'required_education': 'B.Tech/BCA or bootcamp certification',
            'required_skills': ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Git'],
            'growth_rate': 'High',
            'demand_level': 'High',
            'work_environment': 'Remote'
        },
        {
            'career_path_id': 5,
            'title': 'Digital Marketing Specialist',
            'description': 'Manage online marketing campaigns',
            'avg_salary_min': 4.0,
            'avg_salary_max': 10.0,
            'required_education': 'Any degree + digital marketing certification',
            'required_skills': ['SEO', 'Google Ads', 'Social Media', 'Analytics'],
            'growth_rate': 'High',
            'demand_level': 'High',
            'work_environment': 'Hybrid'
        },
        # Law
        {
            'career_path_id': 6,
            'title': 'Lawyer',
            'description': 'Practice law and represent clients',
            'avg_salary_min': 5.0,
            'avg_salary_max': 20.0,
            'required_education': 'LLB from NLU or other law college',
            'required_skills': ['Legal Research', 'Communication', 'Analysis', 'Negotiation'],
            'growth_rate': 'Medium',
            'demand_level': 'Medium',
            'work_environment': 'Office'
        }
    ]
    
    for job_data in jobs:
        existing = Job.query.filter_by(
            title=job_data['title'],
            career_path_id=job_data['career_path_id']
        ).first()
        if not existing:
            job = Job(**job_data)
            db.session.add(job)
    
    db.session.commit()
    print("✓ Jobs seeded")


def seed_all():
    """Run all seed functions"""
    print("\n🌱 Starting database seeding...")
    seed_career_paths()
    seed_exam_preparations()
    seed_jobs()
    print("✅ Database seeding complete!\n")


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        seed_all()
