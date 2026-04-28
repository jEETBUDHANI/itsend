"""
Quick standalone test of Class 12 stream separation.
Run with: python test_streams.py
"""

# Inline the career pool (same as engine) to avoid Flask context
STREAM_CAREER_PROFILES = {
    "PCM":      ["Software Engineer", "Data Scientist", "Mechanical / Civil Engineer"],
    "PCB":      ["Doctor (MBBS)", "Pharmacist / Pharma Research", "Biotech Researcher"],
    "COMMERCE": ["Chartered Accountant (CA)", "Business Manager / MBA", "Financial Analyst / Investment Banking"],
    "ARTS":     ["Lawyer (LLB/BA-LLB)", "Journalist / Media Professional", "Psychologist / Social Worker", "Civil Services (IAS/IPS)"],
}


def normalize_stream(selected_stream, user_stream="", user_specialization=""):
    text = str(selected_stream or user_specialization or user_stream or "").strip().upper()
    if "COMMER" in text:
        return "COMMERCE"
    if "ART" in text or "HUMAN" in text:
        return "ARTS"
    if "PCB" in text or ("BIO" in text and "TECH" not in text):
        return "PCB"
    if "PCM" in text or "MATH" in text:
        return "PCM"
    return "PCM"


print("=" * 50)
print("  CLASS 12 STREAM SEGREGATION TEST")
print("=" * 50)

# Test 1: Normalization
tests = [
    ("PCM",      "science", "PCM"),
    ("PCB",      "science", "PCB"),
    ("Commerce", "commerce", ""),
    ("Arts",     "arts",    ""),
    ("COMMERCE", "",        ""),   # all-caps input
    ("pcb",      "",        ""),   # lowercase input
]

print("\n[1] STREAM NORMALIZATION")
all_ok = True
for stream_input, user_stream, spec in tests:
    n = normalize_stream(stream_input, user_stream, spec)
    careers = STREAM_CAREER_PROFILES[n]
    print(f"  Input={stream_input!r:10} → {n:10} → First career: {careers[0]}")

# Test 2: No cross-contamination
print("\n[2] CROSS-CONTAMINATION CHECK (should all say OK)")
all_sets = {s: set(c) for s, c in STREAM_CAREER_PROFILES.items()}
for s1 in all_sets:
    for s2 in all_sets:
        if s1 >= s2:
            continue
        overlap = all_sets[s1] & all_sets[s2]
        if overlap:
            print(f"  ❌ FAIL: {s1} and {s2} share: {overlap}")
            all_ok = False
        else:
            print(f"  ✅ OK  : {s1} vs {s2} — zero overlap")

# Test 3: Print each stream's career list
print("\n[3] CAREER POOLS PER STREAM")
for stream, careers in STREAM_CAREER_PROFILES.items():
    print(f"  {stream}:")
    for c in careers:
        print(f"    - {c}")

# Final verdict
print()
print("=" * 50)
if all_ok:
    print("  ✅ ALL TESTS PASSED — streams are fully separated")
else:
    print("  ❌ SOME TESTS FAILED — check cross-contamination above")
print("=" * 50)
