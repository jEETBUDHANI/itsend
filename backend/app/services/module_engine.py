"""Dynamic module engine for class10, class12, and college flows."""

from copy import deepcopy

from app.data.module_definitions import (
    MODULES,
    CLASS10_CLUSTERS,
    CLASS12_DEGREES,
    CLASS12_EXAMS,
    COLLEGE_ROLES,
    ROADMAP_TEMPLATES,
)


def _avg(values):
    nums = []
    for value in (values or {}).values():
        try:
            nums.append(float(value))
        except (TypeError, ValueError):
            continue
    if not nums:
        return 0.0
    return sum(nums) / len(nums)


class ModuleEngine:
    """Module-aware scoring, recommendation, and roadmap generation."""

    def get_module_config(self, module_key):
        return MODULES.get(module_key)

    def list_modules(self):
        return list(MODULES.values())

    def score_assessment(self, module_key, assessment_key, payload):
        module = self.get_module_config(module_key)
        if not module:
            raise ValueError("Invalid module")

        definition = module["assessments"].get(assessment_key)
        if not definition:
            raise ValueError("Assessment does not belong to selected module")

        inputs = payload.get("inputs", {}) if isinstance(payload, dict) else {}
        if not isinstance(inputs, dict):
            inputs = {}

        expected = definition.get("input_schema", [])
        normalized = {}
        for key in expected:
            value = inputs.get(key, 0)
            try:
                numeric = float(value)
            except (TypeError, ValueError):
                numeric = 0.0
            normalized[key] = max(0.0, min(100.0, numeric))

        score = round(_avg(normalized), 2)
        return {
            "assessment_key": assessment_key,
            "title": definition.get("title"),
            "normalized_inputs": normalized,
            "score": score,
            "weight": 1.0,
        }

    def build_recommendation(self, module_key, profile, assessment_results):
        """Create module-specific recommendation outputs."""
        module = self.get_module_config(module_key)
        if not module:
            raise ValueError("Invalid module")

        score_map = {item["assessment_key"]: item["score"] for item in assessment_results}
        overall = round(_avg({k: v for k, v in score_map.items()}), 2)

        if module_key == "class10":
            stream_scores = {
                "Science": round((score_map.get("aptitude_basics", 0) * 0.45) + (score_map.get("stream_suitability", 0) * 0.35) + (score_map.get("interest_discovery", 0) * 0.20), 2),
                "Commerce": round((score_map.get("learning_style", 0) * 0.20) + (score_map.get("interest_discovery", 0) * 0.40) + (score_map.get("stream_suitability", 0) * 0.40), 2),
                "Arts": round((score_map.get("personality_explorer", 0) * 0.30) + (score_map.get("interest_discovery", 0) * 0.35) + (score_map.get("learning_style", 0) * 0.35), 2),
            }
            stream = max(stream_scores, key=stream_scores.get)
            clusters = [{"name": cluster, "fit": max(60, min(98, int(overall + idx * 3)))} for idx, cluster in enumerate(CLASS10_CLUSTERS)]
            clusters = sorted(clusters, key=lambda item: item["fit"], reverse=True)

            outputs = {
                "recommended_stream": stream,
                "stream_suitability_score": stream_scores.get(stream, overall),
                "stream_scores": stream_scores,
                "career_clusters": clusters[:4],
                "subject_strength_analysis": {
                    "quantitative": score_map.get("aptitude_basics", 0),
                    "self_learning": score_map.get("learning_style", 0),
                    "personality_readiness": score_map.get("personality_explorer", 0),
                },
            }

        elif module_key == "class12":
            degree_fit = [{"degree": degree, "fit": max(55, min(99, int(overall + idx * 4 - 5)))} for idx, degree in enumerate(CLASS12_DEGREES)]
            degree_fit = sorted(degree_fit, key=lambda item: item["fit"], reverse=True)

            exam_fit = [{"exam": exam, "fit": max(50, min(99, int(score_map.get("exam_fit", 0) + idx * 5 - 8)))} for idx, exam in enumerate(CLASS12_EXAMS)]
            exam_fit = sorted(exam_fit, key=lambda item: item["fit"], reverse=True)

            tier = "Tier 1" if overall >= 78 else "Tier 2" if overall >= 60 else "Tier 3"

            outputs = {
                "best_degree_recommendations": degree_fit[:4],
                "exam_recommendations": exam_fit[:4],
                "college_tier_prediction": tier,
                "admission_strategy": [
                    "Lock primary exam focus and one backup exam",
                    "Build rank-targeted monthly prep cycles",
                    "Prepare SOP/portfolio and scholarship docs early",
                ],
                "college_preparation_roadmap": "Quarter-wise degree and admission execution plan",
            }

        elif module_key == "college":
            roles = [{"role": role, "fit": max(55, min(99, int(overall + idx * 3 - 6)))} for idx, role in enumerate(COLLEGE_ROLES)]
            roles = sorted(roles, key=lambda item: item["fit"], reverse=True)

            readiness = round((score_map.get("placement_readiness", 0) * 0.35) + (score_map.get("technical_skill", 0) * 0.35) + (score_map.get("resume_portfolio", 0) * 0.30), 2)
            top_role = roles[0]["role"] if roles else "Software Engineer"

            outputs = {
                "best_job_role_recommendations": roles[:4],
                "placement_readiness_score": readiness,
                "skill_gap_report": [
                    {"area": "Core technical depth", "priority": "high" if score_map.get("technical_skill", 0) < 70 else "medium"},
                    {"area": "Interview communication", "priority": "high" if score_map.get("placement_readiness", 0) < 70 else "medium"},
                    {"area": "Portfolio evidence", "priority": "high" if score_map.get("resume_portfolio", 0) < 70 else "medium"},
                ],
                "interview_preparation_plan": [
                    "Weekly mock interviews with feedback loops",
                    "Role-based question bank and timed drills",
                    "Company-fit preparation and application cadence",
                ],
                "placement_roadmap": f"Role-focused execution path for {top_role}",
            }

        else:
            outputs = {}

        return {
            "module": module_key,
            "module_name": module.get("name"),
            "overall_score": overall,
            "output_type": module.get("output_type"),
            "outputs": outputs,
            "profile": profile,
        }

    def build_roadmap(self, module_key, recommendation):
        template = deepcopy(ROADMAP_TEMPLATES.get(module_key, {"title": "Roadmap", "steps": []}))
        outputs = recommendation.get("outputs", {}) if isinstance(recommendation, dict) else {}

        if module_key == "class10":
            stream = outputs.get("recommended_stream", "Science")
            template["recommended_path"] = stream
            template["milestones"] = [
                f"Finalize {stream} stream decision with confidence",
                "Build subject consistency using weekly tracker",
                "Map stream subjects to top career clusters",
            ]

        elif module_key == "class12":
            degree = (outputs.get("best_degree_recommendations") or [{"degree": "B.Tech / B.E."}])[0]["degree"]
            exam = (outputs.get("exam_recommendations") or [{"exam": "CUET"}])[0]["exam"]
            template["recommended_path"] = degree
            template["milestones"] = [
                f"Prioritize {exam} preparation with monthly score targets",
                "Finalize college shortlist by tier and affordability",
                "Execute admission and scholarship timeline",
            ]

        elif module_key == "college":
            role = (outputs.get("best_job_role_recommendations") or [{"role": "Software Engineer"}])[0]["role"]
            template["recommended_path"] = role
            template["milestones"] = [
                "Close top 3 skill gaps with measurable project output",
                "Complete interview tracker with weekly performance review",
                "Build company-targeted application pipeline",
            ]

        return template

    def progress_snapshot(self, module_key, results):
        module = self.get_module_config(module_key)
        required = module.get("assessment_order", []) if module else []
        completed = {r.get("assessment_key") for r in results}
        percent = 0
        if required:
            percent = round((len(completed.intersection(required)) / len(required)) * 100)

        return {
            "module": module_key,
            "completed_count": len(completed.intersection(required)),
            "required_count": len(required),
            "progress_percent": percent,
            "is_complete": percent == 100,
        }
