import sqlite3
import csv
import os
import sys

db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "nvn_india.db")
if not os.path.exists(db_path):
    print("Database not found at:", db_path)
    input("Press Enter to exit...")
    sys.exit(1)

conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

print("=" * 80)
print(" NVN INDIA PRIVATE LIMITED - OFFICIAL ENQUIRIES & ADMIN CONSOLE VIEWER")
print(" Headquarters: D.No. 1/674, Opposite to Town Church, Upstairs, Jammalamadugu")
print("=" * 80)

# 1. Direct Inquiries
print("\n--- [1] DIRECT WEBSITE MESSAGES & GENERAL INQUIRIES ---")
cursor.execute("SELECT id, sender_name, email, phone, subject, message, created_at FROM inquiries ORDER BY id DESC")
inqs = cursor.fetchall()
if not inqs:
    print("  (No direct contact messages yet)")
else:
    for row in inqs:
        print(f"  [#{row['id']}] Name: {row['sender_name']} | Phone: {row['phone']} | Email: {row['email']}")
        print(f"       Date: {row['created_at']} | Subject: {row['subject']}")
        print(f"       Message: {row['message']}\n")

# 2. Trainee Registrations
print("\n--- [2] TRAINEE ADMISSION & IT TRAINING APPLICATIONS ---")
cursor.execute("SELECT id, full_name, email, phone, course_name, education, batch_mode, status, created_at FROM trainees ORDER BY id DESC")
trainees = cursor.fetchall()
if not trainees:
    print("  (No trainee applications yet)")
else:
    for row in trainees:
        print(f"  [#{row['id']}] Applicant: {row['full_name']} | Phone: {row['phone']} | Email: {row['email']}")
        print(f"       Course: {row['course_name']} ({row['batch_mode']}) | Education: {row['education']} | Status: {row['status']}")
        print(f"       Date: {row['created_at']}\n")

# 3. Worker for Client Staffing
print("\n--- [3] 'WORKER FOR CLIENT' (STAFFING ENQUIRIES) ---")
cursor.execute("SELECT id, client_name, company_name, email, phone, role_required, experience_level, duration_months, status, created_at FROM staffing_requests ORDER BY id DESC")
staffing = cursor.fetchall()
if not staffing:
    print("  (No staffing requests yet)")
else:
    for row in staffing:
        print(f"  [#{row['id']}] Client: {row['client_name']} ({row['company_name']}) | Phone: {row['phone']} | Email: {row['email']}")
        print(f"       Role: {row['role_required']} ({row['experience_level']}) | Duration: {row['duration_months']} Months | Status: {row['status']}")
        print(f"       Date: {row['created_at']}\n")

# 4. IT Advisory & Consultations
print("\n--- [4] IT CONSULTANCY & CAMPUS TOUR REQUESTS ---")
cursor.execute("SELECT id, client_name, organization, email, phone, consultancy_domain, preferred_date, status, created_at FROM consultations ORDER BY id DESC")
consults = cursor.fetchall()
if not consults:
    print("  (No consultations yet)")
else:
    for row in consults:
        print(f"  [#{row['id']}] Client: {row['client_name']} ({row['organization']}) | Phone: {row['phone']} | Email: {row['email']}")
        print(f"       Domain: {row['consultancy_domain']} | Preferred Date: {row['preferred_date']} | Status: {row['status']}")
        print(f"       Date: {row['created_at']}\n")

# 5. Software Projects (RFPs)
print("\n--- [5] SECTOR SOFTWARE PROJECT PROPOSALS ---")
cursor.execute("SELECT id, client_name, organization, email, phone, sector, project_title, target_timeline, status, created_at FROM projects ORDER BY id DESC")
projects = cursor.fetchall()
if not projects:
    print("  (No software project proposals yet)")
else:
    for row in projects:
        print(f"  [#{row['id']}] Client: {row['client_name']} ({row['organization']}) | Sector: {row['sector']}")
        print(f"       Title: {row['project_title']} | Timeline: {row['target_timeline']} | Status: {row['status']}")
        print(f"       Date: {row['created_at']}\n")

# Export to CSV on Desktop
desktop_csv = os.path.join(os.path.dirname(os.path.abspath(__file__)), "LATEST_ENQUIRIES_EXPORT.csv")
with open(desktop_csv, "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.writer(f)
    writer.writerow(["Category", "ID", "Name/Applicant", "Company/Org", "Email", "Phone", "Details/Course/Title", "Status", "Date"])
    for r in inqs:
        writer.writerow(["Contact Message", r["id"], r["sender_name"], "", r["email"], r["phone"], f"{r['subject']}: {r['message']}", "New", r["created_at"]])
    for r in trainees:
        writer.writerow(["Trainee Application", r["id"], r["full_name"], r["education"], r["email"], r["phone"], r["course_name"], r["status"], r["created_at"]])
    for r in staffing:
        writer.writerow(["Worker For Client", r["id"], r["client_name"], r["company_name"], r["email"], r["phone"], f"{r['role_required']} ({r['experience_level']})", r["status"], r["created_at"]])
    for r in consults:
        writer.writerow(["IT Advisory", r["id"], r["client_name"], r["organization"], r["email"], r["phone"], r["consultancy_domain"], r["status"], r["created_at"]])
    for r in projects:
        writer.writerow(["Software Project", r["id"], r["client_name"], r["organization"], r["email"], r["phone"], f"{r['sector']}: {r['project_title']}", r["status"], r["created_at"]])

print("=" * 80)
print(f" [OK] All enquiries exported to Excel CSV file:")
print(f"      {desktop_csv}")
print("=" * 80)
