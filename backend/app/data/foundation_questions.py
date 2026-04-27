"""
YEAR 1-2 (FOUNDATION MODE) - Questions & Data
Exploration & Foundation Building
"""

FOUNDATION_QUESTIONS = [
    # Section 1: Interest Exploration
    {
        "id": 1,
        "question": "What interests you most in your field of study?",
        "type": "multi-select",
        "section": "Interest",
        "options": ["Problem-solving", "Building things", "Data & analysis", "People & communication", "Creative work", "Business & entrepreneurship"]
    },
    {
        "id": 2,
        "question": "How would you rate your current foundational knowledge?",
        "type": "scale",
        "section": "Foundation",
        "scale": [1, 5],
        "labels": ["Beginner", "Strong"]
    },
    
    # Section 2: Learning Style
    {
        "id": 3,
        "question": "What's your preferred learning approach?",
        "type": "single",
        "section": "Learning",
        "options": ["Hands-on projects", "Structured courses", "Research & reading", "Collaborative learning", "Mix of everything"]
    },
    {
        "id": 4,
        "question": "How much time can you dedicate to learning per week?",
        "type": "single",
        "section": "Learning",
        "options": ["5-10 hours", "10-15 hours", "15-20 hours", "20+ hours"]
    },
    
    # Section 3: Domain Exploration
    {
        "id": 5,
        "question": "Which domains are you curious about?",
        "type": "multi-select",
        "section": "Domain",
        "options": ["Web & App Development", "Data Science & AI", "Cloud & DevOps", "Cybersecurity", "Mobile Development", "Not sure yet"]
    },
    {
        "id": 6,
        "question": "Have you done any projects or courses before?",
        "type": "single",
        "section": "Domain",
        "options": ["No", "1 course/project", "2-3 courses/projects", "4+ courses/projects"]
    },
    
    # Section 4: Goals
    {
        "id": 7,
        "question": "What's your primary goal for Year 1-2?",
        "type": "single",
        "section": "Goals",
        "options": ["Build strong fundamentals", "Explore different domains", "Complete certifications", "Build portfolio projects"]
    },
    {
        "id": 8,
        "question": "Rate your self-discipline & consistency",
        "type": "scale",
        "section": "Goals",
        "scale": [1, 5],
        "labels": ["Low", "High"]
    }
]

# Learning Paths for Foundation
FOUNDATION_DOMAINS = {
    "web_dev": {
        "name": "Web Development Foundation",
        "description": "Learn HTML, CSS, JavaScript fundamentals",
        "duration_months": 6,
        "courses": [
            "HTML & CSS Basics",
            "JavaScript Fundamentals",
            "DOM & Basic Interactivity",
            "Responsive Design"
        ],
        "projects": ["Personal Portfolio", "Simple Web App"],
        "resources": ["FreeCodeCamp", "Codecademy", "MDN Docs"]
    },
    
    "data_science": {
        "name": "Data Science Foundation",
        "description": "Learn Python, pandas, basic statistics",
        "duration_months": 6,
        "courses": [
            "Python Basics",
            "Data Analysis with Pandas",
            "Statistics & Probability",
            "Data Visualization"
        ],
        "projects": ["Analysis Project 1", "Analysis Project 2"],
        "resources": ["Python.org", "Kaggle", "Analytics Vidhya"]
    },
    
    "mobile_dev": {
        "name": "Mobile Development Foundation",
        "description": "Learn mobile app basics (Android/Flutter)",
        "duration_months": 6,
        "courses": [
            "Mobile UI Fundamentals",
            "Flutter Basics or Android Basics",
            "State Management",
            "APIs & Backend Integration"
        ],
        "projects": ["Todo App", "Weather App"],
        "resources": ["Flutter.dev", "Developer.android.com"]
    },
    
    "devops": {
        "name": "DevOps & Cloud Foundation",
        "description": "Learn Linux, Docker, basic cloud concepts",
        "duration_months": 6,
        "courses": [
            "Linux Fundamentals",
            "Docker Basics",
            "Cloud Concepts (AWS/GCP/Azure)",
            "CI/CD Basics"
        ],
        "projects": ["Deploy App", "Container Orchestration"],
        "resources": ["Linux Academy", "Docker Docs", "Cloud Provider Docs"]
    }
}

# Semester-wise roadmap
FOUNDATION_ROADMAP = {
    "semester_1": {
        "focus": "Core Fundamentals",
        "months": "Months 1-3",
        "subjects": [
            "Programming Basics",
            "Data Structures",
            "Web/Mobile Basics",
            "Mathematics for CS"
        ],
        "deliverables": ["2 small projects", "Course certifications"]
    },
    
    "semester_2": {
        "focus": "Deeper Learning & Exploration",
        "months": "Months 4-6",
        "subjects": [
            "Advanced Concepts",
            "Choose 1 domain",
            "Build projects",
            "Soft skills"
        ],
        "deliverables": ["1 portfolio project", "GitHub profile setup"]
    }
}

# Foundation Score Levels
FOUNDATION_LEVELS = {
    "ready_to_explore": {
        "score_range": "70-100",
        "status": "Ready to Explore Domains",
        "focus": ["Pick a domain", "Start specialized learning", "Build first projects"]
    },
    "needs_basics": {
        "score_range": "40-69",
        "status": "Strengthen Fundamentals",
        "focus": ["Core programming", "DSA basics", "Problem-solving"]
    },
    "getting_started": {
        "score_range": "0-39",
        "status": "Getting Started",
        "focus": ["Programming basics", "Complete foundational course", "Build confidence"]
    }
}
