"""
COLLEGE ASSESSMENT ENGINE
Execution Phase: Skill Gap Analysis & Placement Readiness
Processes career readiness and job recommendations
"""

from app.data.college_questions import (
    JOB_PROFILES, SKILL_GAPS, PLACEMENT_READINESS, CAREER_PATHS
)


class CollegeAssessmentEngine:
    """Engine for College (Execution phase) assessments"""
    
    def __init__(self):
        self.job_profiles = JOB_PROFILES
        self.skill_gaps = SKILL_GAPS
        self.placement_readiness = PLACEMENT_READINESS
        self.career_paths = CAREER_PATHS
    
    def process_assessment(self, answers: dict, specialization: str):
        """
        Process College assessment answers
        
        Args:
            answers: User's answers to 12 questions
            specialization: User's specialization from Class 12
        
        Returns:
            {
                'job_recommendations': [...],
                'skill_gaps': {...},
                'placement_readiness': {...},
                'career_roadmap': [...],
                'resume_tips': str,
                'interview_prep': str,
                'personalized_advice': str
            }
        """
        
        # Extract answers
        internship_count = answers.get('internship_count', 0)
        skill_level = answers.get('skill_level', 2)
        target_companies = answers.get('target_companies', '')
        salary_expectation = answers.get('salary_expectation', '')
        portfolio_status = answers.get('portfolio_status', '')
        communication_level = answers.get('communication_level', 3)
        interview_confidence = answers.get('interview_confidence', 3)
        environment_pref = answers.get('environment_pref', '')
        network_strength = answers.get('network_strength', 2)
        higher_studies = answers.get('higher_studies', '')
        placement_timeline = answers.get('placement_timeline', '')
        
        # Get job recommendations
        job_recommendations = self._recommend_jobs(specialization, skill_level)
        
        # Analyze skill gaps
        skill_gaps = self._analyze_skill_gaps(
            skill_level,
            communication_level,
            internship_count,
            portfolio_status
        )
        
        # Assess placement readiness
        readiness = self._assess_placement_readiness(
            internship_count,
            skill_level,
            portfolio_status,
            communication_level,
            interview_confidence
        )
        
        # Create career roadmap
        career_roadmap = self._create_career_roadmap(job_recommendations, placement_timeline)
        
        # Generate resume tips
        resume_tips = self._generate_resume_tips(job_recommendations, specialization)
        
        # Generate interview prep
        interview_prep = self._generate_interview_prep(target_companies, specialization)
        
        # Generate advice
        advice = self._generate_advice(
            readiness,
            skill_gaps,
            job_recommendations,
            placement_timeline
        )
        
        return {
            'job_recommendations': job_recommendations,
            'skill_gaps': skill_gaps,
            'placement_readiness': readiness,
            'career_roadmap': career_roadmap,
            'resume_tips': resume_tips,
            'interview_prep': interview_prep,
            'personalized_advice': advice,
            'specialization': specialization
        }
    
    def _recommend_jobs(self, specialization: str, skill_level: int):
        """Recommend job profiles based on specialization"""
        
        # Map specialization to job profiles
        spec_map = {
            'CS': 'COMPUTER_SCIENCE',
            'COMPUTER_SCIENCE': 'COMPUTER_SCIENCE',
            'MECHANICAL': 'MECHANICAL',
            'ELECTRONICS': 'ELECTRONICS',
            'COMMERCE': 'COMMERCE',
            'MEDICINE': 'MEDICINE',
            'MBBS': 'MEDICINE'
        }
        
        profile_key = spec_map.get(specialization, 'COMPUTER_SCIENCE')
        
        # Get the roles list from job profiles
        profile_data = self.job_profiles.get(profile_key, self.job_profiles['COMPUTER_SCIENCE'])
        jobs = profile_data.get('roles', [])
        
        # Filter based on skill level
        if skill_level < 2:
            # Beginner - show entry level only
            jobs = jobs[:1]
        elif skill_level < 4:
            # Intermediate - show entry to mid level
            jobs = jobs[:3]
        # Advanced - show all
        
        return jobs
    
    def _analyze_skill_gaps(self, skill_level: int, comm_level: int, internships: int, portfolio: str):
        """Identify skill gaps"""
        
        gaps = {
            'technical': 'DEVELOPING' if skill_level < 3 else 'READY',
            'communication': 'DEVELOPING' if comm_level < 3 else 'READY',
            'domain_knowledge': 'DEVELOPING' if internships < 2 else 'READY',
            'portfolio': 'MISSING' if 'Not yet' in portfolio else 'PRESENT'
        }
        
        # Create development plan
        development_plan = []
        
        if gaps['technical'] != 'READY':
            development_plan.append({
                'area': 'Technical Skills',
                'focus': 'Learn latest technologies and frameworks',
                'duration': '3-6 months',
                'actions': ['Online courses', 'Practice problems', 'Build projects']
            })
        
        if gaps['communication'] != 'READY':
            development_plan.append({
                'area': 'Communication Skills',
                'focus': 'Improve presentation and speaking abilities',
                'duration': '2-3 months',
                'actions': ['Toastmasters', 'Presentation practice', 'Mock interviews']
            })
        
        if gaps['portfolio'] == 'MISSING':
            development_plan.append({
                'area': 'Portfolio Development',
                'focus': 'Build projects to showcase skills',
                'duration': '2-4 months',
                'actions': ['GitHub projects', 'Case studies', 'Blog posts']
            })
        
        return {
            'gaps': gaps,
            'development_plan': development_plan,
            'priority': self._prioritize_gaps(gaps)
        }
    
    def _assess_placement_readiness(self, internships: int, skill_level: int, 
                                   portfolio: str, comm_level: int, interview_conf: int):
        """Assess readiness for placement"""
        
        readiness_score = 0
        
        # Internship experience (0-30 points)
        readiness_score += min(30, internships * 10)
        
        # Skill level (0-25 points)
        readiness_score += (skill_level - 1) * 6.25
        
        # Portfolio (0-20 points)
        if 'Not yet' in portfolio:
            readiness_score += 0
        elif 'Started' in portfolio:
            readiness_score += 10
        else:
            readiness_score += 20
        
        # Communication (0-15 points)
        readiness_score += (comm_level - 1) * 3.75
        
        # Interview confidence (0-10 points)
        readiness_score += (interview_conf - 1) * 2.5
        
        # Determine readiness level
        if readiness_score >= 70:
            level = 'READY'
        elif readiness_score >= 50:
            level = 'DEVELOPING'
        else:
            level = 'NEEDS_WORK'
        
        return {
            'level': level,
            'score': round(readiness_score, 0),
            'status': self.placement_readiness[level]['description'],
            'recommendation': self.placement_readiness[level]['recommendation']
        }
    
    def _create_career_roadmap(self, jobs: list, timeline: str):
        """Create career roadmap"""
        
        roadmap = [
            {
                'phase': 'Phase 1: Pre-Placement (Current)',
                'duration': '2-3 months',
                'activities': [
                    'Polish resume and portfolio',
                    'Practice coding/interview questions',
                    'Network with seniors and recruiters',
                    'Apply to companies'
                ]
            },
            {
                'phase': 'Phase 2: Interview & Selection',
                'duration': '2-4 months',
                'activities': [
                    'Attend company recruitment drives',
                    'Clear written tests/coding rounds',
                    'Ace technical interviews',
                    'Negotiate offer'
                ]
            },
            {
                'phase': 'Phase 3: First Job (0-2 years)',
                'duration': '24 months',
                'activities': [
                    f'Start as {jobs[0]["title"] if jobs else "Professional"}',
                    'Learn company practices and tools',
                    'Build real-world experience',
                    'Prepare for career growth'
                ]
            },
            {
                'phase': 'Phase 4: Growth (2-5 years)',
                'duration': 'Long-term',
                'activities': [
                    'Specialize in your domain',
                    'Lead projects/teams',
                    'Build professional network',
                    'Plan career advancement'
                ]
            }
        ]
        
        return roadmap
    
    def _generate_resume_tips(self, jobs: list, specialization: str):
        """Generate resume improvement tips"""
        
        tips = f"""
📄 RESUME IMPROVEMENT TIPS:

1. OBJECTIVE/SUMMARY
   - Focus on: {jobs[0]['title'] if jobs else 'Your target role'}
   - Highlight relevant skills for placement

2. PROJECTS TO SHOWCASE
   - Include 2-3 impactful projects
   - Quantify results (lines of code, performance improvement, etc.)
   - Add GitHub links

3. SKILLS SECTION
   - Technical: {', '.join(jobs[0]['skills'][:2]) if jobs and jobs[0].get('skills') else 'Programming languages, frameworks'}
   - Soft Skills: Communication, Teamwork, Problem-solving

4. EXPERIENCE
   - Internships/projects with measurable impact
   - Start with action verbs (Developed, Designed, Implemented)
   - Use metrics (10% faster, 50% better, etc.)

5. EDUCATION
   - Your degree and specialization: {specialization}
   - Relevant coursework and projects
   - Certifications and achievements

6. DON'Ts
   - Don't include irrelevant information
   - Avoid grammar and spelling errors
   - Keep it to 1 page (max 2 for experienced)
"""
        return tips
    
    def _generate_interview_prep(self, target_companies: str, specialization: str):
        """Generate interview preparation guide"""
        
        prep = f"""
🎯 INTERVIEW PREPARATION GUIDE:

1. TECHNICAL ROUND
   - Data Structures & Algorithms
   - System Design (for senior roles)
   - Projects and portfolio discussion
   - Hands-on coding problems

2. HR ROUND
   - Tell me about yourself
   - Why this company?
   - Strengths and weaknesses
   - Salary expectations and negotiation

3. PRACTICE
   - LeetCode/HackerRank problems
   - Mock interviews with seniors
   - Company-specific questions
   - Behavioral scenarios (STAR method)

4. PREPARATION TIMELINE
   - Week 1-2: Core concepts
   - Week 3-4: Practice problems
   - Week 5-6: Mock interviews
   - Week 7: Final preparation

5. ON THE DAY
   - Arrive 15 minutes early
   - Dress professionally
   - Research the company thoroughly
   - Have questions ready for interviewer
"""
        return prep
    
    def _prioritize_gaps(self, gaps: dict):
        """Prioritize which gaps to fix first"""
        
        priority = []
        
        if gaps.get('portfolio') == 'MISSING':
            priority.append('Build portfolio (critical)')
        
        if gaps.get('technical') != 'READY':
            priority.append('Improve technical skills')
        
        if gaps.get('communication') != 'READY':
            priority.append('Enhance communication')
        
        return priority if priority else ['You\'re on track! Keep improving!']
    
    def _generate_advice(self, readiness: dict, gaps: dict, jobs: list, timeline: str):
        """Generate personalized advice"""
        
        advice = f"""
💡 PERSONALIZED PLACEMENT ADVICE:

📊 YOUR READINESS: {readiness['level']} ({readiness['score']:.0f}/100)

📋 RECOMMENDATION: {readiness['recommendation']}

🎯 TOP OPPORTUNITIES:
"""
        
        for i, job in enumerate(jobs[:2], 1):
            advice += f"\n{i}. {job['title']}"
            advice += f"\n   Salary: {job['avg_salary']}"
            advice += f"\n   Companies: {', '.join(job['companies'][:2])}"
        
        advice += f"\n\n⏱️ TIMELINE: Start placement drive in {timeline.lower()}"
        
        advice += f"\n\n🔧 PRIORITY ACTIONS:"
        for priority in gaps['priority'][:3]:
            advice += f"\n   • {priority}"
        
        advice += "\n\n✅ Good luck with your placements!"
        
        return advice
    
    def _prioritize_gaps(self, gaps: dict):
        """Prioritize which gaps to fix first"""
        
        priority = []
        
        if gaps.get('portfolio') == 'MISSING':
            priority.append('Build portfolio (critical)')
        
        if gaps.get('technical') != 'READY':
            priority.append('Improve technical skills')
        
        if gaps.get('communication') != 'READY':
            priority.append('Enhance communication')
        
        return priority if priority else ['You\'re on track! Keep improving!']
