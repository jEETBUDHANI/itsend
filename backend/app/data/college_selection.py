"""
COLLEGE SKELETON - Degree, Branch, Year Selection
Routes to appropriate flow based on student's current year
"""

DEGREES = {
    "btech": {
        "name": "B.Tech (Engineering)",
        "branches": [
            "Computer Science & Engineering",
            "Information Technology",
            "Mechanical Engineering",
            "Electrical Engineering",
            "Civil Engineering",
            "Electronics & Communication",
            "Chemical Engineering",
            "Aerospace Engineering"
        ]
    },
    "bba": {
        "name": "BBA (Business Administration)",
        "branches": [
            "General Management",
            "Finance",
            "Marketing",
            "Human Resources",
            "Operations Management",
            "Entrepreneurship"
        ]
    },
    "bsc": {
        "name": "B.Sc (Science)",
        "branches": [
            "Physics",
            "Chemistry",
            "Biology",
            "Mathematics",
            "Data Science",
            "Environmental Science"
        ]
    },
    "ba": {
        "name": "B.A (Arts)",
        "branches": [
            "Economics",
            "Psychology",
            "Sociology",
            "History",
            "English Literature",
            "Political Science"
        ]
    },
    "bcom": {
        "name": "B.Com (Commerce)",
        "branches": [
            "Accounting",
            "Finance",
            "Taxation",
            "General Commerce",
            "Economics",
            "Business Administration"
        ]
    }
}

COLLEGE_YEARS = {
    "year_1_2": {
        "display": "Year 1 - 2",
        "stage": "Foundation",
        "description": "Exploration & Foundation Building",
        "route": "/college/foundation",
        "focus": "Learn fundamentals, explore interests, build basic skills"
    },
    "year_3": {
        "display": "Year 3",
        "stage": "Internship",
        "description": "Internship Preparation",
        "route": "/college/internship",
        "focus": "Get internship-ready, build projects, gain practical experience"
    },
    "year_4": {
        "display": "Final Year (Year 4)",
        "stage": "Placement",
        "description": "Placement Mode",
        "route": "/college/placement",
        "focus": "Land your first job, master interviews, get placed"
    }
}

# Map for year -> stage
YEAR_TO_STAGE = {
    "year_1_2": "foundation",
    "year_3": "internship",
    "year_4": "placement"
}

# Selection payload structure
# {
#   "degree": "btech",
#   "branch": "Computer Science & Engineering",
#   "year": "year_4",
#   "stage": "placement",
#   "route": "/college/placement"
# }
