"""Module definitions and templates for stage-specific career guidance."""

MODULES = {
    "class10": {
        "id": "class10",
        "name": "Discovery Module",
        "education_label": "Class 10",
        "goal": "Discover strengths, choose stream, and explore career clusters.",
        "assessment_order": [
            "interest_discovery",
            "learning_style",
            "aptitude_basics",
            "personality_explorer",
            "stream_suitability"
        ],
        "assessments": {
            "interest_discovery": {
                "title": "Interest Discovery Test",
                "input_schema": ["research", "creative", "business", "social", "practical"],
                "description": "Identifies natural interest orientation."
            },
            "learning_style": {
                "title": "Learning Style Assessment",
                "input_schema": ["visual", "auditory", "reading", "kinesthetic"],
                "description": "Maps preferred learning mode for subject strategy."
            },
            "aptitude_basics": {
                "title": "Aptitude Basics Test",
                "input_schema": ["math", "logic", "verbal", "problem_solving"],
                "description": "Baseline aptitude profile for stream fit."
            },
            "personality_explorer": {
                "title": "Personality Exploration Test",
                "input_schema": ["openness", "discipline", "teamwork", "resilience"],
                "description": "Light personality profile for stream readiness."
            },
            "stream_suitability": {
                "title": "Stream Suitability Test",
                "input_schema": ["science_fit", "commerce_fit", "arts_fit"],
                "description": "Final stream calibration from student context."
            }
        },
        "premium_features": [
            "Stream Comparison Tool",
            "Subject Difficulty Predictor",
            "Stream to Career Mapping"
        ],
        "output_type": "career_clusters"
    },
    "class12": {
        "id": "class12",
        "name": "Decision Module",
        "education_label": "Class 12",
        "goal": "Choose degree/course/college and prepare for entrance exams.",
        "assessment_order": [
            "domain_strength",
            "career_clarity",
            "college_readiness",
            "exam_fit",
            "decision_confidence"
        ],
        "assessments": {
            "domain_strength": {
                "title": "Domain Strength Assessment",
                "input_schema": ["stem", "commerce", "humanities", "communication"],
                "description": "Measures domain readiness for degree mapping."
            },
            "career_clarity": {
                "title": "Career Clarity Test",
                "input_schema": ["goal_clarity", "interest_stability", "motivation"],
                "description": "Estimates confidence in career direction."
            },
            "college_readiness": {
                "title": "College Readiness Test",
                "input_schema": ["self_learning", "time_management", "discipline"],
                "description": "Academic readiness for top college environments."
            },
            "exam_fit": {
                "title": "Competitive Exam Fit Analysis",
                "input_schema": ["speed", "accuracy", "consistency", "stress_tolerance"],
                "description": "Predicts exam suitability (JEE/NEET/CUET etc.)."
            },
            "decision_confidence": {
                "title": "Decision Confidence Test",
                "input_schema": ["parent_alignment", "backup_plan", "certainty"],
                "description": "Flags indecision and support needs."
            }
        },
        "premium_features": [
            "College Predictor",
            "Scholarship Recommender",
            "Exam Timeline Planner"
        ],
        "output_type": "degrees_courses_colleges"
    },
    "college": {
        "id": "college",
        "name": "Execution Module",
        "education_label": "College",
        "goal": "Prepare students for placement and job readiness.",
        "assessment_order": [
            "technical_skill",
            "placement_readiness",
            "resume_portfolio",
            "domain_fit",
            "career_path_selector"
        ],
        "assessments": {
            "technical_skill": {
                "title": "Technical Skill Assessment",
                "input_schema": ["coding", "data_structures", "databases", "tools"],
                "description": "Measures technical baseline for role fit."
            },
            "placement_readiness": {
                "title": "Placement Readiness Test",
                "input_schema": ["aptitude", "communication", "interview_basics"],
                "description": "Assesses hiring-cycle readiness."
            },
            "resume_portfolio": {
                "title": "Resume/Portfolio Analyzer",
                "input_schema": ["resume_quality", "projects", "impact", "proof"],
                "description": "Evaluates application credibility."
            },
            "domain_fit": {
                "title": "Domain Fit Assessment",
                "input_schema": ["software", "data", "product", "core_engineering"],
                "description": "Finds strongest placement domain."
            },
            "career_path_selector": {
                "title": "Career Path Selector",
                "input_schema": ["startup", "enterprise", "research", "higher_studies"],
                "description": "Aligns role path with preferences."
            }
        },
        "premium_features": [
            "ATS Resume Scanner",
            "Mock Interview Bot",
            "Company Fit Predictor",
            "Salary Estimator"
        ],
        "output_type": "job_roles"
    }
}


CLASS10_CLUSTERS = [
    "STEM and Engineering",
    "Business and Commerce",
    "Humanities and Communication",
    "Design and Creative Media",
    "Public Service and Social Impact"
]

CLASS12_DEGREES = [
    "B.Tech / B.E.",
    "MBBS / Allied Health",
    "B.Com / BBA",
    "B.Sc. Data or Analytics",
    "BA / Law Integrated Programs"
]

CLASS12_EXAMS = ["JEE", "NEET", "CUET", "CLAT", "NDA", "CA Foundation"]

COLLEGE_ROLES = [
    "Software Engineer",
    "Data Analyst",
    "Product Associate",
    "Business Analyst",
    "Operations Associate",
    "QA Engineer"
]


ROADMAP_TEMPLATES = {
    "class10": {
        "title": "4-Year Stream-to-Career Roadmap",
        "steps": [
            {"phase": "Year 1", "focus": "Subject strength consolidation and stream awareness"},
            {"phase": "Year 2", "focus": "Stream commitment and foundational projects"},
            {"phase": "Year 3", "focus": "Class 11 specialization with target subjects"},
            {"phase": "Year 4", "focus": "Class 12 performance and post-school transition"}
        ]
    },
    "class12": {
        "title": "College Admission Roadmap",
        "steps": [
            {"phase": "Quarter 1", "focus": "Exam strategy and rank target planning"},
            {"phase": "Quarter 2", "focus": "Degree mapping and college tier shortlist"},
            {"phase": "Quarter 3", "focus": "Application package and scholarship planning"},
            {"phase": "Quarter 4", "focus": "Admission execution and college readiness"}
        ]
    },
    "college": {
        "title": "Placement Execution Roadmap",
        "steps": [
            {"phase": "Phase 1", "focus": "Core skill and resume baseline"},
            {"phase": "Phase 2", "focus": "Role-focused projects and portfolio depth"},
            {"phase": "Phase 3", "focus": "Interview preparation and company targeting"},
            {"phase": "Phase 4", "focus": "Offer conversion and transition planning"}
        ]
    }
}
