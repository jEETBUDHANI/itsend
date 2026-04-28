"""
Class 10 Assessment Flow - Complete End-to-End Test
Tests: Layer 1 → Layer 2 → Final Results
"""
import requests
import json
from pprint import pprint

BASE_URL = "http://localhost:5000/api"

# Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
BLUE = '\033[94m'
YELLOW = '\033[93m'
RESET = '\033[0m'

class Class10Tester:
    def __init__(self):
        self.token = None
        self.base_questions = None
        self.stream_prediction = None
        self.layer2_questions = None
        self.final_result = None
    
    def print_header(self, text):
        print(f"\n{BLUE}{'='*70}")
        print(f"  {text}")
        print(f"{'='*70}{RESET}\n")
    
    def print_success(self, text):
        print(f"{GREEN}✅ {text}{RESET}")
    
    def print_error(self, text):
        print(f"{RED}❌ {text}{RESET}")
    
    def print_info(self, text):
        print(f"{YELLOW}ℹ️  {text}{RESET}")
    
    # ===== STEP 0: Signup & Login =====
    
    def test_signup(self):
        """Create test user account"""
        self.print_header("STEP 0: Signup & Get JWT Token")
        
        import random
        test_email = f"class10test{random.randint(1000, 9999)}@example.com"
        
        payload = {
            "email": test_email,
            "password": "Test@123456",
            "full_name": "Class 10 Tester"
        }
        
        try:
            response = requests.post(f"{BASE_URL}/auth/signup", json=payload)
            
            if response.status_code == 201:
                data = response.json()
                self.token = data.get('access_token')
                user_id = data.get('user', {}).get('id')
                
                self.print_success(f"User created successfully")
                self.print_info(f"User ID: {user_id}")
                self.print_info(f"Email: {test_email}")
                self.print_info(f"Token: {self.token[:30]}..." if self.token else "No token in response")
                return True
            else:
                self.print_error(f"Signup failed: {response.status_code}")
                self.print_info(f"Response: {response.text}")
                return False
                
        except Exception as e:
            self.print_error(f"Signup error: {str(e)}")
            return False
    
    # ===== STEP 1: Get Base Questions =====
    
    def test_get_base_questions(self):
        """Get Layer 1 base assessment questions"""
        self.print_header("STEP 1: Get Base Assessment Questions (Layer 1)")
        
        if not self.token:
            self.print_error("No token available. Run signup first.")
            return False
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        try:
            response = requests.get(
                f"{BASE_URL}/class10/questions/base",
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                self.base_questions = data.get('questions', [])
                
                self.print_success(f"Base questions loaded successfully")
                self.print_info(f"Total questions: {len(self.base_questions)}")
                self.print_info(f"Message: {data.get('message')}")
                
                # Show first 3 questions as sample
                print(f"\n{YELLOW}Sample Questions:{RESET}")
                for i, q in enumerate(self.base_questions[:3], 1):
                    print(f"\n  Q{i}: {q.get('text', 'N/A')}")
                    print(f"     Type: {q.get('type', 'N/A')}")
                    print(f"     Category: {q.get('category', 'N/A')}")
                
                return True
            else:
                self.print_error(f"Failed to get questions: {response.status_code}")
                self.print_info(f"Response: {response.text}")
                return False
                
        except Exception as e:
            self.print_error(f"Error: {str(e)}")
            return False
    
    # ===== STEP 2: Submit Base Assessment =====
    
    def test_submit_base_assessment(self):
        """Submit Layer 1 base assessment"""
        self.print_header("STEP 2: Submit Base Assessment (Layer 1)")
        
        if not self.token or not self.base_questions:
            self.print_error("Prerequisites not met. Run previous tests first.")
            return False
        
        # Create sample answers
        answers = {
            "1": ["Physics", "Chemistry", "Mathematics"],  # Subjects (Science)
            "2": ["Solving problems", "Experiments"],       # Activities
            "3": "Problem-solving",                         # Strength
            "4": ["Engineering", "Technology/IT"],          # Career interests
            "5": "Through experiments and hands-on",        # Learning style
            "6": 4,  # Openness (scale 1-5)
            "7": 4,  # Conscientiousness
            "8": 3,  # Extraversion
            "9": 3,  # Agreeableness
            "10": 2, # Neuroticism (reversed)
            "11": 4, # Realistic (RIASEC)
            "12": 4, # Investigative
            "13": 2, # Social
            "14": 2, # Artistic
        }
        
        headers = {"Authorization": f"Bearer {self.token}"}
        payload = {"answers": answers}
        
        try:
            response = requests.post(
                f"{BASE_URL}/class10/submit/base",
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                self.stream_prediction = data
                
                self.print_success(f"Base assessment submitted successfully")
                self.print_info(f"Message: {data.get('message')}")
                
                print(f"\n{YELLOW}Stream Prediction Results:{RESET}")
                print(f"  Stream: {data.get('stream_prediction', 'N/A')}")
                print(f"  Confidence: {data.get('stream_confidence', 'N/A')}%")
                print(f"  Specialization: {data.get('predicted_specialization', 'N/A')}")
                
                print(f"\n{YELLOW}Stream Scores:{RESET}")
                scores = data.get('stream_scores', {})
                for stream, score in scores.items():
                    bar = "█" * int(score / 10)
                    print(f"  {stream.capitalize():10s}: {bar} {score}%")
                
                print(f"\n{YELLOW}Career Matches:{RESET}")
                careers = data.get('career_matches', [])
                for career in careers:
                    print(f"  • {career}")
                
                return True
            else:
                self.print_error(f"Failed to submit: {response.status_code}")
                self.print_info(f"Response: {response.text}")
                return False
                
        except Exception as e:
            self.print_error(f"Error: {str(e)}")
            return False
    
    # ===== STEP 3: Get Layer 2 Questions =====
    
    def test_get_layer2_questions(self):
        """Get stream-specific Layer 2 questions"""
        self.print_header("STEP 3: Get Layer 2 Stream-Specific Questions")
        
        if not self.token or not self.stream_prediction:
            self.print_error("Prerequisites not met. Run previous tests first.")
            return False
        
        stream = self.stream_prediction.get('stream_prediction', 'science')
        headers = {"Authorization": f"Bearer {self.token}"}
        payload = {"stream": stream}
        
        try:
            response = requests.post(
                f"{BASE_URL}/class10/questions/layer2",
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                self.layer2_questions = data.get('questions', [])
                
                self.print_success(f"Layer 2 questions loaded for {stream.upper()}")
                self.print_info(f"Total questions: {len(self.layer2_questions)}")
                
                print(f"\n{YELLOW}Layer 2 Questions for {stream.upper()}:{RESET}")
                for i, q in enumerate(self.layer2_questions, 1):
                    print(f"\n  Q{i}: {q.get('text', 'N/A')}")
                    print(f"      Category: {q.get('category', 'N/A')}")
                    print(f"      Weight: {q.get('weight', 'N/A')}")
                
                return True
            else:
                self.print_error(f"Failed to get Layer 2 questions: {response.status_code}")
                self.print_info(f"Response: {response.text}")
                return False
                
        except Exception as e:
            self.print_error(f"Error: {str(e)}")
            return False
    
    # ===== STEP 4: Submit Layer 2 Assessment =====
    
    def test_submit_layer2_assessment(self):
        """Submit Layer 2 stream-specific assessment"""
        self.print_header("STEP 4: Submit Layer 2 Assessment (Final)")
        
        if not self.token or not self.stream_prediction or not self.layer2_questions:
            self.print_error("Prerequisites not met. Run previous tests first.")
            return False
        
        stream = self.stream_prediction.get('stream_prediction', 'science')
        specialization = self.stream_prediction.get('predicted_specialization', 'PCM')
        
        # Create sample Layer 2 answers based on stream
        layer2_answers = {}
        if stream == "science":
            layer2_answers = {
                "101": "PCM (Physics, Chemistry, Math)",  # Specialization
                "102": 4,  # Math skills
                "103": 4,  # Lab skills
                "104": "Engineering entrance exams (JEE/NIT)",  # Future plan
                "105": "Mixed"  # Study style
            }
        elif stream == "commerce":
            layer2_answers = {
                "201": "Accounting & Finance",
                "202": 4,
                "203": 4,
                "204": "Chartered Accountant (CA)",
                "205": "Numbers/Logic"
            }
        else:  # arts
            layer2_answers = {
                "301": "History & Geography",
                "302": 4,
                "303": 4,
                "304": "Law",
                "305": "Reading/Theory"
            }
        
        headers = {"Authorization": f"Bearer {self.token}"}
        payload = {
            "stream": stream,
            "predicted_specialization": specialization,
            "layer1_results": self.stream_prediction,
            "answers": layer2_answers
        }
        
        try:
            response = requests.post(
                f"{BASE_URL}/class10/submit/layer2",
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                self.final_result = data
                
                self.print_success(f"Layer 2 assessment submitted successfully")
                self.print_info(f"Message: {data.get('message')}")
                
                print(f"\n{YELLOW}Final Assessment Results:{RESET}")
                print(f"  Stream: {data.get('stream', 'N/A')}")
                print(f"  Specialization: {data.get('specialization', 'N/A')}")
                
                print(f"\n{YELLOW}Top 3 Recommended Careers:{RESET}")
                careers = data.get('recommended_careers', [])
                for i, career in enumerate(careers, 1):
                    print(f"  {i}. {career.get('name', 'N/A')} ({career.get('cluster', 'N/A')} cluster)")
                
                print(f"\n{YELLOW}Why This Stream:{RESET}")
                print(f"  {data.get('why_this_stream', 'N/A')}")
                
                print(f"\n{YELLOW}Roadmap Phases:{RESET}")
                roadmap = data.get('roadmap', {})
                for phase in roadmap.get('phases', []):
                    print(f"\n  📍 {phase.get('phase', 'N/A')} ({phase.get('duration', 'N/A')})")
                    for activity in phase.get('key_activities', [])[:2]:
                        print(f"     • {activity}")
                
                return True
            else:
                self.print_error(f"Failed to submit Layer 2: {response.status_code}")
                self.print_info(f"Response: {response.text}")
                return False
                
        except Exception as e:
            self.print_error(f"Error: {str(e)}")
            return False
    
    # ===== STEP 5: Check Progress =====
    
    def test_check_progress(self):
        """Check user's assessment progress"""
        self.print_header("STEP 5: Check Assessment Progress")
        
        if not self.token:
            self.print_error("No token available.")
            return False
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        try:
            response = requests.get(
                f"{BASE_URL}/class10/progress",
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                
                self.print_success(f"Progress retrieved successfully")
                
                print(f"\n{YELLOW}Assessment Progress:{RESET}")
                print(f"  Layer 1 Complete: {'✅' if data.get('layer1_complete') else '❌'}")
                print(f"  Layer 2 Complete: {'✅' if data.get('layer2_complete') else '❌'}")
                print(f"  Current Stream: {data.get('current_stream', 'N/A')}")
                print(f"  Module Goal: {data.get('module_goal', 'N/A')}")
                print(f"  Progress: {data.get('progress_percentage', 0)}%")
                
                return True
            else:
                self.print_error(f"Failed to check progress: {response.status_code}")
                return False
                
        except Exception as e:
            self.print_error(f"Error: {str(e)}")
            return False
    
    # ===== Main Test Runner =====
    
    def run_all_tests(self):
        """Run complete test suite"""
        self.print_header("CLASS 10 ASSESSMENT FLOW - COMPLETE END-TO-END TEST")
        
        tests = [
            ("Signup & Token", self.test_signup),
            ("Get Base Questions", self.test_get_base_questions),
            ("Submit Base Assessment", self.test_submit_base_assessment),
            ("Get Layer 2 Questions", self.test_get_layer2_questions),
            ("Submit Layer 2 Assessment", self.test_submit_layer2_assessment),
            ("Check Progress", self.test_check_progress),
        ]
        
        results = {}
        
        for test_name, test_func in tests:
            try:
                result = test_func()
                results[test_name] = "✅ PASS" if result else "❌ FAIL"
            except Exception as e:
                results[test_name] = f"❌ ERROR: {str(e)}"
        
        # Summary
        self.print_header("TEST SUMMARY")
        for test_name, result in results.items():
            status_color = GREEN if "✅" in result else RED
            print(f"{status_color}{result:10s}{RESET} | {test_name}")
        
        all_passed = all("✅" in r for r in results.values())
        
        if all_passed:
            self.print_success("🎉 ALL TESTS PASSED! Backend is ready for frontend integration.")
        else:
            self.print_error("Some tests failed. Check output above for details.")
        
        return all_passed


if __name__ == "__main__":
    tester = Class10Tester()
    tester.run_all_tests()
