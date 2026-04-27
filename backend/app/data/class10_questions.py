"""Class 10 Assessment Questions - Discovery Mode (Stream Selection)"""

# LAYER 1: BASE ASSESSMENT (Common for all Class 10 students)
# Purpose: Determine interest areas and initial personality traits
CLASS10_BASE_QUESTIONS = [
    # Interest & Subject Affinity (5 questions)
    {
        "id": 1,
        "category": "interest",
        "text": "Which subjects interest you the most?",
        "type": "multi-select",
        "options": ["Physics", "Chemistry", "Biology", "Mathematics", "English", "History", "Geography", "Economics"],
        "maps_to": ["science", "commerce", "arts"]
    },
    {
        "id": 2,
        "category": "interest",
        "text": "What type of activities do you enjoy?",
        "type": "multi-select",
        "options": ["Solving problems", "Experiments", "Reading", "Writing", "Discussions", "Building things", "Analyzing data"],
        "maps_to": ["science", "commerce", "arts"]
    },
    {
        "id": 3,
        "category": "strength",
        "text": "What do you consider your strongest skill?",
        "type": "single",
        "options": ["Problem-solving", "Creative thinking", "Communication", "Critical analysis", "Memorization", "Leadership"],
        "maps_to": ["science", "commerce", "arts"]
    },
    {
        "id": 4,
        "category": "interest",
        "text": "What career areas interest you? (select all that apply)",
        "type": "multi-select",
        "options": [
            "Technology/IT",
            "Engineering",
            "Medicine/Healthcare",
            "Business/Finance",
            "Law",
            "Government/Administration",
            "Arts/Media",
            "Teaching",
            "Undecided"
        ],
        "maps_to": ["science", "commerce", "arts"]
    },
    {
        "id": 5,
        "category": "personality",
        "text": "How do you prefer to learn?",
        "type": "single",
        "options": ["Through experiments and hands-on", "Through case studies and analysis", "Through discussion and theory"],
        "maps_to": ["science", "commerce", "arts"]
    },
    
    # Personality Traits (Big 5 adapted for Class 10) (6 questions)
    {
        "id": 6,
        "category": "personality",
        "text": "I enjoy trying new things and exploring new ideas",
        "type": "scale",
        "scale": [1, 2, 3, 4, 5],
        "trait": "openness"
    },
    {
        "id": 7,
        "category": "personality",
        "text": "I am very organized and like to plan ahead",
        "type": "scale",
        "scale": [1, 2, 3, 4, 5],
        "trait": "conscientiousness"
    },
    {
        "id": 8,
        "category": "personality",
        "text": "I feel comfortable working in groups and leading discussions",
        "type": "scale",
        "scale": [1, 2, 3, 4, 5],
        "trait": "extraversion"
    },
    {
        "id": 9,
        "category": "personality",
        "text": "I like helping others and understanding their perspectives",
        "type": "scale",
        "scale": [1, 2, 3, 4, 5],
        "trait": "agreeableness"
    },
    {
        "id": 10,
        "category": "personality",
        "text": "I get stressed easily when facing challenges",
        "type": "scale",
        "scale": [1, 2, 3, 4, 5],
        "trait": "neuroticism",
        "reverse": True
    },
    
    # RIASEC Assessment (4 questions - abbreviated for Class 10)
    {
        "id": 11,
        "category": "riasec",
        "text": "I prefer practical, hands-on work with tools and machines",
        "type": "scale",
        "scale": [1, 2, 3, 4, 5],
        "riasec_type": "R"  # Realistic
    },
    {
        "id": 12,
        "category": "riasec",
        "text": "I enjoy researching and exploring new ideas",
        "type": "scale",
        "scale": [1, 2, 3, 4, 5],
        "riasec_type": "I"  # Investigative
    },
    {
        "id": 13,
        "category": "riasec",
        "text": "I like helping others and making a positive impact",
        "type": "scale",
        "scale": [1, 2, 3, 4, 5],
        "riasec_type": "S"  # Social
    },
    {
        "id": 14,
        "category": "riasec",
        "text": "I enjoy creative work like art, music, or writing",
        "type": "scale",
        "scale": [1, 2, 3, 4, 5],
        "riasec_type": "A"  # Artistic
    },
]

# DECISION NODE 1: Stream Prediction Logic
# Based on Base Assessment responses, predict stream
STREAM_PREDICTION_RULES = {
    "science": {
        "keywords": ["Physics", "Chemistry", "Biology", "Mathematics", "Experiments", "Engineering", "Technology", "Medicine"],
        "career_matches": ["Technology/IT", "Engineering", "Medicine/Healthcare"],
        "description": "Science stream - ideal for engineering, medical, or research careers"
    },
    "commerce": {
        "keywords": ["Economics", "Business/Finance", "Leadership", "data", "analysis", "Government/Administration"],
        "career_matches": ["Business/Finance", "Government/Administration"],
        "description": "Commerce stream - ideal for business, finance, accounting careers"
    },
    "arts": {
        "keywords": ["English", "History", "Geography", "Communication", "discussion", "Arts/Media", "Law", "Teaching", "creative"],
        "career_matches": ["Law", "Government/Administration", "Arts/Media", "Teaching"],
        "description": "Arts stream - ideal for law, government, media, teaching careers"
    }
}

# LAYER 2: STREAM-SPECIFIC ASSESSMENT QUESTIONS
# These are loaded based on predicted stream from Layer 1

CLASS10_SCIENCE_LAYER2 = [
    {
        "id": 101,
        "category": "specialization",
        "text": "Which science specialization interests you more?",
        "type": "single",
        "options": ["PCM (Physics, Chemistry, Math)", "PCB (Physics, Chemistry, Biology)", "Both equally"],
        "weight": 0.4
    },
    {
        "id": 102,
        "category": "aptitude",
        "text": "How would you rate your math skills?",
        "type": "scale",
        "scale": [1, 2, 3, 4, 5],
        "weight": 0.3
    },
    {
        "id": 103,
        "category": "aptitude",
        "text": "How would you rate your science lab skills?",
        "type": "scale",
        "scale": [1, 2, 3, 4, 5],
        "weight": 0.3
    },
    {
        "id": 104,
        "category": "future_plan",
        "text": "What is your primary goal after 12th?",
        "type": "single",
        "options": ["Engineering entrance exams (JEE/NIT)", "Medical entrance exams (NEET)", "College admission", "Undecided"],
        "weight": 0.35
    },
    {
        "id": 105,
        "category": "study_style",
        "text": "Do you prefer theoretical or practical learning?",
        "type": "single",
        "options": ["Theoretical", "Practical", "Mixed"],
        "weight": 0.15
    },
]

CLASS10_COMMERCE_LAYER2 = [
    {
        "id": 201,
        "category": "specialization",
        "text": "Which commerce specialization interests you?",
        "type": "single",
        "options": ["Accounting & Finance", "Economics & Business", "Both equally"],
        "weight": 0.4
    },
    {
        "id": 202,
        "category": "aptitude",
        "text": "How would you rate your numerical abilities?",
        "type": "scale",
        "scale": [1, 2, 3, 4, 5],
        "weight": 0.3
    },
    {
        "id": 203,
        "category": "aptitude",
        "text": "How would you rate your analytical thinking?",
        "type": "scale",
        "scale": [1, 2, 3, 4, 5],
        "weight": 0.3
    },
    {
        "id": 204,
        "category": "future_plan",
        "text": "What is your primary career goal?",
        "type": "single",
        "options": ["Chartered Accountant (CA)", "Business owner", "Finance professional", "Government job", "Undecided"],
        "weight": 0.35
    },
    {
        "id": 205,
        "category": "study_style",
        "text": "Do you prefer numbers/logic or qualitative analysis?",
        "type": "single",
        "options": ["Numbers/Logic", "Qualitative", "Both"],
        "weight": 0.15
    },
]

CLASS10_ARTS_LAYER2 = [
    {
        "id": 301,
        "category": "specialization",
        "text": "Which subject combination interests you most?",
        "type": "single",
        "options": ["History & Geography", "Economics & Geography", "English & Literature", "Mixed"],
        "weight": 0.4
    },
    {
        "id": 302,
        "category": "aptitude",
        "text": "How would you rate your communication skills?",
        "type": "scale",
        "scale": [1, 2, 3, 4, 5],
        "weight": 0.3
    },
    {
        "id": 303,
        "category": "aptitude",
        "text": "How would you rate your analytical/reasoning skills?",
        "type": "scale",
        "scale": [1, 2, 3, 4, 5],
        "weight": 0.3
    },
    {
        "id": 304,
        "category": "future_plan",
        "text": "What is your primary career aspiration?",
        "type": "single",
        "options": ["Law", "Journalism/Media", "Teaching", "Government service (UPSC)", "Creative field", "Undecided"],
        "weight": 0.35
    },
    {
        "id": 305,
        "category": "study_style",
        "text": "Do you prefer reading/theory or practical application?",
        "type": "single",
        "options": ["Reading/Theory", "Practical", "Both"],
        "weight": 0.15
    },
]

# Career Clusters for Each Stream
CLASS10_CAREER_CLUSTERS = {
    "science": {
        "PCM": [
            {"name": "Software Engineer", "cluster": "Tech", "description": "Build software and applications"},
            {"name": "Data Scientist", "cluster": "Tech", "description": "Analyze data and build AI models"},
            {"name": "Civil Engineer", "cluster": "Core Engineering", "description": "Design and build infrastructure"},
            {"name": "Mechanical Engineer", "cluster": "Core Engineering", "description": "Design machines and systems"},
            {"name": "Product Manager", "cluster": "Tech Management", "description": "Lead product development"},
        ],
        "PCB": [
            {"name": "Doctor (MBBS)", "cluster": "Medical", "description": "Healthcare professional"},
            {"name": "Pharmacist", "cluster": "Medical", "description": "Medication specialist"},
            {"name": "Biotechnologist", "cluster": "Research", "description": "Work with biological systems"},
            {"name": "Nurse", "cluster": "Healthcare", "description": "Patient care professional"},
            {"name": "Veterinarian", "cluster": "Healthcare", "description": "Animal healthcare"},
        ]
    },
    "commerce": {
        "all": [
            {"name": "Chartered Accountant (CA)", "cluster": "Finance", "description": "Accounting and auditing professional"},
            {"name": "Company Secretary (CS)", "cluster": "Business", "description": "Corporate governance professional"},
            {"name": "Banker", "cluster": "Finance", "description": "Banking and financial services"},
            {"name": "Stock Broker", "cluster": "Finance", "description": "Securities and investment professional"},
            {"name": "Entrepreneur", "cluster": "Business", "description": "Start your own business"},
        ]
    },
    "arts": {
        "all": [
            {"name": "Lawyer", "cluster": "Law", "description": "Legal professional"},
            {"name": "IAS/IPS Officer", "cluster": "Government", "description": "Civil service officer"},
            {"name": "Journalist", "cluster": "Media", "description": "News and content professional"},
            {"name": "Teacher", "cluster": "Education", "description": "Academic educator"},
            {"name": "Writer/Author", "cluster": "Creative", "description": "Content and creative writing"},
        ]
    }
}
