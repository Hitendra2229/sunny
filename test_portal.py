import urllib.request
import json

base = "http://localhost:5000"

def run_tests():
    print("=" * 70)
    print("NVN INDIA PRIVATE LIMITED (JAMMALAMADUGU) - AUTOMATED PORTAL TEST")
    print("=" * 70)

    # 1. Main Home Page Check
    req = urllib.request.Request(f"{base}/", headers={"User-Agent": "TestClient"})
    with urllib.request.urlopen(req) as res:
        html = res.read().decode("utf-8")
        print(f"\n[PASS] Homepage Loaded HTTP {res.status} ({len(html)} bytes)")
        
        checks = [
            ("NVN India Private Limited", "Corporate Brand Name"),
            ("Jammalamadugu", "Headquarters & Campus City"),
            ("Worker for Client", "Pillar 3: Worker for Client"),
            ("100% Placement Support", "Pillar 1: Placement Support"),
            ("clientWorkers", "Worker for Client Section"),
            ("jammalamaduguHub", "Jammalamadugu Innovation Campus Section"),
            ("placementsContainer", "Alumni Placements Hall of Fame Container"),
            ("staffingModal", "Hire Dedicated Worker Modal"),
            ("consultationModal", "IT Advisory & Campus Tour Modal"),
            ("commandPaletteOverlay", "Spotlight Command Palette (Ctrl+K)"),
            ("techBotFab", "Smart Floating AI TechBot Assistant"),
            ("livePlayground", "Interactive Live Code Terminal"),
            ("projectEstimator", "Interactive Architecture & Project Estimator"),
            ("adminSection", "Relational SQLite Management Console")
        ]
        for tag, label in checks:
            if tag in html:
                print(f"  [OK] {label}: Present")
            else:
                print(f"  [FAIL] {label}: Missing")
                assert tag in html, f"Missing required element: {label}"

    # 2. Courses API: Verify all 8 courses with 6 modules each and merit track
    with urllib.request.urlopen(f"{base}/api/courses") as res:
        data = json.loads(res.read().decode("utf-8"))
        courses = data.get("data", [])
        print(f"\n[PASS] Courses API returned {len(courses)} specialized tracks (Expected: 8):")
        assert len(courses) == 8, f"Expected 8 courses, got {len(courses)}"
        for c in courses:
            code = c.get("code")
            title = c.get("title")
            model = c.get("training_model")
            syllabus = c.get("syllabus", [])
            print(f"  [OK] [{code}] {title} | Modules: {len(syllabus)}/6 | Model: {model[:35]}...")
            assert len(syllabus) == 6, f"Course {code} must have 6 modules!"
            assert "Industry-Sponsored" in model, f"Course {code} must be free/industry-sponsored!"

    # 3. Staffing API Check: GET, POST, PATCH, DELETE
    print(f"\n[PASS] Testing Worker for Client Staffing API (/api/staffing):")
    with urllib.request.urlopen(f"{base}/api/staffing") as res:
        st_data = json.loads(res.read().decode("utf-8"))
        staffing_list = st_data.get("data", [])
        print(f"  [OK] Initial staffing requests count: {len(staffing_list)}")
        assert len(staffing_list) >= 3, "Expected at least 3 seeded staffing requests"

    # POST new staffing request
    post_payload = {
        "client_name": "Test Client London",
        "company_name": "FinTech Global UK",
        "email": "test@fintechglobal.co.uk",
        "phone": "+44 20 7946 0999",
        "role_required": "Full Stack Developer",
        "workers_count": 2,
        "engagement_model": "Dedicated Full-Time Worker",
        "contract_duration": "6 Months",
        "budget_range": "INR 80,000 - 1,50,000",
        "project_scope": "Testing automated worker deployment from Jammalamadugu."
    }
    req_post = urllib.request.Request(
        f"{base}/api/staffing",
        data=json.dumps(post_payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req_post) as res:
        post_resp = json.loads(res.read().decode("utf-8"))
        new_staffing_id = post_resp.get("id")
        print(f"  [OK] POST /api/staffing created record ID: #{new_staffing_id}")
        assert post_resp.get("success") is True

    # PATCH staffing status
    req_patch = urllib.request.Request(
        f"{base}/api/staffing/{new_staffing_id}",
        data=json.dumps({"status": "Worker Deployed"}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="PATCH"
    )
    with urllib.request.urlopen(req_patch) as res:
        patch_resp = json.loads(res.read().decode("utf-8"))
        print(f"  [OK] PATCH /api/staffing/{new_staffing_id} status updated: {patch_resp.get('message')}")
        assert patch_resp.get("success") is True

    # DELETE test staffing request
    req_del = urllib.request.Request(f"{base}/api/staffing/{new_staffing_id}", method="DELETE")
    with urllib.request.urlopen(req_del) as res:
        del_resp = json.loads(res.read().decode("utf-8"))
        print(f"  [OK] DELETE /api/staffing/{new_staffing_id} cleaned up successfully.")
        assert del_resp.get("success") is True

    # 4. Placements API Check (/api/placements)
    with urllib.request.urlopen(f"{base}/api/placements") as res:
        pl_data = json.loads(res.read().decode("utf-8"))
        placements = pl_data.get("data", [])
        print(f"\n[PASS] Placements Hall of Fame count: {len(placements)} alumni placed:")
        assert len(placements) >= 8, "Expected at least 8 placed alumni records"
        for p in placements[:4]:
            print(f"  [OK] {p.get('student_name')} ({p.get('hometown')}) -> {p.get('company_placed')} @ {p.get('package_ctc')}")

    # 5. Projects API Check (/api/projects)
    with urllib.request.urlopen(f"{base}/api/projects") as res:
        pr_data = json.loads(res.read().decode("utf-8"))
        projects = pr_data.get("data", [])
        print(f"\n[PASS] Sector Projects count: {len(projects)}")
        sectors = set(p.get("sector") for p in projects)
        print(f"  [OK] Active Sectors: {', '.join(sorted(sectors))}")
        assert "Healthcare" in sectors and "FinTech" in sectors

    # 6. Database Stats Check (/api/stats)
    with urllib.request.urlopen(f"{base}/api/stats") as res:
        s_data = json.loads(res.read().decode("utf-8"))
        stats = s_data.get("data", {})
        print(f"\n[PASS] Database Real-Time Aggregates:")
        print(f"  [OK] Headquarters: {stats.get('headquarters')}")
        print(f"  [OK] Total Courses: {stats.get('courses_count')}")
        print(f"  [OK] Trainees Mentored: {stats.get('trainees_count')}")
        print(f"  [OK] Projects Active: {stats.get('projects_count')}")
        print(f"  [OK] Staffing Inquiries: {stats.get('staffing_requests_count')}")
        print(f"  [OK] Placements Count: {stats.get('placements_count')}")
        assert stats.get("headquarters") == "Jammalamadugu, Andhra Pradesh"
        assert stats.get("courses_count") == 8

    # 7. Safe SQL Query Sandbox Check (/api/db/query)
    sql_payload = {"query": "SELECT code, title, duration FROM courses WHERE featured = 1;"}
    req_sql = urllib.request.Request(
        f"{base}/api/db/query",
        data=json.dumps(sql_payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req_sql) as res:
        sql_resp = json.loads(res.read().decode("utf-8"))
        print(f"\n[PASS] SQL Console Runner: returned {sql_resp.get('row_count')} rows successfully.")
        assert sql_resp.get("success") is True

    print("\n" + "=" * 70)
    print(">>> ALL 7 TEST SUITES PASSED! NVN INDIA PORTAL IS 100% PRODUCTION READY! <<<")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
