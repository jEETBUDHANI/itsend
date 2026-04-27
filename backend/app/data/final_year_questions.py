"""
FINAL YEAR (PLACEMENT MODE) - Questions & Data
Most Important Stage: Land Your First Job
Comprehensive assessment covering: Technical skills, resume, domains, interview readiness
"""

FINAL_YEAR_QUESTIONS = [
    # Section 1: Placement Readiness
    {
        "id": 1,
        "question": "How many internships/practical experiences have you completed?",
        "type": "single",
        "section": "Readiness",
        "options": ["None", "1", "2", "3+"]
    },
    {
        "id": 2,
        "question": "Rate your overall communication skills",
        "type": "scale",
        "section": "Readiness",
        "scale": [1, 5],
        "labels": ["Poor", "Excellent"]
    },
    
    # Section 2: Technical Assessment
    {
        "id": 3,
        "question": "What's your proficiency level in core technical concepts?",
        "type": "scale",
        "section": "Technical",
        "scale": [1, 5],
        "labels": ["Beginner", "Expert"]
    },
    {
        "id": 4,
        "question": "Which programming languages are you confident in? (Select all that apply)",
        "type": "multi-select",
        "section": "Technical",
        "options": ["Python", "Java", "C++", "C#", "JavaScript", "Go", "Rust", "Others"]
    },
    {
        "id": 5,
        "question": "Which domains are you interested in?",
        "type": "multi-select",
        "section": "Technical",
        "options": ["Web Development", "Mobile Development", "Cloud & DevOps", "Data Science", "Machine Learning", "Cybersecurity", "Embedded Systems", "Core Engineering"]
    },
    
    # Section 3: Resume & Portfolio
    {
        "id": 6,
        "question": "Do you have a well-maintained GitHub profile/portfolio?",
        "type": "single",
        "section": "Portfolio",
        "options": ["Yes, very active", "Yes, but not updated", "Started but incomplete", "No"]
    },
    {
        "id": 7,
        "question": "How many projects have you completed and can showcase?",
        "type": "single",
        "section": "Portfolio",
        "options": ["0-2 projects", "3-5 projects", "6-10 projects", "10+ projects"]
    },
    
    # Section 4: Job Preferences
    {
        "id": 8,
        "question": "What type of company are you targeting?",
        "type": "multi-select",
        "section": "Preferences",
        "options": ["Top Tech Companies (FAANG)", "Mid-tier Tech Companies", "Startups", "Product Companies", "Service-based Companies", "Consulting", "Any"]
    },
    {
        "id": 9,
        "question": "What's your expected salary range (in LPA)?",
        "type": "single",
        "section": "Preferences",
        "options": ["3-5 LPA", "5-8 LPA", "8-12 LPA", "12-15 LPA", "15+ LPA"]
    },
    
    # Section 5: Interview Readiness
    {
        "id": 10,
        "question": "How many technical interviews have you given?",
        "type": "single",
        "section": "Interview",
        "options": ["None", "1-2", "3-5", "5+"]
    },
    {
        "id": 11,
        "question": "Rate your problem-solving & DSA skills (Data Structures & Algorithms)",
        "type": "scale",
        "section": "Interview",
        "scale": [1, 5],
        "labels": ["Weak", "Strong"]
    },
    {
        "id": 12,
        "question": "Rate your system design knowledge",
        "type": "scale",
        "section": "Interview",
        "scale": [1, 5],
        "labels": ["Beginner", "Advanced"]
    }
]

# Job Specializations & Company Matches
JOB_SPECIALIZATIONS = {
    "web_dev": {
        "name": "Web Development",
        "description": "Full-stack, frontend, or backend web technologies",
        "skills_required": ["JavaScript/TypeScript", "React/Vue/Angular", "Node.js/Django/Flask", "Databases", "REST APIs"],
        "salary_range": "5-12 LPA",
        "roles": [
            {"title": "Frontend Developer", "level": "junior", "avg_salary": "5-8 LPA"},
            {"title": "Backend Developer", "level": "junior", "avg_salary": "6-9 LPA"},
            {"title": "Full-Stack Developer", "level": "junior", "avg_salary": "7-11 LPA"},
        ],
        "top_companies": ["Google", "Microsoft", "Amazon", "Flipkart", "Amazon", "Swiggy", "OYO"],
        "gap_areas": ["Advanced TypeScript", "Microservices", "Docker/Kubernetes", "Testing"]
    },
    
    "mobile_dev": {
        "name": "Mobile Development",
        "description": "iOS, Android, or cross-platform mobile app development",
        "skills_required": ["Java/Kotlin (Android)", "Swift (iOS)", "React Native/Flutter", "Mobile UI/UX", "APIs"],
        "salary_range": "6-13 LPA",
        "roles": [
            {"title": "Android Developer", "level": "junior", "avg_salary": "6-10 LPA"},
            {"title": "iOS Developer", "level": "junior", "avg_salary": "7-11 LPA"},
            {"title": "React Native Developer", "level": "junior", "avg_salary": "6-10 LPA"},
        ],
        "top_companies": ["Google", "Apple", "Microsoft", "Uber", "Swiggy", "Zomato"],
        "gap_areas": ["Advanced UI/UX", "State Management", "Performance Optimization", "Native Development"]
    },
    
    "data_science": {
        "name": "Data Science & Analytics",
        "description": "Data analysis, visualization, and insights generation",
        "skills_required": ["Python", "SQL", "Pandas/NumPy", "Data Visualization", "Statistics", "Excel"],
        "salary_range": "6-14 LPA",
        "roles": [
            {"title": "Junior Data Analyst", "level": "junior", "avg_salary": "5-8 LPA"},
            {"title": "Data Analyst", "level": "junior", "avg_salary": "6-10 LPA"},
            {"title": "Business Analyst", "level": "junior", "avg_salary": "6-9 LPA"},
        ],
        "top_companies": ["Google", "Amazon", "Microsoft", "Flipkart", "Unacademy", "Razorpay"],
        "gap_areas": ["Advanced SQL", "Tableau/PowerBI", "Statistics", "A/B Testing"]
    },
    
    "machine_learning": {
        "name": "Machine Learning & AI",
        "description": "Build ML models, NLP, computer vision applications",
        "skills_required": ["Python", "Machine Learning", "TensorFlow/PyTorch", "Deep Learning", "Statistics"],
        "salary_range": "8-16 LPA",
        "roles": [
            {"title": "ML Engineer", "level": "junior", "avg_salary": "8-12 LPA"},
            {"title": "AI/ML Intern (grad role)", "level": "junior", "avg_salary": "7-11 LPA"},
            {"title": "NLP Engineer", "level": "junior", "avg_salary": "9-13 LPA"},
        ],
        "top_companies": ["Google", "Microsoft", "Amazon", "Apple", "DeepMind"],
        "gap_areas": ["Advanced Deep Learning", "NLP/CV", "Model Deployment", "Production ML"]
    },
    
    "devops_cloud": {
        "name": "DevOps & Cloud Engineering",
        "description": "Infrastructure, deployment, and cloud services management",
        "skills_required": ["Linux", "Docker", "Kubernetes", "AWS/GCP/Azure", "CI/CD", "Terraform"],
        "salary_range": "7-14 LPA",
        "roles": [
            {"title": "DevOps Engineer", "level": "junior", "avg_salary": "7-11 LPA"},
            {"title": "Cloud Engineer", "level": "junior", "avg_salary": "8-12 LPA"},
            {"title": "Infrastructure Engineer", "level": "junior", "avg_salary": "7-10 LPA"},
        ],
        "top_companies": ["Google Cloud", "AWS", "Microsoft Azure", "Netflix", "Uber"],
        "gap_areas": ["Kubernetes Advanced", "Infrastructure as Code", "Monitoring", "Security"]
    },
    
    "cybersecurity": {
        "name": "Cybersecurity",
        "description": "Security engineering, vulnerability assessment, ethical hacking",
        "skills_required": ["Networking", "Linux/Windows", "Penetration Testing", "Security Protocols", "Cryptography"],
        "salary_range": "7-15 LPA",
        "roles": [
            {"title": "Security Analyst", "level": "junior", "avg_salary": "6-9 LPA"},
            {"title": "Ethical Hacker", "level": "junior", "avg_salary": "7-11 LPA"},
            {"title": "Security Engineer", "level": "junior", "avg_salary": "8-12 LPA"},
        ],
        "top_companies": ["Google", "Microsoft", "Apple", "Cisco", "Accenture"],
        "gap_areas": ["CEH Certification", "Penetration Testing", "SIEM", "Incident Response"]
    }
}

# Interview Preparation Tips
INTERVIEW_PREP_TIPS = {
    "dsa": {
        "topic": "Data Structures & Algorithms",
        "importance": "Critical - Asked in almost all tech interviews",
        "tips": [
            "Master arrays, linked lists, trees, graphs, sorting, searching",
            "Practice 200+ problems on LeetCode (Medium level minimum)",
            "Understand time & space complexity analysis",
            "Practice explaining solutions clearly to the interviewer",
            "Study company-specific frequently asked questions"
        ],
        "timeline": "2-3 months",
        "resources": ["LeetCode", "GeeksforGeeks", "InterviewBit", "CodeSignal"]
    },
    
    "system_design": {
        "topic": "System Design",
        "importance": "Important for mid-level and senior roles",
        "tips": [
            "Learn about scalability, distributed systems, databases",
            "Design real systems: Twitter, Instagram, Google Search, etc.",
            "Understand CAP theorem, load balancing, caching",
            "Practice with real case studies",
            "Communicate design decisions clearly"
        ],
        "timeline": "1-2 months",
        "resources": ["System Design Interview", "DesignGurus", "YouTube channels"]
    },
    
    "behavioral": {
        "topic": "Behavioral & HR Round",
        "importance": "Important - Often decides between final candidates",
        "tips": [
            "Prepare STAR method answers (Situation, Task, Action, Result)",
            "Practice common questions: Tell me about yourself, challenges, failures",
            "Research the company thoroughly",
            "Prepare questions to ask the interviewer",
            "Mock interviews to build confidence"
        ],
        "timeline": "2-3 weeks",
        "resources": ["Blind", "HackerNews", "Company blogs", "Interview coaches"]
    },
    
    "coding_practice": {
        "topic": "Live Coding",
        "importance": "Critical - Test your coding skills under pressure",
        "tips": [
            "Code in the language you're most comfortable with",
            "Clarify requirements before coding",
            "Write clean, optimized code",
            "Test edge cases",
            "Communicate while coding"
        ],
        "timeline": "Ongoing",
        "resources": ["HackerRank", "CodeWars", "Mock interview platforms"]
    }
}

# Placement Roadmap Template (8 weeks)
PLACEMENT_ROADMAP = {
    "week_1_2": {
        "phase": "Foundation & Assessment",
        "focus": "Identify gaps, plan strategy",
        "tasks": [
            "Complete technical skill assessment",
            "Identify 2-3 target domains",
            "Set up GitHub profile with projects",
            "Join interview prep communities"
        ],
        "deliverables": ["GitHub profile active", "List of 5 target companies", "Study plan ready"]
    },
    
    "week_3_4": {
        "phase": "Core Skill Building",
        "focus": "Strengthen DSA and System Design",
        "tasks": [
            "Solve 50+ DSA problems",
            "Complete 2 system design case studies",
            "Improve resume",
            "Network with seniors"
        ],
        "deliverables": ["50+ DSA problems solved", "Resume v1 ready", "1 system design case study"]
    },
    
    "week_5_6": {
        "phase": "Deep Dive & Projects",
        "focus": "Build portfolio projects",
        "tasks": [
            "Solve 50+ more DSA problems",
            "Complete domain-specific project",
            "Behavioral question prep",
            "Mock interviews"
        ],
        "deliverables": ["1 GitHub project complete", "5 behavioral Q&A prepared", "1 mock interview done"]
    },
    
    "week_7_8": {
        "phase": "Final Polish & Applications",
        "focus": "Apply to companies and refine interview skills",
        "tasks": [
            "Apply to 20+ companies",
            "Continue mock interviews",
            "Solve recent interview questions",
            "Company-specific prep"
        ],
        "deliverables": ["20+ applications submitted", "3+ mock interviews completed", "Company-specific prep done"]
    }
}

# Progress Tracking Metrics
PROGRESS_METRICS = {
    "technical_score": {"weight": 0.3, "label": "Technical Skills"},
    "dsa_score": {"weight": 0.25, "label": "DSA & Problem-Solving"},
    "resume_score": {"weight": 0.15, "label": "Resume & Portfolio"},
    "communication_score": {"weight": 0.15, "label": "Communication"},
    "interview_score": {"weight": 0.15, "label": "Interview Readiness"}
}
