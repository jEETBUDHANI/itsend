"""
COLLEGE ASSESSMENT QUESTIONS & DATA
Execution Phase: Skill Gap Analysis & Placement Readiness
"""

COLLEGE_BASE_QUESTIONS = [
    {
        "id": 1,
        "question": "How many internships/projects have you completed so far?",
        "type": "single",
        "options": ["None yet", "1", "2-3", "4+"]
    },
    {
        "id": 2,
        "question": "Rate your current skill level in your specialization",
        "type": "scale",
        "scale": [1, 5],
        "labels": ["Beginner", "Expert"]
    },
    {
        "id": 3,
        "question": "Which areas do you want to develop?",
        "type": "multi-select",
        "options": ["Technical skills", "Communication", "Leadership", "Problem-solving", "Domain expertise"]
    },
    {
        "id": 4,
        "question": "Are you targeting specific companies/sectors?",
        "type": "single",
        "options": ["Yes, top tech companies", "Yes, specific sector", "Open to any good company", "Undecided"]
    },
    {
        "id": 5,
        "question": "What's your expected salary range?",
        "type": "single",
        "options": ["4-6 LPA", "6-10 LPA", "10-15 LPA", "15+ LPA", "No preference"]
    },
    {
        "id": 6,
        "question": "Have you built a portfolio/GitHub profile?",
        "type": "single",
        "options": ["Yes, well-maintained", "Started but incomplete", "Not yet", "N/A for my field"]
    },
    {
        "id": 7,
        "question": "Rate your communication and presentation skills",
        "type": "scale",
        "scale": [1, 5],
        "labels": ["Poor", "Excellent"]
    },
    {
        "id": 8,
        "question": "How comfortable are you with competitive interviews?",
        "type": "scale",
        "scale": [1, 5],
        "labels": ["Very anxious", "Very confident"]
    },
    {
        "id": 9,
        "question": "Do you prefer startup or corporate environment?",
        "type": "single",
        "options": ["Startup - fast-paced", "Corporate - structured", "No preference", "Freelance/Self-employed"]
    },
    {
        "id": 10,
        "question": "Rate your networking and professional connections",
        "type": "scale",
        "scale": [1, 5],
        "labels": ["Minimal network", "Strong network"]
    },
    {
        "id": 11,
        "question": "Are you interested in higher studies (Masters)?",
        "type": "single",
        "options": ["Definitely", "Maybe", "No, focus on jobs", "Undecided"]
    },
    {
        "id": 12,
        "question": "Timeline to first placement/job",
        "type": "single",
        "options": ["Immediate (within 3 months)", "Quick (3-6 months)", "Flexible (6-12 months)", "Not in hurry"]
    }
]

# Job profiles based on different specializations
JOB_PROFILES = {
    "COMPUTER_SCIENCE": {
        "roles": [
            {
                "title": "Software Developer",
                "avg_salary": "8-15 LPA",
                "skills": ["Programming", "Data Structures", "System Design"],
                "companies": ["Google", "Microsoft", "Amazon", "Flipkart"]
            },
            {
                "title": "Data Scientist",
                "avg_salary": "10-18 LPA",
                "skills": ["Python/R", "Machine Learning", "Statistics"],
                "companies": ["Amazon", "Microsoft", "Adobe"]
            },
            {
                "title": "DevOps Engineer",
                "avg_salary": "12-20 LPA",
                "skills": ["Cloud platforms", "Docker", "Kubernetes"],
                "companies": ["Amazon Web Services", "Google Cloud"]
            },
            {
                "title": "Backend Engineer",
                "avg_salary": "10-16 LPA",
                "skills": ["API Design", "Databases", "Scalability"],
                "companies": ["Uber", "Netflix", "Swiggy"]
            }
        ]
    },
    "MECHANICAL": {
        "roles": [
            {
                "title": "Product Engineer",
                "avg_salary": "6-12 LPA",
                "skills": ["CAD", "Design", "Manufacturing"],
                "companies": ["Bajaj", "Hero", "Maruti"]
            },
            {
                "title": "Thermal Engineer",
                "avg_salary": "7-13 LPA",
                "skills": ["Thermodynamics", "HVAC", "Analysis"],
                "companies": ["Bosch", "Johnson Controls"]
            },
            {
                "title": "Manufacturing Engineer",
                "avg_salary": "6-11 LPA",
                "skills": ["Process Optimization", "Quality Control"],
                "companies": ["Maruti", "Hero", "Bajaj"]
            }
        ]
    },
    "ELECTRONICS": {
        "roles": [
            {
                "title": "Embedded Systems Engineer",
                "avg_salary": "7-14 LPA",
                "skills": ["C/C++", "Microcontrollers", "Embedded Linux"],
                "companies": ["Intel", "Qualcomm", "Samsung"]
            },
            {
                "title": "Hardware Design Engineer",
                "avg_salary": "8-15 LPA",
                "skills": ["Circuit Design", "VLSI", "HDL"],
                "companies": ["Qualcomm", "AMD", "Broadcom"]
            }
        ]
    },
    "COMMERCE": {
        "roles": [
            {
                "title": "Financial Analyst",
                "avg_salary": "6-14 LPA",
                "skills": ["Excel", "Financial Modeling", "Analysis"],
                "companies": ["Goldman Sachs", "Morgan Stanley", "ICICI"]
            },
            {
                "title": "Management Consultant",
                "avg_salary": "8-16 LPA",
                "skills": ["Problem Solving", "Strategy", "Communication"],
                "companies": ["McKinsey", "BCG", "Bain"]
            },
            {
                "title": "Business Analyst",
                "avg_salary": "6-12 LPA",
                "skills": ["Data Analysis", "SQL", "Business Logic"],
                "companies": ["Accenture", "Deloitte", "TCS"]
            }
        ]
    },
    "MEDICINE": {
        "roles": [
            {
                "title": "General Practitioner",
                "avg_salary": "15-40 LPA",
                "skills": ["Clinical Knowledge", "Patient Care"],
                "companies": ["Private clinics", "Hospitals"]
            },
            {
                "title": "Specialist Doctor",
                "avg_salary": "30-100+ LPA",
                "skills": ["Specialization", "Surgery/Procedures"],
                "companies": ["Top hospitals"]
            }
        ]
    }
}

# Skill gaps analysis
SKILL_GAPS = {
    "Technical": {
        "description": "Programming languages, tools, frameworks",
        "assessment": "Based on projects and portfolio",
        "development_time": "3-6 months"
    },
    "Communication": {
        "description": "Presentation, writing, speaking skills",
        "assessment": "Based on interviews and projects",
        "development_time": "2-4 months"
    },
    "Soft Skills": {
        "description": "Leadership, teamwork, problem-solving",
        "assessment": "Based on team project experience",
        "development_time": "Ongoing"
    },
    "Domain Knowledge": {
        "description": "Industry-specific knowledge",
        "assessment": "Based on internships and projects",
        "development_time": "4-8 months"
    }
}

# Placement readiness levels
PLACEMENT_READINESS = {
    "READY": {
        "description": "Ready for placements",
        "criteria": ["Strong portfolio", "Good communication", "2+ internships"],
        "recommendation": "Start applying to companies"
    },
    "DEVELOPING": {
        "description": "On track, some improvements needed",
        "criteria": ["Basic portfolio", "Average communication", "1 internship"],
        "recommendation": "Work on skill gaps for 2-3 months"
    },
    "NEEDS_WORK": {
        "description": "Significant preparation needed",
        "criteria": ["No portfolio", "Weak communication", "No internships"],
        "recommendation": "Intensive preparation for 6+ months"
    }
}

# Career advancement paths
CAREER_PATHS = [
    {
        "level": "Entry Level (0-2 years)",
        "role": "Junior Developer/Associate",
        "salary": "5-8 LPA",
        "focus": ["Learn", "Build portfolio", "Gain experience"]
    },
    {
        "level": "Mid Level (2-5 years)",
        "role": "Senior Developer/Lead",
        "salary": "10-20 LPA",
        "focus": ["Lead projects", "Mentor juniors", "Specialize"]
    },
    {
        "level": "Senior Level (5-10 years)",
        "role": "Manager/Architect",
        "salary": "20-40 LPA",
        "focus": ["Strategy", "Leadership", "Innovation"]
    },
    {
        "level": "Executive (10+ years)",
        "role": "Director/VP",
        "salary": "40+ LPA",
        "focus": ["Business", "Vision", "Organization"]
    }
]
