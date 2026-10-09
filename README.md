# NVN India Private Limited - Software Startup Web Portal (.NET & SQL Server)

An enterprise-grade, full-stack software startup portal and engineering platform developed for **NVN India Private Limited**, located in **Jammalamadugu, YSR Kadapa District, Andhra Pradesh - 516434**.

Built using **HTML5, Modern CSS3, C# ASP.NET Core (.NET 10.0), and Microsoft SQL Server (LocalDB & Azure SQL ready with SQLite dual-provider support)**.

The company operates across **four foundational mandates**:
1. **All Courses Training & 100% Placement Support**: 8 comprehensive career tracks (Full Stack, Python AI, Java, Cloud DevOps, QA Automation, Mobile, Data Science, Cyber Security) with industry-sponsored zero-tuition options, live capstones, mock interviews, and guaranteed placement drives with top tier MNCs.
2. **Worker for Client (Staff Augmentation)**: On-demand deployment of pre-assessed, dedicated software developers, QA testers, and cloud engineers within 48 hours with a 1-week risk-free trial and up to 65% cost savings.
3. **Bespoke Software Projects**: End-to-end custom software architecture and turnkey delivery across any industry sector requiring IT (Healthcare, FinTech, E-Commerce, Manufacturing IoT, EdTech, Smart Cities & Governance).
4. **Enterprise IT Consultancy & Cloud Security**: High-level architectural advisory, AWS/Azure cloud migrations, Kubernetes automation, DevSecOps pipelines, and VAPT cybersecurity audits.

---

## 🏛️ Jammalamadugu Headquarters & Innovation Hub

- **Campus Address**: D.No. 1/674, Opposite to Town Church, Upstairs, Jammalamadugu, YSR Kadapa District, Andhra Pradesh - 516434, India.
- **Coordinates**: 14.8340° N, 78.3846° E
- **Official Mobile / Hotline**: +91 86390 92368
- **Direct WhatsApp**: +91 86390 92368
- **Official Email**: nvnindiapvtltd@gmail.com
- **MCA Registration**: CIN U72900AP2024PTC189000

---

## 🛠️ Architecture & Tech Stack

- **Backend**: **C# ASP.NET Core (.NET 10.0 Web API)** with Kestrel HTTP server, Dependency Injection, System.Text.Json, and Dapper micro-ORM.
- **Database Engine**: **Microsoft SQL Server (LocalDB `(localdb)\MSSQLLocalDB` / SQL Server)** with automatic fallback to relational SQLite 3 (`nvn_india.db`).
- **Database DDL**: Complete pure T-SQL schema in [`schema_mssql.sql`](schema_mssql.sql) and SQLite schema in [`schema.sql`](schema.sql).
- **Frontend**: Semantic HTML5, Vanilla Modern CSS3 (Glassmorphism, Cyber-Tech design system, Google Fonts `Outfit` & `Inter`, micro-animations), and Vanilla JavaScript in `wwwroot/`.
- **Interactive Suite**:
  - **Worker for Client Dedicated Team & Cost Estimator**: Dynamic monthly investment calculator in INR and USD based on role, seniority, squad model, and duration.
  - **Full Course Syllabus Drawer & Accordion**: Module-by-module breakdown of all 8 tracks with weekly topics, practical hands-on labs, and key tools.
  - **Alumni Placements Hall of Fame**: Real student placement records from Jammalamadugu and Andhra Pradesh placed in TCS, Infosys, Wipro, Cognizant, Tech Mahindra, HCL, Accenture.
  - **Live Trainee Admission & Internship Status Tracker**: Real-time lookup by Email or Application ID with 5-stage animated progress milestone stepper.
  - **Enterprise IT Architecture & Project Spec Estimator**: Interactive calculator that dynamically generates cloud architecture, tech stacks, and team sizes.
  - **Spotlight Command Palette (Ctrl+K / Cmd+K)**: Instant keyboard-driven navigation across courses, tools, and actions.
  - **Floating NVN TechBot AI Assistant**: Interactive chat widget with quick suggestion chips and deep knowledge of courses, staffing, placements, and campus directions.
  - **Live Interactive Code Terminal Sandbox**: Multi-runtime simulator (FastAPI, React 18, Kubernetes, PyTorch) with execution benchmark outputs.
  - **60-Second Career Track Matcher Quiz**: Recommends the optimal tech track based on interest and targets.
  - **Live SQL Query Runner & Diagnostics**: In the Admin Console, allowing direct execution of SQL SELECT queries with interactive table rendering.

---

## 📁 Project Structure

```
nvn-india-portal/
├── NVNIndiaPortal.csproj      # ASP.NET Core (.NET 10.0) Project File
├── Program.cs                 # ASP.NET Core Startup & Minimal REST API Endpoints
├── appsettings.json           # SQL Server and SQLite Connection Strings
├── schema_mssql.sql           # Microsoft SQL Server (T-SQL) DDL Script
├── schema.sql                 # SQLite Relational SQL Schema
├── run_dotnet.bat             # 1-Click Windows Launcher for .NET + SQL
├── run.bat                    # Windows Launcher
├── test_portal.py             # Automated REST API Integration Test Suite (7 Suites)
├── Data/
│   └── DatabaseService.cs     # SQL Server & SQLite Dual-Provider Repository Service
├── Models/
│   └── Entities.cs            # C# Strongly-Typed Models & DTOs
└── wwwroot/                   # Static Frontend Web Assets
    ├── index.html             # Responsive Single-Page Web Portal (130 KB)
    ├── css/
    │   └── style.css          # Glassmorphic Design System & Micro-Animations
    ├── js/
    │   └── app.js             # Client-side Logic, REST API Integration & Tools
    └── images/
        ├── nvn-logo-realistic.jpg # Ultra-Realistic 3D Master Corporate Emblem
        ├── nvn-logo-emblem.jpg    # 3D Hex-Nexus Monogram Header Mark
        ├── nvn-logo-favicon.png   # 128x128 High-DPI Favicon
        ├── nvn-logo-mark.svg      # Vector SVG Emblem
        ├── nvn-logo.svg           # Vector SVG Lockup with Typography
        └── hero-banner.jpg        # High-Resolution Corporate Hero Banner
```

---

## 🎓 All 8 Specialized IT Training Tracks

1. **NVN-FS-01**: Full Stack Enterprise Web & Cloud Development (16 Weeks)
2. **NVN-AI-02**: Applied AI, Machine Learning & Data Science (20 Weeks)
3. **NVN-DO-03**: Cloud DevOps & Kubernetes Infrastructure (16 Weeks)
4. **NVN-CS-04**: Cyber Security Analyst & Ethical Hacking (12 Weeks)
5. **NVN-JV-05**: Enterprise Java Spring Boot & Microservices (14 Weeks)
6. **NVN-MB-06**: Cross-Platform Mobile Application Engineering (12 Weeks)
7. **NVN-QA-07**: Software Testing & QA Automation Engineering (14 Weeks)
8. **NVN-DS-08**: Data Science, Big Data Analytics & Generative AI (16 Weeks)

---

## 🚀 How to Run

### Method 1: 1-Click Windows Launcher (.NET & SQL)
Double-click [`run_dotnet.bat`](run_dotnet.bat). It will start the ASP.NET Core server and automatically open `http://localhost:5000` in your browser.

### Method 2: Command Line (PowerShell / Terminal)
```bash
# Navigate to project folder
cd "C:\Users\kumar\.gemini\antigravity-ide\scratch\nvn-india-portal"

# Run with dotnet CLI
dotnet run --urls "http://localhost:5000"
```
Then open `http://localhost:5000` in your browser.

### Running Automated Test Suite
```bash
python test_portal.py
```

---

## 🌐 REST API Endpoints (.NET ASP.NET Core)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & active SQL engine status |
| `GET` | `/api/stats` | Real-time aggregate platform statistics |
| `GET` | `/api/courses` | List all 8 courses with 6-module JSON syllabi |
| `GET` | `/api/courses/{id}` | Detailed course syllabus by ID |
| `GET` | `/api/trainees` | List registered trainees |
| `GET` | `/api/trainees/status?q={email}` | Track admission progress by email/phone/ID |
| `POST` | `/api/trainees` | Submit new trainee application |
| `GET` | `/api/staffing` | List "Worker for Client" requests |
| `POST` | `/api/staffing` | Submit new worker hiring request |
| `PATCH` | `/api/staffing/{id}` | Update staffing status (e.g. "Worker Deployed") |
| `DELETE` | `/api/staffing/{id}` | Remove staffing record |
| `GET` | `/api/placements` | Alumni Placements Hall of Fame |
| `POST` | `/api/placements` | Add alumni placement record |
| `GET` | `/api/projects` | Sector software projects list |
| `POST` | `/api/projects` | Submit custom project proposal |
| `GET` | `/api/consultations` | IT Advisory & Architecture bookings |
| `POST` | `/api/consultations` | Book consultation session |
| `POST` | `/api/db/query` | Safe SQL Console Runner (SELECT queries) |
| `GET` | `/api/db/export?table={name}` | Export table records as CSV |
