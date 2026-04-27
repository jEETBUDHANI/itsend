"""
YEAR 3 (INTERNSHIP MODE) ENGINE
Internship readiness assessment and preparation planning
"""

from app.data.year3_internship_questions import (
    INTERNSHIP_SPECIALIZATIONS, READINESS_LEVELS, INTERNSHIP_ROADMAP
)

class Year3InternshipEngine:
    """Engine for Year 3 internship mode assessment"""
    
    def __init__(self, assessment_data):
        self.data = assessment_data
    
    def calculate_internship_readiness(self):
        """Calculate internship readiness score (0-100)"""
        projects = {"0 projects": 10, "1-2 projects": 30, "3-5 projects": 60, "5+ projects": 85}.get(
            self.data.get("projects_count", "0 projects"), 10
        )
        
        portfolio = {"Yes, well-maintained": 20, "Yes, basic": 12, "No, but have projects": 5, "No": 0}.get(
            self.data.get("portfolio", "No"), 0
        )
        
        technical = self.data.get("technical_depth", 3) * 10  # 1-5 scale
        problem_solving = self.data.get("problem_solving", 3) * 5  # 1-5 scale
        internships_done = {"No": 10, "1 internship": 25, "2-3 internships": 50, "4+ internships": 70}.get(
            self.data.get("previous_internships", "No"), 10
        )
        
        readiness = (projects * 0.25 + portfolio * 0.15 + technical * 0.25 + problem_solving * 0.15 + internships_done * 0.2)
        return min(100, max(0, int(readiness)))
    
    def get_readiness_level(self):
        """Get readiness level with recommendations"""
        score = self.calculate_internship_readiness()
        
        if score >= 70:
            level_key = "ready"
        elif score >= 50:
            level_key = "medium"
        else:
            level_key = "beginner"
        
        level_data = READINESS_LEVELS[level_key]
        return {
            "score": score,
            "level": level_key,
            "status": level_data["status"],
            "message": level_data["message"],
            "focus_areas": level_data["focus"]
        }
    
    def recommend_internship_roles(self):
        """Recommend internship roles based on interests and skills"""
        interested_domains = self.data.get("interested_domains", [])
        technical_depth = self.data.get("technical_depth", 3)
        
        recommendations = []
        
        for domain_key, domain_data in INTERNSHIP_SPECIALIZATIONS.items():
            if domain_data["name"] in interested_domains or len(interested_domains) == 0:
                fit_score = self._calculate_domain_fit(domain_key, technical_depth)
                
                recommendations.append({
                    "domain": domain_data["name"],
                    "description": domain_data["description"],
                    "fit_score": fit_score,
                    "roles": domain_data["typical_roles"],
                    "companies": domain_data["companies"][:5],
                    "stipend_range": domain_data["stipend_range"],
                    "duration_months": domain_data["duration_months"],
                    "skills_needed": domain_data["skills_needed"]
                })
        
        recommendations.sort(key=lambda x: x["fit_score"], reverse=True)
        return recommendations[:3]
    
    def _calculate_domain_fit(self, domain_key, technical_depth):
        """Calculate domain fit score"""
        base_score = technical_depth * 15
        technologies = self.data.get("technologies", [])
        
        tech_mapping = {
            "web_dev": ["Frontend", "Backend", "Databases"],
            "mobile_dev": ["Mobile Development"],
            "data_science": ["Data Science"],
            "devops": ["DevOps", "Cloud"]
        }
        
        if domain_key in tech_mapping:
            for tech in technologies:
                if any(t in tech for t in tech_mapping[domain_key]):
                    base_score += 20
        
        return min(100, max(0, base_score))
    
    def analyze_skill_gaps(self):
        """Analyze internship skill gaps"""
        technical_depth = self.data.get("technical_depth", 3)
        projects_count = self.data.get("projects_count", "0 projects")
        portfolio_status = self.data.get("portfolio", "No")
        
        gaps = {
            "critical": [],
            "important": [],
            "nice_to_have": []
        }
        
        # Project gap
        if "0" in projects_count or "1-2" in projects_count:
            gaps["critical"].append({
                "skill": "Hands-on Projects",
                "current": "Weak",
                "target": "3-5 projects",
                "importance": "Build 2-3 real projects to showcase",
                "timeline": "4-6 weeks"
            })
        
        # Portfolio gap
        if portfolio_status == "No":
            gaps["critical"].append({
                "skill": "Portfolio & GitHub",
                "current": "Missing",
                "target": "Well-maintained GitHub",
                "importance": "99% of internships require GitHub",
                "timeline": "1-2 weeks"
            })
        
        # Technical depth
        if technical_depth < 3:
            gaps["important"].append({
                "skill": "Technical Depth",
                "current": f"Level {technical_depth}",
                "target": "Level 4+",
                "importance": "Learn advanced concepts in your domain",
                "timeline": "3-4 weeks"
            })
        
        # DSA basics
        gaps["important"].append({
            "skill": "Basic DSA & Problem Solving",
            "current": "Unknown",
            "target": "Solve 50+ problems",
            "importance": "Most internships have coding rounds",
            "timeline": "4-6 weeks"
        })
        
        return gaps
    
    def create_internship_roadmap(self):
        """Create 6-week internship preparation roadmap"""
        readiness = self.calculate_internship_readiness()
        level = self.get_readiness_level()
        
        roadmap = {
            "readiness_score": readiness,
            "readiness_level": level["level"],
            "timeline": "6 weeks",
            "phases": INTERNSHIP_ROADMAP,
            "milestones": [
                {"week": 1, "milestone": "Target roles identified, skills assessed"},
                {"week": 3, "milestone": "1 project completed, portfolio started"},
                {"week": 4, "milestone": "GitHub profile polished, resume updated"},
                {"week": 6, "milestone": "15+ applications sent, interviews scheduled"}
            ]
        }
        
        return roadmap
    
    def get_application_strategy(self):
        """Get company application strategy"""
        readiness = self.calculate_internship_readiness()
        
        if readiness >= 70:
            target_companies = {
                "tier": "Top companies (Google, Amazon, Microsoft, Flipkart)",
                "apply_count": "20-30",
                "success_rate": "5-10%",
                "strategy": "Apply directly + network + referrals"
            }
        elif readiness >= 50:
            target_companies = {
                "tier": "Mid-size companies + good startups",
                "apply_count": "20-25",
                "success_rate": "15-20%",
                "strategy": "Apply directly + referrals + online portals"
            }
        else:
            target_companies = {
                "tier": "Startups + learning internships",
                "apply_count": "15-20",
                "success_rate": "20-30%",
                "strategy": "Focus on learning, build 2 more projects first"
            }
        
        return target_companies
    
    def generate_interview_prep(self):
        """Generate interview preparation guide"""
        return {
            "rounds": [
                {
                    "round": "Online Assessment / Coding Round",
                    "focus": "DSA, basic problem-solving",
                    "prep_time": "2-3 weeks",
                    "resources": ["LeetCode (Easy-Medium)", "HackerRank"]
                },
                {
                    "round": "Technical Interview",
                    "focus": "Domain knowledge, project experience",
                    "prep_time": "1-2 weeks",
                    "resources": ["Domain tutorials", "Your projects", "Mock interviews"]
                },
                {
                    "round": "HR / Behavioral Round",
                    "focus": "Motivation, communication, culture fit",
                    "prep_time": "1 week",
                    "resources": ["STAR method", "Company research"]
                }
            ],
            "practice_tips": [
                "Solve 50+ LeetCode problems minimum",
                "Do 3-5 mock interviews",
                "Practice explaining your projects",
                "Research companies thoroughly",
                "Prepare 'tell me about yourself' pitch"
            ]
        }
    
    def generate_full_assessment(self):
        """Generate complete internship assessment"""
        return {
            "readiness_score": self.calculate_internship_readiness(),
            "readiness_level": self.get_readiness_level(),
            "internship_recommendations": self.recommend_internship_roles(),
            "skill_gaps": self.analyze_skill_gaps(),
            "internship_roadmap": self.create_internship_roadmap(),
            "application_strategy": self.get_application_strategy(),
            "interview_prep": self.generate_interview_prep(),
            "next_steps": self._get_next_steps()
        }
    
    def _get_next_steps(self):
        """Get personalized next steps"""
        readiness = self.calculate_internship_readiness()
        
        if readiness < 40:
            return [
                "1. Complete 2-3 mini projects in your domain",
                "2. Set up a GitHub profile and add projects",
                "3. Solve 30+ coding problems on LeetCode",
                "4. Get feedback on your resume"
            ]
        elif readiness < 60:
            return [
                "1. Complete 1-2 more projects",
                "2. Polish your portfolio and GitHub",
                "3. Solve 50+ coding problems",
                "4. Start applying to internships"
            ]
        else:
            return [
                "1. Fine-tune your applications for specific companies",
                "2. Do mock interviews with seniors",
                "3. Prepare domain-specific questions",
                "4. Apply to 20+ companies immediately"
            ]
