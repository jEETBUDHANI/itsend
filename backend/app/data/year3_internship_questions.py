"""
YEAR 3 (INTERNSHIP MODE) - Questions & Data
Internship Preparation & Practical Experience
"""

YEAR3_QUESTIONS = [
    # Section 1: Experience Assessment
    {
        "id": 1,
        "question": "How many projects have you completed in your domain?",
        "type": "single",
        "section": "Experience",
        "options": ["0 projects", "1-2 projects", "3-5 projects", "5+ projects"]
    },
    {
        "id": 2,
        "question": "Do you have a GitHub/portfolio with your projects?",
        "type": "single",
        "section": "Experience",
        "options": ["Yes, well-maintained", "Yes, basic", "No, but have projects", "No"]
    },
    
    # Section 2: Technical Skills
    {
        "id": 3,
        "question": "Rate your technical depth in your specialization",
        "type": "scale",
        "section": "Technical",
        "scale": [1, 5],
        "labels": ["Beginner", "Advanced"]
    },
    {
        "id": 4,
        "question": "Which technologies are you comfortable with?",
        "type": "multi-select",
        "section": "Technical",
        "options": ["Frontend (HTML, CSS, JS)", "Backend (Node, Django, Flask)", "Databases (SQL, NoSQL)", "Cloud (AWS, GCP, Azure)", "DevOps (Docker, K8s)", "Mobile Development", "Data Science", "Others"]
    },
    
    # Section 3: Internship Preferences
    {
        "id": 5,
        "question": "What type of internship are you looking for?",
        "type": "multi-select",
        "section": "Preferences",
        "options": ["Remote", "On-site", "Hybrid", "Flexible"]
    },
    {
        "id": 6,
        "question": "Expected internship duration",
        "type": "single",
        "section": "Preferences",
        "options": ["6 weeks (Summer)", "2-3 months", "6 months", "Flexible"]
    },
    
    # Section 4: Skill Assessment
    {
        "id": 7,
        "question": "Rate your problem-solving ability",
        "type": "scale",
        "section": "Skills",
        "scale": [1, 5],
        "labels": ["Weak", "Strong"]
    },
    {
        "id": 8,
        "question": "Rate your communication skills",
        "type": "scale",
        "section": "Skills",
        "scale": [1, 5],
        "labels": ["Poor", "Excellent"]
    },
    
    # Section 5: Readiness
    {
        "id": 9,
        "question": "Have you participated in any internships before?",
        "type": "single",
        "section": "Readiness",
        "options": ["No", "1 internship", "2-3 internships", "4+ internships"]
    },
    {
        "id": 10,
        "question": "Your primary goal for this internship",
        "type": "single",
        "section": "Readiness",
        "options": ["Learn new skills", "Gain industry experience", "Build a project", "Get pre-placement offer"]
    }
]

# Internship Specializations
INTERNSHIP_SPECIALIZATIONS = {
    "web_dev": {
        "name": "Web Development",
        "description": "Full-stack, frontend, or backend web development internship",
        "typical_roles": ["Frontend Intern", "Backend Intern", "Full-Stack Intern"],
        "skills_needed": ["JavaScript/TypeScript", "React/Vue", "Node.js/Django", "APIs", "Databases"],
        "companies": ["Google", "Microsoft", "Amazon", "Flipkart", "Swiggy", "OYO", "Startups"],
        "stipend_range": "₹15,000 - ₹40,000/month",
        "duration_months": 3
    },
    
    "mobile_dev": {
        "name": "Mobile Development",
        "description": "Android, iOS, or React Native development internship",
        "typical_roles": ["Android Intern", "iOS Intern", "Mobile Intern"],
        "skills_needed": ["Kotlin/Java", "Swift", "React Native", "Mobile UI/UX", "APIs"],
        "companies": ["Google", "Apple", "Microsoft", "Uber", "Swiggy"],
        "stipend_range": "₹20,000 - ₹45,000/month",
        "duration_months": 3
    },
    
    "data_science": {
        "name": "Data Science & Analytics",
        "description": "Data analysis, ML, and analytics internship",
        "typical_roles": ["Data Analyst Intern", "ML Engineer Intern", "Analytics Intern"],
        "skills_needed": ["Python", "SQL", "Pandas", "ML basics", "Data Visualization"],
        "companies": ["Google", "Amazon", "Microsoft", "Flipkart", "Razorpay"],
        "stipend_range": "₹20,000 - ₹50,000/month",
        "duration_months": 3
    },
    
    "devops": {
        "name": "DevOps & Cloud",
        "description": "Cloud infrastructure and DevOps internship",
        "typical_roles": ["DevOps Intern", "Cloud Intern", "Infrastructure Intern"],
        "skills_needed": ["Linux", "Docker", "AWS/GCP", "CI/CD", "Kubernetes basics"],
        "companies": ["Google Cloud", "AWS", "Microsoft Azure", "Netflix"],
        "stipend_range": "₹25,000 - ₹50,000/month",
        "duration_months": 3
    }
}

# Internship Readiness Levels
READINESS_LEVELS = {
    "ready": {
        "score_range": "70-100",
        "status": "Ready for Internships!",
        "message": "You're well-prepared. Start applying to companies immediately.",
        "focus": ["Polish resume", "Practice interviews", "Build 1-2 more projects"]
    },
    "medium": {
        "score_range": "50-69",
        "status": "Need More Preparation",
        "message": "You're on the right track. Focus on key skills.",
        "focus": ["Complete 2-3 more projects", "Strengthen technical skills", "Build portfolio"]
    },
    "beginner": {
        "score_range": "0-49",
        "status": "Build Foundations First",
        "message": "Focus on learning fundamentals before applying.",
        "focus": ["Complete LeetCode problems", "Build 3-4 projects", "Learn core concepts"]
    }
}

# Internship Roadmap (6 weeks)
INTERNSHIP_ROADMAP = {
    "week_1": {
        "focus": "Planning & Assessment",
        "tasks": [
            "Identify target domains",
            "Review job descriptions",
            "Assess current skills"
        ]
    },
    "week_2_3": {
        "focus": "Skill Building & Projects",
        "tasks": [
            "Complete 1 mini-project",
            "Practice domain-specific problems",
            "Update portfolio"
        ]
    },
    "week_4": {
        "focus": "Portfolio Polish",
        "tasks": [
            "Refine GitHub profile",
            "Write project descriptions",
            "Get peer reviews"
        ]
    },
    "week_5_6": {
        "focus": "Applications & Interviews",
        "tasks": [
            "Apply to 15+ companies",
            "Prepare for technical interviews",
            "Mock interviews"
        ]
    }
}
