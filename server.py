"""
NVN India Private LTD - High-Performance Web Application & REST API Server
Built with Python Flask, SQLite, and Vanilla Frontend.
"""

import os
import sys
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import database

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

app = Flask(__name__, static_folder=STATIC_DIR)
CORS(app)  # Allow cross-origin requests for API flexibility

# Initialize database on startup
database.init_db()

# ----------------- Frontend Static Routes -----------------

@app.route("/")
def serve_index():
    return send_from_directory(STATIC_DIR, "index.html")

@app.route("/<path:filename>")
def serve_static(filename):
    return send_from_directory(STATIC_DIR, filename)

# ----------------- REST API Endpoints -----------------

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "NVN India Private LTD Portal Backend",
        "database": "SQLite 3 Connected",
        "version": "1.0.0"
    }), 200

@app.route("/api/stats", methods=["GET"])
def get_stats():
    try:
        stats = database.get_stats()
        return jsonify({"success": True, "data": stats}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/courses", methods=["GET"])
def get_courses():
    try:
        featured_only = request.args.get("featured", "false").lower() == "true"
        courses = database.get_courses(featured_only=featured_only)
        return jsonify({"success": True, "count": len(courses), "data": courses}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Trainee / Student Academy Endpoints
@app.route("/api/trainees", methods=["GET", "POST"])
def trainees_handler():
    if request.method == "GET":
        try:
            trainees = database.get_trainees()
            return jsonify({"success": True, "count": len(trainees), "data": trainees}), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    elif request.method == "POST":
        try:
            data = request.get_json(force=True) or {}
            if not data.get("full_name") or not data.get("email") or not data.get("phone"):
                return jsonify({"success": False, "error": "Full Name, Email, and Phone are required."}), 400

            new_id = database.add_trainee(data)
            return jsonify({
                "success": True,
                "message": "Student application successfully submitted to NVN Tech Academy!",
                "id": new_id
            }), 201
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/trainees/<int:trainee_id>", methods=["PATCH", "DELETE"])
def trainee_item_handler(trainee_id):
    if request.method == "PATCH":
        try:
            data = request.get_json(force=True) or {}
            new_status = data.get("status")
            if not new_status:
                return jsonify({"success": False, "error": "Status is required."}), 400
            database.update_trainee_status(trainee_id, new_status)
            return jsonify({"success": True, "message": f"Trainee status updated to {new_status}."}), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    elif request.method == "DELETE":
        try:
            database.delete_trainee(trainee_id)
            return jsonify({"success": True, "message": "Trainee record deleted."}), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

# IT Consultancy Endpoints
@app.route("/api/consultations", methods=["GET", "POST"])
def consultations_handler():
    if request.method == "GET":
        try:
            consultations = database.get_consultations()
            return jsonify({"success": True, "count": len(consultations), "data": consultations}), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    elif request.method == "POST":
        try:
            data = request.get_json(force=True) or {}
            if not data.get("client_name") or not data.get("email") or not data.get("requirements"):
                return jsonify({"success": False, "error": "Client Name, Email, and Requirements are required."}), 400

            new_id = database.add_consultation(data)
            return jsonify({
                "success": True,
                "message": "Consultation booking request received. Our senior IT architects will connect shortly.",
                "id": new_id
            }), 201
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/consultations/<int:consultation_id>", methods=["PATCH", "DELETE"])
def consultation_item_handler(consultation_id):
    if request.method == "PATCH":
        try:
            data = request.get_json(force=True) or {}
            new_status = data.get("status")
            if not new_status:
                return jsonify({"success": False, "error": "Status is required."}), 400
            database.update_consultation_status(consultation_id, new_status)
            return jsonify({"success": True, "message": f"Consultation status updated to {new_status}."}), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    elif request.method == "DELETE":
        try:
            database.delete_consultation(consultation_id)
            return jsonify({"success": True, "message": "Consultation record deleted."}), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

# Multi-Sector Projects Endpoints
@app.route("/api/projects", methods=["GET", "POST"])
def projects_handler():
    if request.method == "GET":
        try:
            sector = request.args.get("sector")
            projects = database.get_projects(sector=sector)
            return jsonify({"success": True, "count": len(projects), "data": projects}), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    elif request.method == "POST":
        try:
            data = request.get_json(force=True) or {}
            if not data.get("client_name") or not data.get("email") or not data.get("project_title"):
                return jsonify({"success": False, "error": "Client Name, Email, and Project Title are required."}), 400

            new_id = database.add_project(data)
            return jsonify({
                "success": True,
                "message": "Project proposal received! Our solution engineering team will prepare an RFP estimate.",
                "id": new_id
            }), 201
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/projects/<int:project_id>", methods=["PATCH", "DELETE"])
def project_item_handler(project_id):
    if request.method == "PATCH":
        try:
            data = request.get_json(force=True) or {}
            new_status = data.get("status")
            if not new_status:
                return jsonify({"success": False, "error": "Status is required."}), 400
            database.update_project_status(project_id, new_status)
            return jsonify({"success": True, "message": f"Project status updated to {new_status}."}), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    elif request.method == "DELETE":
        try:
            database.delete_project(project_id)
            return jsonify({"success": True, "message": "Project record deleted."}), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

# Inquiries / Contact Messages Endpoints
@app.route("/api/inquiries", methods=["GET", "POST"])
def inquiries_handler():
    if request.method == "GET":
        try:
            inquiries = database.get_inquiries()
            return jsonify({"success": True, "count": len(inquiries), "data": inquiries}), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    elif request.method == "POST":
        try:
            data = request.get_json(force=True) or {}
            if not data.get("sender_name") or not data.get("email") or not data.get("message"):
                return jsonify({"success": False, "error": "Name, Email, and Message are required."}), 400

            new_id = database.add_inquiry(data)
            return jsonify({
                "success": True,
                "message": "Thank you! Your message has been stored in our system.",
                "id": new_id
            }), 201
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/inquiries/<int:inquiry_id>", methods=["PATCH", "DELETE"])
def inquiry_item_handler(inquiry_id):
    if request.method == "PATCH":
        try:
            data = request.get_json(force=True) or {}
            new_status = data.get("status")
            if not new_status:
                return jsonify({"success": False, "error": "Status is required."}), 400
            database.update_inquiry_status(inquiry_id, new_status)
            return jsonify({"success": True, "message": f"Inquiry status updated to {new_status}."}), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    elif request.method == "DELETE":
        try:
            database.delete_inquiry(inquiry_id)
            return jsonify({"success": True, "message": "Inquiry record deleted."}), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/courses/<int:course_id>", methods=["GET"])
def get_course_detail(course_id):
    try:
        course = database.get_course_by_id(course_id)
        if not course:
            return jsonify({"success": False, "error": "Course not found"}), 404
        return jsonify({"success": True, "data": course}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/trainees/status", methods=["GET"])
def get_trainee_status_handler():
    try:
        query = (request.args.get("query") or request.args.get("q") or "").strip()
        if not query:
            return jsonify({"success": False, "error": "Query parameter (email or application ID) is required."}), 400
        
        trainee = database.get_trainee_status(query)
        if not trainee:
            return jsonify({"success": False, "error": f"No trainee record found matching '{query}'. Please check your ID or registered email."}), 404
            
        return jsonify({"success": True, "data": trainee}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Client Staffing / Dedicated Tech Workers ("Worker for Client") Endpoints
@app.route("/api/staffing", methods=["GET", "POST"])
def staffing_handler():
    if request.method == "GET":
        try:
            requests_list = database.get_staffing_requests()
            return jsonify({"success": True, "count": len(requests_list), "data": requests_list}), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    elif request.method == "POST":
        try:
            data = request.get_json(force=True) or {}
            if not data.get("client_name") or not data.get("email") or not data.get("role_required"):
                return jsonify({"success": False, "error": "Client Name, Email, and Required Role are required."}), 400

            new_id = database.add_staffing_request(data)
            return jsonify({
                "success": True,
                "message": "Staffing inquiry received! Our talent acquisition team in Jammalamadugu will share vetted developer profiles within 24-48 hours.",
                "id": new_id
            }), 201
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/staffing/<int:request_id>", methods=["PATCH", "DELETE"])
def staffing_item_handler(request_id):
    if request.method == "PATCH":
        try:
            data = request.get_json(force=True) or {}
            new_status = data.get("status")
            if not new_status:
                return jsonify({"success": False, "error": "Status is required."}), 400
            database.update_staffing_status(request_id, new_status)
            return jsonify({"success": True, "message": f"Staffing status updated to {new_status}."}), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    elif request.method == "DELETE":
        try:
            database.delete_staffing_request(request_id)
            return jsonify({"success": True, "message": "Staffing record deleted."}), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

# Placements & Alumni Endpoints
@app.route("/api/placements", methods=["GET", "POST"])
def placements_handler():
    if request.method == "GET":
        try:
            placements = database.get_placements()
            return jsonify({"success": True, "count": len(placements), "data": placements}), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    elif request.method == "POST":
        try:
            data = request.get_json(force=True) or {}
            if not data.get("student_name") or not data.get("company_placed"):
                return jsonify({"success": False, "error": "Student Name and Company Placed are required."}), 400

            new_id = database.add_placement(data)
            return jsonify({
                "success": True,
                "message": "Placement record successfully published to the Hall of Fame!",
                "id": new_id
            }), 201
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

# Database diagnostics, Custom SQL Runner & Export
@app.route("/api/db/query", methods=["POST"])
def db_query_handler():
    try:
        payload = request.get_json(force=True) or {}
        sql = payload.get("query", "")
        if not sql:
            return jsonify({"success": False, "error": "SQL query is required."}), 400
        result = database.execute_sql_query(sql)
        return jsonify(result), 200 if result.get("success") else 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/db/export", methods=["GET"])
def db_export():
    try:
        data = database.export_all_data()
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/db/reset", methods=["POST"])
def db_reset():
    try:
        database.reset_db()
        return jsonify({"success": True, "message": "Database reset and seeded with default enterprise records."}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"================================================================")
    print(f" NVN India Private LTD - IT Solutions & Tech Academy Web Portal ")
    print(f" Server running at: http://localhost:{port}")
    print(f" Database File: {database.DB_FILE}")
    print(f"================================================================")
    app.run(host="0.0.0.0", port=port, debug=False)
