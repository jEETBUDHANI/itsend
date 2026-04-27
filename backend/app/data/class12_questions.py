"""
CLASS 12 ASSESSMENT QUESTIONS & DATA
Decision Phase: College Selection & Entrance Exam Planning
"""

CLASS12_BASE_QUESTIONS = [
    {
        "id": 1,
        "question": "Which entrance exams are you considering?",
        "type": "multi-select",
        "options": ["JEE Mains/Advanced", "NEET", "CUET", "State-level exams", "None - Direct admission"]
    },
    {
        "id": 2,
        "question": "What's your primary goal after Class 12?",
        "type": "single",
        "options": ["Get into top engineering college", "Pursue medical/dental", "Commerce/Business degree", "Arts/Humanities", "Skill-based job"]
    },
    {
        "id": 3,
        "question": "How would you rate your exam preparation so far?",
        "type": "scale",
        "scale": [1, 5],
        "labels": ["Just started", "Well prepared"]
    },
    {
        "id": 4,
        "question": "What type of college environment do you prefer?",
        "type": "single",
        "options": ["Big metropolitan city", "Tier 2 city", "College town", "Online/Hybrid learning"]
    },
    {
        "id": 5,
        "question": "How important is placement record in your college choice?",
        "type": "scale",
        "scale": [1, 5],
        "labels": ["Not important", "Very important"]
    },
    {
        "id": 6,
        "question": "What's your expected budget for college education (4 years)?",
        "type": "single",
        "options": ["< 10 Lakhs", "10-20 Lakhs", "20-40 Lakhs", "> 40 Lakhs", "No budget constraints"]
    },
    {
        "id": 7,
        "question": "Are you interested in scholarships/financial aid?",
        "type": "single",
        "options": ["Yes, essential", "Yes, would help", "Not needed", "Not applicable"]
    },
    {
        "id": 8,
        "question": "What's your risk tolerance for career decisions?",
        "type": "scale",
        "scale": [1, 5],
        "labels": ["Very conservative", "Very adventurous"]
    },
    {
        "id": 9,
        "question": "Do you have backup options if you don't meet cut-offs?",
        "type": "single",
        "options": ["Yes, multiple backup plans", "Have 1-2 backups", "Haven't planned yet", "Will plan later"]
    },
    {
        "id": 10,
        "question": "Preferred specialization in your chosen stream?",
        "type": "multi-select",
        "options": ["Core engineering", "IT/Computer Science", "Biotech/Life Sciences", "Commerce/Economics", "Creative fields"]
    },
    {
        "id": 11,
        "question": "How important is campus life (clubs, sports, culture)?",
        "type": "scale",
        "scale": [1, 5],
        "labels": ["Not important", "Very important"]
    },
    {
        "id": 12,
        "question": "Are you considering abroad education?",
        "type": "single",
        "options": ["Yes, definitely", "Maybe", "No, domestic only", "Undecided"]
    }
]

# Degree path recommendations based on Class 12 stream
DEGREE_PATHS = {
    "SCIENCE": {
        "PCM": [
            {
                "name": "B.Tech (Engineering)",
                "subtypes": ["Computer Science", "Mechanical", "Electrical", "Civil", "Chemical"],
                "exams": ["JEE Mains/Advanced"],
                "colleges": "NIT, IIT, State-level colleges",
                "placement_avg": "12-25 LPA"
            },
            {
                "name": "B.Sc (Physics/Maths/CS)",
                "subtypes": ["Physics", "Mathematics", "Computer Science"],
                "exams": ["CUET", "State-level"],
                "colleges": "DU, JNU, State Universities",
                "placement_avg": "6-12 LPA"
            },
            {
                "name": "Integrated B.Tech + M.Tech",
                "subtypes": ["Dual Degree Programs"],
                "exams": ["JEE", "BITSAT"],
                "colleges": "BITS, IISER, NIT",
                "placement_avg": "15-30 LPA"
            }
        ],
        "PCB": [
            {
                "name": "MBBS (Medicine)",
                "subtypes": ["General", "Surgery", "Specializations"],
                "exams": ["NEET"],
                "colleges": "AIIMS, Top Medical Colleges",
                "placement_avg": "20-50 LPA (Private practice potential)"
            },
            {
                "name": "BDS (Dentistry)",
                "subtypes": ["General", "Specializations"],
                "exams": ["NEET"],
                "colleges": "Top Dental Colleges",
                "placement_avg": "8-20 LPA"
            },
            {
                "name": "B.Pharm/Pharmacy",
                "subtypes": ["Pharma", "Clinical Research"],
                "exams": ["NEET (Some colleges)", "Merit-based"],
                "colleges": "Manipal, Amrita, State colleges",
                "placement_avg": "6-15 LPA"
            },
            {
                "name": "B.Sc (Biotech/Life Sciences)",
                "subtypes": ["Biotechnology", "Microbiology", "Genetics"],
                "exams": ["CUET", "Merit-based"],
                "colleges": "Delhi University, Pune University",
                "placement_avg": "5-12 LPA"
            }
        ]
    },
    "COMMERCE": [
        {
            "name": "B.Com (Hons)",
            "subtypes": ["Accounting", "Finance", "Economics"],
            "exams": ["CUET", "Merit-based"],
            "colleges": "DU, Mumbai University, Symbiosis",
            "placement_avg": "8-18 LPA"
        },
        {
            "name": "B.B.A/Management",
            "subtypes": ["Finance", "Marketing", "Operations", "HR"],
            "exams": ["CUET", "Merit-based", "CAT (for MBA later)"],
            "colleges": "FMS Delhi, IIM-associated, XLRI",
            "placement_avg": "10-20 LPA"
        },
        {
            "name": "B.Com + CA/CS/CMA",
            "subtypes": ["Chartered Accountancy", "Company Secretary", "Cost Accountancy"],
            "exams": ["Merit-based"],
            "colleges": "Any recognized college + professional exams",
            "placement_avg": "15-40 LPA"
        },
        {
            "name": "Actuarial Science",
            "subtypes": ["Risk Management", "Insurance", "Pension"],
            "exams": ["Merit-based", "Professional exams"],
            "colleges": "Delhi University, Symbiosis",
            "placement_avg": "20-50 LPA"
        }
    ],
    "ARTS": [
        {
            "name": "B.A (Hons)",
            "subtypes": ["Economics", "Political Science", "History", "Geography"],
            "exams": ["CUET", "Merit-based"],
            "colleges": "Delhi University, JNU, TISS",
            "placement_avg": "4-10 LPA"
        },
        {
            "name": "B.A + Law (5-year)",
            "subtypes": ["Constitutional", "Corporate", "Criminal Law"],
            "exams": ["CUET", "Law entrance exams"],
            "colleges": "NALSAR, NLSIU, Top law schools",
            "placement_avg": "10-30 LPA"
        },
        {
            "name": "Journalism/Media",
            "subtypes": ["Print", "Broadcast", "Digital Media"],
            "exams": ["Merit-based", "Portfolio-based"],
            "colleges": "IIJNM, Asian College of Journalism",
            "placement_avg": "6-15 LPA"
        },
        {
            "name": "Psychology/Sociology",
            "subtypes": ["Clinical", "Organizational", "Social"],
            "exams": ["CUET", "Merit-based"],
            "colleges": "Delhi University, JNU",
            "placement_avg": "5-12 LPA"
        }
    ]
}

# College recommendations based on performance
COLLEGE_TIERS = {
    "Top Tier": {
        "description": "Top 20 colleges nationally (IIT, AIIMS, Delhi University, etc.)",
        "cut_off_range": "95-100 percentile",
        "placement_avg": "15-40 LPA",
        "examples": ["IIT Delhi", "AIIMS Delhi", "Delhi University (North Campus)"]
    },
    "Tier 1": {
        "description": "State NIT, Good private colleges",
        "cut_off_range": "85-95 percentile",
        "placement_avg": "10-20 LPA",
        "examples": ["NIT Trichy", "BITS Pilani", "Manipal"]
    },
    "Tier 2": {
        "description": "State colleges, decent private universities",
        "cut_off_range": "70-85 percentile",
        "placement_avg": "6-12 LPA",
        "examples": ["State University", "Regional private colleges"]
    },
    "Tier 3": {
        "description": "Emerging colleges, affiliation-based",
        "cut_off_range": "50-70 percentile",
        "placement_avg": "4-8 LPA",
        "examples": ["Regional colleges"]
    }
}

EXAM_STRATEGIES = {
    "JEE_MAINS": {
        "description": "National entrance exam for engineering",
        "attempts": 2,
        "cutoff": "Percentile based",
        "preparation": "12-18 months",
        "difficulty": "High",
        "colleges": 30000
    },
    "NEET": {
        "description": "National entrance exam for medical/dental",
        "attempts": "Unlimited",
        "cutoff": "Category-based percentile",
        "preparation": "12-18 months",
        "difficulty": "Very High",
        "colleges": 650
    },
    "CUET": {
        "description": "Central entrance test for central universities",
        "attempts": 2,
        "cutoff": "Merit-based",
        "preparation": "3-6 months",
        "difficulty": "Medium",
        "colleges": 90
    }
}

BACKUP_STRATEGIES = [
    {
        "name": "Conservative Path",
        "description": "Multiple backup options, lower risk",
        "strategy": ["Top 5 dream colleges", "5 realistic colleges", "5 safety colleges"],
        "recommendation": "Low risk tolerance"
    },
    {
        "name": "Balanced Path",
        "description": "Mix of aspirational and achievable goals",
        "strategy": ["2-3 dream colleges", "5-7 realistic colleges", "3 safety colleges"],
        "recommendation": "Medium risk tolerance"
    },
    {
        "name": "Aggressive Path",
        "description": "Focus on top colleges only",
        "strategy": ["5 top colleges", "2 backup colleges"],
        "recommendation": "High risk tolerance"
    }
]
