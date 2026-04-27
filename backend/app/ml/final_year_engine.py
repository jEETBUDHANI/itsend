"""
FINAL YEAR (PLACEMENT MODE) ENGINE
Comprehensive job matching, skill gap analysis, and placement roadmap
"""

from app.data.final_year_questions import (
    JOB_SPECIALIZATIONS, INTERVIEW_PREP_TIPS, PLACEMENT_ROADMAP, PROGRESS_METRICS
)

class FinalYearPlacementEngine:
    """Engine for Final Year placement mode assessment and recommendations"""
    
    def __init__(self, assessment_data):
        self.data = assessment_data
        self.score = 0
        
    def calculate_placement_readiness(self):
        """Calculate overall placement readiness (0-100)"""
        # Factors: internships, communication, technical skill, project experience
        internships = {"None": 0, "1": 20, "2": 40, "3+": 60}.get(self.data.get("internships", "None"), 0)
        communication = self.data.get("communication_skill", 3) * 10  # 1-5 scale -> 0-50
        technical = self.data.get("technical_level", 3) * 10  # 1-5 scale -> 0-50
        projects = {"0-2 projects": 15, "3-5 projects": 35, "6-10 projects": 55, "10+ projects": 75}.get(
            self.data.get("projects_count", "0-2 projects"), 15
        )
        
        readiness_score = (internships * 0.2 + communication * 0.2 + technical * 0.3 + projects * 0.3)
        return min(100, max(0, int(readiness_score)))
    
    def recommend_job_roles(self):
        """Recommend suitable job roles based on interests and skills"""
        interested_domains = self.data.get("interested_domains", [])
        tech_level = self.data.get("technical_level", 3)
        
        recommendations = []
        
        for domain_key, domain_data in JOB_SPECIALIZATIONS.items():
            # Check if user is interested in this domain
            if domain_data["name"] in interested_domains or len(interested_domains) == 0:
                # Calculate fit score based on technical level and experience
                fit_score = self._calculate_domain_fit(domain_key, tech_level)
                
                recommendations.append({
                    "domain": domain_data["name"],
                    "description": domain_data["description"],
                    "fit_score": fit_score,
                    "recommended_roles": domain_data["roles"][:2],  # Top 2 roles
                    "top_companies": domain_data["top_companies"][:5],
                    "salary_range": domain_data["salary_range"],
                    "skills_required": domain_data["skills_required"],
                    "gap_areas": domain_data["gap_areas"]
                })
        
        # Sort by fit score
        recommendations.sort(key=lambda x: x["fit_score"], reverse=True)
        return recommendations[:3]  # Top 3 recommendations
    
    def _calculate_domain_fit(self, domain_key, tech_level):
        """Calculate fit score for a specific domain (0-100)"""
        programming_langs = self.data.get("programming_languages", [])
        
        # Base score from technical level
        fit_score = tech_level * 15
        
        # Boost based on relevant languages
        relevant_langs = {
            "web_dev": ["JavaScript", "Python", "Java"],
            "mobile_dev": ["Java", "Kotlin", "Swift"],
            "data_science": ["Python", "R"],
            "machine_learning": ["Python"],
            "devops_cloud": ["Python", "Go", "Bash"],
            "cybersecurity": ["Python", "C"]
        }
        
        if domain_key in relevant_langs:
            for lang in programming_langs:
                if lang in relevant_langs[domain_key]:
                    fit_score += 15
        
        return min(100, max(0, fit_score))
    
    def analyze_skill_gaps(self):
        """Analyze technical and soft skill gaps"""
        tech_level = self.data.get("technical_level", 3)
        dsa_level = self.data.get("dsa_level", 3)
        system_design = self.data.get("system_design", 2)
        communication = self.data.get("communication_skill", 3)
        
        gaps = {
            "critical": [],
            "important": [],
            "nice_to_have": []
        }
        
        # DSA gaps
        if dsa_level < 4:
            gaps["critical"].append({
                "skill": "Data Structures & Algorithms",
                "current_level": dsa_level,
                "target_level": 4,
                "importance": "CRITICAL - Asked in 90% of interviews",
                "resources": ["LeetCode", "GeeksforGeeks", "InterviewBit"]
            })
        
        # System Design gaps
        if system_design < 3:
            gaps["important"].append({
                "skill": "System Design",
                "current_level": system_design,
                "target_level": 3,
                "importance": "Important for mid-level roles",
                "resources": ["DesignGurus", "System Design Interview YouTube"]
            })
        
        # Communication gaps
        if communication < 4:
            gaps["important"].append({
                "skill": "Communication & Presentation",
                "current_level": communication,
                "target_level": 4,
                "importance": "Critical for interview success",
                "resources": ["Toastmasters", "Mock interviews", "Soft skills courses"]
            })
        
        # Technical depth
        if tech_level < 4:
            gaps["important"].append({
                "skill": "Domain-Specific Technical Skills",
                "current_level": tech_level,
                "target_level": 4,
                "importance": "Needed for domain specialization",
                "resources": ["Udemy", "Coursera", "Official documentation"]
            })
        
        return gaps
    
    def generate_interview_prep_plan(self):
        """Generate personalized interview preparation plan"""
        dsa_level = self.data.get("dsa_level", 3)
        interviews_done = {"None": 0, "1-2": 1, "3-5": 3, "5+": 5}.get(
            self.data.get("interviews_done", "None"), 0
        )
        
        plan = {
            "current_interview_experience": interviews_done,
            "preparation_modules": [],
            "estimated_prep_time": "6-8 weeks",
            "success_strategies": []
        }
        
        # Add modules based on level
        if dsa_level < 3:
            plan["preparation_modules"].append({
                "module": "DSA Fundamentals",
                "duration": "3-4 weeks",
                "focus": "Arrays, LinkedLists, Trees, Sorting",
                "resource": "LeetCode (Easy & Medium)",
                "priority": "CRITICAL"
            })
        
        if interviews_done < 3:
            plan["preparation_modules"].append({
                "module": "Mock Interviews",
                "duration": "4 weeks (2-3 per week)",
                "focus": "Practice under pressure",
                "resource": ["Pramp", "MockInterview.co", "Peers"],
                "priority": "CRITICAL"
            })
        
        plan["preparation_modules"].extend([
            {
                "module": "Behavioral Questions",
                "duration": "1-2 weeks",
                "focus": "STAR method, Company research",
                "resource": "Blind, Company blogs",
                "priority": "IMPORTANT"
            },
            {
                "module": "System Design (if targeting senior/mid roles)",
                "duration": "2-3 weeks",
                "focus": "Scale, distribute, design patterns",
                "resource": "DesignGurus, YouTube",
                "priority": "IMPORTANT"
            }
        ])
        
        # Success strategies
        plan["success_strategies"] = [
            "Start with easy problems, gradually increase difficulty",
            "Give 2-3 mock interviews before real interviews",
            "Research company and interviewer before each round",
            "Practice explaining solutions clearly",
            "Build 2-3 strong projects to showcase",
            "Network with seniors and alumni for referrals"
        ]
        
        return plan
    
    def create_placement_roadmap(self):
        """Create week-by-week placement roadmap"""
        readiness = self.calculate_placement_readiness()
        
        roadmap = {
            "current_readiness": readiness,
            "readiness_level": "High" if readiness > 70 else "Medium" if readiness > 50 else "Low",
            "target_readiness": 85,
            "timeline": PLACEMENT_ROADMAP,
            "key_milestones": [
                {"week": 2, "milestone": "Skill gaps identified, study plan ready"},
                {"week": 4, "milestone": "GitHub profile polished, 50+ DSA problems done"},
                {"week": 6, "milestone": "1-2 projects completed, resume finalized"},
                {"week": 8, "milestone": "20+ applications submitted, ready for interviews"}
            ]
        }
        
        return roadmap
    
    def create_progress_tracker(self):
        """Create progress tracking framework"""
        return {
            "metrics": PROGRESS_METRICS,
            "scoring_system": "Each metric scored 0-100",
            "overall_score": "Weighted average of all metrics",
            "tracking_frequency": "Weekly",
            "success_criteria": {
                "placement_readiness": "> 80%",
                "technical_score": "> 75%",
                "interview_readiness": "> 80%",
                "application_success_rate": "> 10% (for 20+ applications)"
            },
            "weekly_check_points": [
                "DSA problems solved",
                "Projects completed",
                "Mock interviews done",
                "Companies applied to",
                "Interview offers received"
            ]
        }
    
    def generate_full_assessment(self):
        """Generate complete placement assessment"""
        return {
            "placement_readiness_score": self.calculate_placement_readiness(),
            "readiness_level": self._get_readiness_level(),
            "job_recommendations": self.recommend_job_roles(),
            "skill_gaps": self.analyze_skill_gaps(),
            "interview_prep_plan": self.generate_interview_prep_plan(),
            "placement_roadmap": self.create_placement_roadmap(),
            "progress_tracker": self.create_progress_tracker(),
            "next_steps": self._get_next_steps()
        }
    
    def _get_readiness_level(self):
        """Get readiness level description"""
        score = self.calculate_placement_readiness()
        if score >= 80:
            return "Excellent - Ready for interviews at top companies!"
        elif score >= 60:
            return "Good - Focus on strengthening weak areas"
        elif score >= 40:
            return "Moderate - Significant preparation needed"
        else:
            return "Basic - Start with fundamentals"
    
    def _get_next_steps(self):
        """Get personalized next steps"""
        readiness = self.calculate_placement_readiness()
        
        if readiness < 40:
            return [
                "1. Build a GitHub profile with 2-3 projects",
                "2. Complete LeetCode's learning path (150 problems)",
                "3. Take a course on DSA and system design",
                "4. Get feedback on resume from mentors"
            ]
        elif readiness < 60:
            return [
                "1. Solve 200+ DSA problems on LeetCode",
                "2. Do 5+ mock interviews",
                "3. Complete 1-2 domain-specific projects",
                "4. Start applying to companies"
            ]
        else:
            return [
                "1. Focus on company-specific interview questions",
                "2. Deep dive into system design",
                "3. Apply to 20+ companies simultaneously",
                "4. Prepare behavioral answers in STAR format"
            ]
