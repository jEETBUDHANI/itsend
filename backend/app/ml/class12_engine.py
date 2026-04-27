"""
CLASS 12 ASSESSMENT ENGINE  (Stream-Segregated)
PCM  → Engineering / Tech / Data Science
PCB  → Medical / Biotech / Pharmacy / Nursing
COMMERCE → CA / Finance / BBA / Actuarial
ARTS → Law / Journalism / Psychology / Design / Civil Services
"""

# No external data imports needed — all career data is defined in this file

# ─────────────────────────────────────────────────────────────
# Per-stream career catalogue
# ─────────────────────────────────────────────────────────────
STREAM_CAREER_PROFILES = {

    "PCM": {
        "Software Engineer": {
            "domain": "tech",
            "skills": ["Programming", "DSA", "Problem Solving", "System Design"],
            "salary_range": "Fresher: 5-12 LPA | Experienced: 15-50+ LPA",
            "roadmap_steps": [
                "Learn C++ / Python / Java fundamentals",
                "Master Data Structures & Algorithms",
                "Build 3-5 real-world projects (web/app/ML)",
                "Crack JEE / BITSAT to get into a good CS program",
                "Do internships from 2nd year onwards",
            ],
            "timeline": [
                "Now–6 months : JEE prep + programming basics",
                "6–12 months : Mock tests + DSA",
                "College Year 1-2 : Projects + internship hunt",
            ],
            "exams": ["JEE Mains/Advanced", "BITSAT", "CUET", "State-level CETs"],
            "top_colleges": ["IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani", "VIT Vellore"],
        },
        "Data Scientist": {
            "domain": "tech",
            "skills": ["Statistics", "Python/R", "Machine Learning", "SQL", "Communication"],
            "salary_range": "Fresher: 6-14 LPA | Experienced: 18-60+ LPA",
            "roadmap_steps": [
                "Excel in Maths & Statistics",
                "Learn Python + Pandas + NumPy",
                "Work on Kaggle / real datasets",
                "Study ML algorithms thoroughly",
                "Get into B.Sc/B.Tech + specialise in AI/Data",
            ],
            "timeline": [
                "Now–6 months : JEE prep + Python intro",
                "6–12 months : Projects + data certificates",
                "College : Internship in data roles",
            ],
            "exams": ["JEE Mains/Advanced", "CUET", "BITSAT"],
            "top_colleges": ["IIT Madras", "BITS Goa", "IIIT Hyderabad", "VIT", "SRM Chennai"],
        },
        "Mechanical / Civil Engineer": {
            "domain": "core_engg",
            "skills": ["Mathematics", "Physics", "CAD/CAM", "Analytical Thinking"],
            "salary_range": "Fresher: 3-7 LPA | Experienced: 10-25 LPA",
            "roadmap_steps": [
                "Goal: Top NIT / IIIT / State college",
                "Focus heavily on Physics + Maths",
                "Attempt JEE Mains + State CET",
                "Learn AutoCAD / SolidWorks as hobby",
                "Pursue core engineering placements or GATE",
            ],
            "timeline": [
                "Now–12 months : JEE + State CET preparation",
                "College Year 1-2 : Core fundamentals",
                "Year 3-4 : GATE prep + placements",
            ],
            "exams": ["JEE Mains", "State-level CETs", "CUET"],
            "top_colleges": ["NIT Warangal", "NIT Calicut", "Jadavpur University", "COEP Pune"],
        },
    },

    "PCB": {
        "Doctor (MBBS)": {
            "domain": "medical",
            "skills": ["Biology", "Chemistry", "Empathy", "Discipline", "Communication"],
            "salary_range": "Junior: 8-16 LPA | Senior/Specialist: 25-80 LPA",
            "roadmap_steps": [
                "Master Biology (NCERT + HC Verma-level concepts)",
                "Strengthen Organic Chemistry",
                "Target NEET with 600+ score",
                "Appear in NEET every year until qualified",
                "Choose MBBS college based on NEET rank",
            ],
            "timeline": [
                "Now–12 months : NEET intensive prep (Bio+Chem+Phy)",
                "Daily: 5 hrs study + 1 hr mock test",
                "After NEET : Counselling + MBBS admission",
            ],
            "exams": ["NEET"],
            "top_colleges": ["AIIMS Delhi", "JIPMER", "CMC Vellore", "MAMC Delhi"],
        },
        "Pharmacist / Pharma Research": {
            "domain": "medical",
            "skills": ["Chemistry", "Biology", "Research", "Analytical Thinking"],
            "salary_range": "Fresher: 3-8 LPA | Experienced: 10-25 LPA",
            "roadmap_steps": [
                "Target B.Pharm through NEET / Merit",
                "Strengthen Organic & Inorganic Chemistry",
                "Learn drug discovery basics",
                "Pursue M.Pharm for research track",
                "Internship at hospital/pharma company",
            ],
            "timeline": [
                "Now–12 months : NEET prep (especially Chemistry)",
                "College : Lab focus + Research projects",
                "Post-grad : M.Pharm or research fellowship",
            ],
            "exams": ["NEET", "CUET", "State Pharmacy Entrances"],
            "top_colleges": ["JSS Mysore", "Manipal", "Amrita", "Jamia Hamdard"],
        },
        "Biotech Researcher": {
            "domain": "biotech",
            "skills": ["Biology", "Research Methodology", "Lab Techniques", "Documentation"],
            "salary_range": "Fresher: 4-9 LPA | Experienced: 12-30 LPA",
            "roadmap_steps": [
                "Target B.Sc Biotechnology / B.Tech Biotech",
                "Strengthen Biology + Chemistry lab concepts",
                "Apply for CUET or university entrance",
                "Do research internships in labs",
                "Pursue M.Sc / PhD for core research",
            ],
            "timeline": [
                "Now–6 months : CUET + NEET prep",
                "College Year 1-2 : Lab skills + projects",
                "Year 3-4 : Research internship + postgrad planning",
            ],
            "exams": ["CUET", "NEET", "State entrances"],
            "top_colleges": ["Delhi University", "BITS Pilani (Biotech)", "Manipal", "Pune University"],
        },
    },

    "COMMERCE": {
        "Chartered Accountant (CA)": {
            "domain": "finance",
            "skills": ["Accountancy", "Taxation", "Audit", "Finance Laws", "Discipline"],
            "salary_range": "Fresher: 7-14 LPA | Experienced: 20-60 LPA",
            "roadmap_steps": [
                "Enrol in B.Com + CA Foundation immediately after Class 12",
                "Clear CA Foundation → Intermediate → Final",
                "Articleship of 3 years during CA Intermediate",
                "Focus on Taxation, Accounts, Law",
                "Join a Big-4 firm or start own practice",
            ],
            "timeline": [
                "Now: B.Com admission + CA Foundation registration",
                "Year 1-2: CA Foundation + Intermediate prep",
                "Year 3-5: Articleship + CA Final",
            ],
            "exams": ["CA Foundation", "CUET", "State merit"],
            "top_colleges": ["SRCC Delhi", "Christ University", "Loyola Chennai", "St. Xavier's Mumbai"],
        },
        "Business Manager / MBA": {
            "domain": "business",
            "skills": ["Communication", "Leadership", "Marketing", "Quantitative Aptitude"],
            "salary_range": "Fresher: 5-10 LPA | Post-MBA: 15-40 LPA",
            "roadmap_steps": [
                "BBA from a good college via CUET / university test",
                "Build communication + presentation skills",
                "Join student clubs, case competitions",
                "Prepare for CAT / GMAT for MBA",
                "Target top B-schools for MBA",
            ],
            "timeline": [
                "Now: CUET prep + BBA admission",
                "College Year 1-2 : Internships + case studies",
                "Year 3 : CAT Prep + MBA planning",
            ],
            "exams": ["CUET", "IPMAT (IIM Indore/Rohtak)", "NPAT", "SET"],
            "top_colleges": ["IIM Indore (IPM)", "Symbiosis", "NMIMS", "Christ University"],
        },
        "Financial Analyst / Investment Banking": {
            "domain": "finance",
            "skills": ["Financial Modelling", "Excel", "Economics", "Analytical Thinking"],
            "salary_range": "Fresher: 8-18 LPA | Experienced: 30-100+ LPA",
            "roadmap_steps": [
                "B.Com (Hons) or Economics from top university",
                "Learn Excel, Financial Modelling, Bloomberg",
                "CFA / CMA certifications add huge value",
                "Interning at banks / stock broking firms",
                "Target corporate finance / investment banking roles",
            ],
            "timeline": [
                "Now: CUET prep for DU / Top college",
                "College : Finance courses + certifications",
                "Year 3-4 : Internships + CFA Level 1",
            ],
            "exams": ["CUET", "State merit"],
            "top_colleges": ["SRCC Delhi", "Hindu College", "Hansraj", "Symbiosis Economics"],
        },
    },

    "ARTS": {
        "Lawyer (LLB/BA-LLB)": {
            "domain": "law",
            "skills": ["Logical Reasoning", "Communication", "Research", "English", "Critical Thinking"],
            "salary_range": "Fresher: 5-12 LPA | Senior: 30-100+ LPA",
            "roadmap_steps": [
                "Prepare for CLAT / AILET / LSAT",
                "Strengthen English, logical reasoning, current affairs",
                "Target top 10 NLUs (NLSIU, NALSAR, etc.)",
                "BA-LLB programme — 5 years",
                "Focus on moot courts, internships at law firms",
            ],
            "timeline": [
                "Now–12 months : CLAT intensive prep",
                "College 5 years : Moot courts + internships",
                "Post-LLB : Judicial / corporate / litigation track",
            ],
            "exams": ["CLAT", "AILET", "LSAT India", "MH-CET Law"],
            "top_colleges": ["NLSIU Bangalore", "NALSAR Hyderabad", "NLU Delhi", "Symbiosis Law"],
        },
        "Journalist / Media Professional": {
            "domain": "media",
            "skills": ["Writing", "Communication", "Storytelling", "Research", "Digital Tools"],
            "salary_range": "Fresher: 3-7 LPA | Experienced: 10-25 LPA",
            "roadmap_steps": [
                "Apply for CUET or mass comm. entrance",
                "Build blog / YouTube presence during Class 12",
                "BA Journalism / BMM (3 years)",
                "Intern at newspapers, digital media companies",
                "Build strong portfolio and network",
            ],
            "timeline": [
                "Now : CUET prep + portfolio building",
                "College : Internships from Year 1",
                "Year 3 : Full-time journalism role",
            ],
            "exams": ["CUET", "IIMC entrance", "XIC entrance", "IIJNM entrance"],
            "top_colleges": ["IIMC Delhi", "Symbiosis", "IIJNM Chennai", "Asian College of Journalism"],
        },
        "Psychologist / Social Worker": {
            "domain": "social",
            "skills": ["Empathy", "Communication", "Research", "Counselling", "Patience"],
            "salary_range": "Fresher: 4-9 LPA | Clinical/Senior: 12-30 LPA",
            "roadmap_steps": [
                "BA Psychology (Hons) via CUET",
                "Strengthen understanding of human behaviour",
                "Do internships at NGOs / counselling centres",
                "Pursue M.A. Psychology / M.Sc Clinical Psychology",
                "Target RCI registration for clinical track",
            ],
            "timeline": [
                "Now : CUET prep",
                "College 3 years : BA Psychology",
                "Post-grad : M.Sc / M.A. + RCI Registration",
            ],
            "exams": ["CUET", "NLU entrance (for criminology)", "State merit"],
            "top_colleges": ["Lady Shri Ram (LSR)", "JNU", "Delhi University", "TISS"],
        },
        "Civil Services (IAS/IPS)": {
            "domain": "government",
            "skills": ["Analytical Thinking", "Current Affairs", "Writing", "Leadership"],
            "salary_range": "Government Pay: 7-18 LPA + perks & power",
            "roadmap_steps": [
                "Any graduation is fine — choose subjects to help UPSC prep",
                "Start reading newspapers + NCERT from Class 12 itself",
                "BA with History/PolSci/Economics as optional subjects helps",
                "Prepare for UPSC Prelims + Mains",
                "Join coaching if needed (Vajiram, Vision IAS, etc.)",
            ],
            "timeline": [
                "Now : CUET for BA + start reading newspaper daily",
                "College 3 years : Graduation + parallel UPSC prep",
                "Post-grad : Full-time UPSC preparation",
            ],
            "exams": ["CUET", "State PSC exams", "UPSC-focused graduation"],
            "top_colleges": ["Delhi University", "JNU", "TISS", "BHU"],
        },
    },
}

# ─────────────────────────────────────────────────────────────
# Allowed career keys per stream (fast lookup)
# ─────────────────────────────────────────────────────────────
STREAM_ALLOWED_CAREERS = {
    stream: list(careers.keys())
    for stream, careers in STREAM_CAREER_PROFILES.items()
}


class Class12AssessmentEngine:
    """Stream-locked career engine for Class 12 Decision Phase."""




    # ─── PUBLIC API ───────────────────────────────────────────

    def process_assessment(self, answers: dict, stream_info: dict):
        """Process answers and return stream-specific career recommendations."""
        normalized_stream = self._normalize_stream(
            answers.get("stream"),
            stream_info.get("stream", ""),
            stream_info.get("specialization", ""),
        )

        career_pool = STREAM_CAREER_PROFILES.get(normalized_stream, STREAM_CAREER_PROFILES["PCM"])
        domain_scores = self._calculate_domain_scores(answers, normalized_stream, career_pool)
        career_recommendations = self._recommend_careers(domain_scores, normalized_stream, career_pool, answers)

        selected_career = (
            career_recommendations[0]["career"] if career_recommendations
            else self._default_career_for_stream(normalized_stream)
        )

        exam_strategy = self._recommend_exam_strategy(answers, selected_career, normalized_stream, career_pool)
        college_tier = self._recommend_college_tier(
            int(answers.get("exam_prep_level", answers.get("self_math", 3) or 3)),
            int(answers.get("placement_importance", answers.get("self_communication", 3) or 3)),
        )
        roadmap = self._create_career_roadmap(selected_career, normalized_stream, career_pool)
        college_search_filters = self._build_college_filters(answers, exam_strategy, normalized_stream, career_pool, selected_career)
        degree_recommendations = self._get_degree_recs(career_recommendations, career_pool)

        return {
            "career_recommendations": career_recommendations,
            "selected_career": selected_career,
            "degree_recommendations": degree_recommendations,
            "college_tier": college_tier,
            "exam_strategy": exam_strategy,
            "college_search_filters": college_search_filters,
            "roadmap": roadmap,
            "domain_scores": domain_scores,
            "stream": normalized_stream,
            "specialization": stream_info.get("specialization", normalized_stream),
            "progress": {
                "assessmentDone": True,
                "careerSelected": bool(selected_career),
                "roadmapStarted": False,
                "appliedForExams": False,
            },
            "personalized_advice": (
                f"Recommended for {normalized_stream} profile. "
                f"Start with {selected_career} roadmap, "
                f"target {exam_strategy.get('primary_exam')}, "
                "and shortlist colleges using your filters."
            ),
        }

    # ─── STREAM NORMALIZATION ─────────────────────────────────

    def _normalize_stream(self, selected_stream, user_stream, user_specialization):
        text = str(selected_stream or user_specialization or user_stream or "").strip().upper()
        if "COMMER" in text:
            return "COMMERCE"
        if "ART" in text or "HUMAN" in text:
            return "ARTS"
        if "PCB" in text or ("BIO" in text and "TECH" not in text):
            return "PCB"
        if "PCM" in text or "MATH" in text or "ENG" in text:
            return "PCM"
        # Fallback: check user_stream
        us = str(user_stream or "").upper()
        if "COMMER" in us:
            return "COMMERCE"
        if "ART" in us:
            return "ARTS"
        return "PCM"  # safe default for science students

    def _default_career_for_stream(self, stream):
        defaults = {
            "PCM": "Software Engineer",
            "PCB": "Doctor (MBBS)",
            "COMMERCE": "Chartered Accountant (CA)",
            "ARTS": "Lawyer (LLB/BA-LLB)",
        }
        return defaults.get(stream, "Software Engineer")

    # ─── SCORING ─────────────────────────────────────────────

    def _calculate_domain_scores(self, answers: dict, normalized_stream: str, career_pool: dict):
        """Score each career in the stream-specific pool."""
        scores = {career: 0.0 for career in career_pool}

        for career, profile in career_pool.items():
            # Subject preference boost
            pref_subjects = " ".join(str(s) for s in (answers.get("preferred_subjects") or [])).lower()
            for skill in profile["skills"]:
                if skill.lower() in pref_subjects:
                    scores[career] += 6

            # Interest questions mapped to domains
            domain = profile.get("domain", "")
            if domain in ("tech", "core_engg"):
                scores[career] += int(answers.get("interest_logical", 3) or 3) * 4
                scores[career] += int(answers.get("interest_computers", 3) or 3) * 4
                scores[career] += int(answers.get("self_math", 3) or 3) * 3
            elif domain in ("medical", "biotech"):
                scores[career] += int(answers.get("interest_biology", 3) or 3) * 5
            elif domain in ("finance", "business"):
                scores[career] += int(answers.get("interest_business", 3) or 3) * 5
                scores[career] += int(answers.get("self_analytical", 3) or 3) * 3
            elif domain in ("media", "social", "government", "law"):
                scores[career] += int(answers.get("interest_creative", 3) or 3) * 4
                scores[career] += int(answers.get("self_communication", 3) or 3) * 4

            # Exam alignment bonus
            exam_answers = answers.get("exams") or []
            if isinstance(exam_answers, str):
                exam_answers = [exam_answers]
            exam_text = " ".join(str(e) for e in exam_answers).upper()
            for exam in profile["exams"]:
                key = exam.split("/")[0].strip().upper()
                if key in exam_text:
                    scores[career] += 12

            # Primary goal alignment
            goal = str(answers.get("primary_goal", "")).lower()
            if domain == "tech" and ("engineer" in goal or "tech" in goal):
                scores[career] += 14
            if domain == "medical" and ("medical" in goal or "dental" in goal):
                scores[career] += 14
            if domain in ("finance", "business") and "commerce" in goal:
                scores[career] += 14
            if domain in ("law", "media", "social", "government") and ("arts" in goal or "humanities" in goal):
                scores[career] += 14

        return scores

    def _recommend_careers(self, scores: dict, normalized_stream: str, career_pool: dict, answers: dict):
        """Rank and return top 3 careers strictly from the stream's pool with embedded roadmaps."""
        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        total = sum(v for _, v in ranked) or 1

        recommendations = []
        for rank, (career, raw_score) in enumerate(ranked[:3], start=1):
            profile = career_pool[career]
            match_pct = min(95, max(55, int((raw_score / total) * 300 + 45)))
            
            # Embed specific strategy for this alternative career
            exam_strategy = self._recommend_exam_strategy(answers, career, normalized_stream, career_pool)
            roadmap = self._create_career_roadmap(career, normalized_stream, career_pool)
            college_search = self._build_college_filters(answers, exam_strategy, normalized_stream, career_pool, career)

            recommendations.append({
                "career": career,
                "match_percent": match_pct,
                "reason": [
                    f"Best fit for {normalized_stream} stream profile",
                    f"Key skills match: {', '.join(profile['skills'][:2])}",
                    f"Salary: {profile['salary_range']}",
                ],
                "suggested_exams": profile["exams"][:2],
                "salary_range": profile["salary_range"],
                "top_colleges": profile.get("top_colleges", [])[:3],
                "roadmap": roadmap,
                "exam_strategy": exam_strategy,
                "college_search_filters": college_search
            })
        return recommendations

    def _get_degree_recs(self, career_recs, career_pool):
        result = []
        for item in career_recs:
            profile = career_pool.get(item["career"], {})
            result.append({
                "name": item["career"],
                "exams": ", ".join(profile.get("exams", [])[:2]),
                "placement_avg": profile.get("salary_range", ""),
            })
        return result

    # ─── EXAM STRATEGY ───────────────────────────────────────

    def _recommend_exam_strategy(self, answers: dict, selected_career: str, normalized_stream: str, career_pool: dict):
        profile = career_pool.get(selected_career, {})
        exams = profile.get("exams", ["CUET"])

        exam_answers = answers.get("exams") or []
        if isinstance(exam_answers, str):
            exam_answers = [exam_answers]
        primary_exam = exam_answers[0] if exam_answers else exams[0]

        prep_level = int(answers.get("exam_prep_level", answers.get("self_math", 3) or 3))
        daily_hours = 2 if prep_level <= 2 else 3 if prep_level <= 4 else 5

        # Stream-specific daily plan
        stream_daily = {
            "PCM": [f"{daily_hours} hrs Physics + Maths", "1 hr Chemistry", "30 min mock drill"],
            "PCB": [f"{daily_hours} hrs Biology + Chemistry", "1 hr Physics", "30 min NEET mock"],
            "COMMERCE": [f"{daily_hours} hrs Accounts + Economics", "1 hr Business Studies", "30 min case study"],
            "ARTS": [f"{daily_hours} hrs Current Affairs + Main subject", "1 hr logical reasoning", "30 min writing practice"],
        }

        return {
            "primary_exam": primary_exam,
            "secondary_exams": [e for e in exams if e != primary_exam][:2],
            "difficulty": "Very High" if primary_exam in ["JEE Mains/Advanced", "NEET", "CLAT"]
                          else "High" if primary_exam in ["CUET", "IPMAT"]
                          else "Medium",
            "study_plan": {
                "daily": stream_daily.get(normalized_stream, stream_daily["PCM"]),
                "weekly": ["1 full-length mock test", "Error analysis session", "Weak-topic revision"],
            },
        }

    # ─── COLLEGE TIER ────────────────────────────────────────

    def _recommend_college_tier(self, exam_prep_level: int, placement_importance: int):
        score = exam_prep_level * 0.6 + placement_importance * 0.4
        if score >= 4:
            return "Top Tier"
        if score >= 3:
            return "Tier 1"
        if score >= 2:
            return "Tier 2"
        return "Tier 3"

    # ─── CAREER ROADMAP ──────────────────────────────────────

    def _create_career_roadmap(self, selected_career: str, normalized_stream: str, career_pool: dict):
        profile = career_pool.get(selected_career, {})
        return {
            "career": selected_career,
            "overview": f"Structured path to become a {selected_career} from {normalized_stream} stream.",
            "skills_required": profile.get("skills", []),
            "steps": profile.get("roadmap_steps", []),
            "timeline": profile.get("timeline", []),
            "salary_range": profile.get("salary_range", "Varies"),
        }

    # ─── COLLEGE FILTERS ─────────────────────────────────────

    def _build_college_filters(self, answers: dict, exam_strategy: dict,
                                normalized_stream: str, career_pool: dict, selected_career: str):
        profile = career_pool.get(selected_career, {})
        top_colleges = profile.get("top_colleges", [])
        return {
            "budget": answers.get("budget", "10-20L"),
            "location": answers.get("preferred_location", answers.get("college_env", "Any location")),
            "exam_rank_target": answers.get("target_rank", "Top 20% percentile"),
            "exam": exam_strategy.get("primary_exam", "CUET"),
            "recommended_colleges": top_colleges[:4],
        }
