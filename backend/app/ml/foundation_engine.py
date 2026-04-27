"""
YEAR 1-2 (FOUNDATION MODE) ENGINE
Foundation building and domain exploration
"""

from app.data.foundation_questions import (
    FOUNDATION_DOMAINS, FOUNDATION_ROADMAP, FOUNDATION_LEVELS
)

class FoundationEngine:
    """Engine for Year 1-2 foundation mode"""
    
    def __init__(self, assessment_data):
        self.data = assessment_data
    
    def calculate_foundation_score(self):
        """Calculate foundation readiness score (0-100)"""
        foundation_knowledge = self.data.get("foundation_knowledge", 3) * 12  # 1-5 scale
        projects_done = {"No": 0, "1 course/project": 15, "2-3 courses/projects": 40, "4+ courses/projects": 60}.get(
            self.data.get("projects_done", "No"), 0
        )
        
        learning_capacity = self.data.get("learning_time", "5-10 hours") 
        time_score = {"5-10 hours": 20, "10-15 hours": 40, "15-20 hours": 60, "20+ hours": 80}.get(learning_capacity, 20)
        
        self_discipline = self.data.get("self_discipline", 3) * 10  # 1-5 scale
        
        score = (foundation_knowledge * 0.25 + projects_done * 0.25 + time_score * 0.25 + self_discipline * 0.25)
        return min(100, max(0, int(score)))
    
    def recommend_domains(self):
        """Recommend learning domains"""
        interests = self.data.get("interests", [])
        recommendations = []
        
        for domain_key, domain_data in FOUNDATION_DOMAINS.items():
            if domain_data["name"] in interests or len(interests) == 0:
                recommendations.append({
                    "domain": domain_data["name"],
                    "description": domain_data["description"],
                    "duration_months": domain_data["duration_months"],
                    "courses": domain_data["courses"],
                    "projects": domain_data["projects"],
                    "resources": domain_data["resources"]
                })
        
        return recommendations[:3]
    
    def get_foundation_level(self):
        """Get foundation learning level"""
        score = self.calculate_foundation_score()
        
        if score >= 70:
            level_key = "ready_to_explore"
        elif score >= 40:
            level_key = "needs_basics"
        else:
            level_key = "getting_started"
        
        level_data = FOUNDATION_LEVELS[level_key]
        return {
            "score": score,
            "level": level_key,
            "status": level_data["status"],
            "focus_areas": level_data["focus"]
        }
    
    def create_learning_roadmap(self):
        """Create 6-month learning roadmap"""
        return {
            "duration": "6 months (Year 1-2)",
            "phases": FOUNDATION_ROADMAP,
            "key_milestones": [
                {"month": 1, "milestone": "Complete programming basics"},
                {"month": 3, "milestone": "First small projects done"},
                {"month": 4, "milestone": "Choose domain to specialize"},
                {"month": 6, "milestone": "GitHub profile with projects"}
            ]
        }
    
    def generate_learning_plan(self):
        """Generate personalized learning plan"""
        learning_style = self.data.get("learning_style", "Mix of everything")
        learning_time = self.data.get("learning_time", "10-15 hours")
        
        weekly_schedule = {
            "5-10 hours": ["5h theory", "2-5h projects"],
            "10-15 hours": ["5h theory", "5-10h projects"],
            "15-20 hours": ["7h theory", "8-13h projects"],
            "20+ hours": ["8h theory", "12h+ projects"]
        }.get(learning_time, ["5h theory", "5h projects"])
        
        return {
            "learning_style": learning_style,
            "weekly_commitment": learning_time,
            "weekly_schedule": weekly_schedule,
            "recommended_platforms": self._get_platforms(learning_style),
            "practice_approach": [
                "Complete structured courses",
                "Build 1-2 small projects per month",
                "Join coding communities",
                "Do daily coding practice"
            ]
        }
    
    def _get_platforms(self, learning_style):
        """Get recommended platforms based on learning style"""
        platforms = {
            "Hands-on projects": ["Codecademy", "FreeCodeCamp", "Coursera"],
            "Structured courses": ["Coursera", "Udemy", "edX"],
            "Research & reading": ["Documentations", "Research Papers", "Blogs"],
            "Collaborative learning": ["GitHub", "Discord communities", "Study groups"],
            "Mix of everything": ["Codecademy", "Udemy", "GitHub", "Communities"]
        }
        
        return platforms.get(learning_style, ["Codecademy", "Udemy", "GitHub"])
    
    def get_next_steps(self):
        """Get personalized next steps"""
        score = self.calculate_foundation_score()
        
        if score >= 70:
            return [
                "1. Explore 2-3 domains that interest you",
                "2. Enroll in specialized courses",
                "3. Start building portfolio projects",
                "4. Join tech communities"
            ]
        elif score >= 40:
            return [
                "1. Complete one foundational course",
                "2. Practice daily coding (30min-1hr)",
                "3. Build 2-3 small projects",
                "4. Set up GitHub and share your work"
            ]
        else:
            return [
                "1. Start with free coding basics course",
                "2. Choose 1 programming language",
                "3. Practice consistently (daily)",
                "4. Build first project in 2-3 weeks"
            ]
    
    def generate_full_assessment(self):
        """Generate complete foundation assessment"""
        return {
            "foundation_score": self.calculate_foundation_score(),
            "foundation_level": self.get_foundation_level(),
            "recommended_domains": self.recommend_domains(),
            "learning_roadmap": self.create_learning_roadmap(),
            "learning_plan": self.generate_learning_plan(),
            "next_steps": self.get_next_steps(),
            "encouragement": "You're at the beginning of an amazing journey! Focus on fundamentals and consistency."
        }
