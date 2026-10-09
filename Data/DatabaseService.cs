using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NVNIndiaPortal.Models;

namespace NVNIndiaPortal.Data
{
    public class DatabaseService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<DatabaseService> _logger;
        private readonly string _sqlServerConn;
        private readonly string _sqliteConn;
        private readonly string _preferredProvider;
        private string _activeEngine = "Unknown";
        private bool _isInitialized = false;

        public DatabaseService(IConfiguration config, ILogger<DatabaseService> logger)
        {
            DefaultTypeMap.MatchNamesWithUnderscores = true;
            _config = config;
            _logger = logger;
            _sqlServerConn = _config.GetConnectionString("SqlServer") ?? "Server=(localdb)\\MSSQLLocalDB;Database=NVNIndiaPortal;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true;Connect Timeout=5";
            _sqliteConn = _config.GetConnectionString("Sqlite") ?? "Data Source=nvn_india.db";
            _preferredProvider = _config.GetValue<string>("DatabaseSettings:PreferredProvider") ?? "SqlServer";
        }

        public string ActiveEngine => _activeEngine;

        public async Task InitializeAsync()
        {
            if (_isInitialized) return;

            // Attempt Preferred Provider first
            if (string.Equals(_preferredProvider, "SqlServer", StringComparison.OrdinalIgnoreCase))
            {
                try
                {
                    _logger.LogInformation("Testing Microsoft SQL Server connection...");
                    using (var masterConn = new SqlConnection("Server=(localdb)\\MSSQLLocalDB;Database=master;Trusted_Connection=True;TrustServerCertificate=True;Connect Timeout=5"))
                    {
                        await masterConn.OpenAsync();
                        // Create database if not exists
                        await masterConn.ExecuteAsync(@"
                            IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'NVNIndiaPortal')
                            BEGIN
                                CREATE DATABASE [NVNIndiaPortal];
                            END");
                    }

                    using (var dbConn = new SqlConnection(_sqlServerConn))
                    {
                        await dbConn.OpenAsync();
                        await EnsureSqlServerSchemaAsync(dbConn);
                        await SeedSqlServerDataIfEmptyAsync(dbConn);
                    }

                    _activeEngine = "Microsoft SQL Server (LocalDB)";
                    _logger.LogInformation("Successfully initialized Microsoft SQL Server engine.");
                    _isInitialized = true;
                    return;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning("SQL Server initialization error ({Message}). Falling back to SQLite SQL Engine.", ex.Message);
                }
            }

            // Fallback to SQLite
            try
            {
                using (var sqliteConn = new SqliteConnection(_sqliteConn))
                {
                    await sqliteConn.OpenAsync();
                    await EnsureSqliteSchemaAsync(sqliteConn);
                }
                _activeEngine = "SQLite 3 Relational SQL Engine";
                _logger.LogInformation("Successfully connected to SQLite SQL Engine.");
                _isInitialized = true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to initialize SQLite SQL Engine.");
                _activeEngine = "Fallback In-Memory";
            }
        }

        public DbConnection CreateConnection()
        {
            if (_activeEngine.Contains("SQL Server", StringComparison.OrdinalIgnoreCase))
            {
                return new SqlConnection(_sqlServerConn);
            }
            return new SqliteConnection(_sqliteConn);
        }

        private async Task EnsureSqlServerSchemaAsync(SqlConnection conn)
        {
            string schemaSql = @"
                IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'courses')
                CREATE TABLE courses (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    code NVARCHAR(50) UNIQUE NOT NULL,
                    title NVARCHAR(200) NOT NULL,
                    category NVARCHAR(100) NOT NULL,
                    duration NVARCHAR(50) NOT NULL,
                    mode NVARCHAR(100) NOT NULL DEFAULT 'Hybrid (Online + Lab)',
                    description NVARCHAR(MAX) NOT NULL,
                    technologies NVARCHAR(500) NOT NULL,
                    eligibility NVARCHAR(300) NOT NULL,
                    training_model NVARCHAR(150) DEFAULT '100% Industry-Sponsored / Merit-Based',
                    modules_count INT DEFAULT 6,
                    syllabus_json NVARCHAR(MAX),
                    featured INT DEFAULT 1,
                    created_at DATETIME2 DEFAULT GETDATE()
                );

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'trainees')
                CREATE TABLE trainees (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    full_name NVARCHAR(150) NOT NULL,
                    email NVARCHAR(150) NOT NULL,
                    phone NVARCHAR(50) NOT NULL,
                    education NVARCHAR(150) NOT NULL,
                    course_id INT,
                    course_name NVARCHAR(200) NOT NULL,
                    batch_mode NVARCHAR(50) NOT NULL DEFAULT 'Online',
                    experience_level NVARCHAR(100) DEFAULT 'Student / Fresher',
                    statement NVARCHAR(MAX),
                    status NVARCHAR(100) NOT NULL DEFAULT 'Applied',
                    assigned_mentor NVARCHAR(150) DEFAULT 'Senior Solutions Architect',
                    next_milestone NVARCHAR(200) DEFAULT 'Technical Screening & Orientation',
                    created_at DATETIME2 DEFAULT GETDATE()
                );

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'consultations')
                CREATE TABLE consultations (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    client_name NVARCHAR(150) NOT NULL,
                    organization NVARCHAR(200) NOT NULL,
                    email NVARCHAR(150) NOT NULL,
                    phone NVARCHAR(50) NOT NULL,
                    consultancy_domain NVARCHAR(150) NOT NULL,
                    preferred_date NVARCHAR(50),
                    budget_range NVARCHAR(100),
                    requirements NVARCHAR(MAX) NOT NULL,
                    status NVARCHAR(100) NOT NULL DEFAULT 'Pending',
                    created_at DATETIME2 DEFAULT GETDATE()
                );

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'projects')
                CREATE TABLE projects (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    client_name NVARCHAR(150) NOT NULL,
                    organization NVARCHAR(200) NOT NULL,
                    email NVARCHAR(150) NOT NULL,
                    phone NVARCHAR(50),
                    sector NVARCHAR(100) NOT NULL,
                    project_title NVARCHAR(250) NOT NULL,
                    scope_description NVARCHAR(MAX) NOT NULL,
                    target_timeline NVARCHAR(100),
                    budget_range NVARCHAR(100),
                    architecture_spec NVARCHAR(MAX),
                    status NVARCHAR(100) NOT NULL DEFAULT 'Proposal Received',
                    created_at DATETIME2 DEFAULT GETDATE()
                );

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'inquiries')
                CREATE TABLE inquiries (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    sender_name NVARCHAR(150) NOT NULL,
                    email NVARCHAR(150) NOT NULL,
                    phone NVARCHAR(50),
                    subject NVARCHAR(250) NOT NULL,
                    message NVARCHAR(MAX) NOT NULL,
                    status NVARCHAR(50) NOT NULL DEFAULT 'New',
                    created_at DATETIME2 DEFAULT GETDATE()
                );

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'staffing_requests')
                CREATE TABLE staffing_requests (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    client_name NVARCHAR(150) NOT NULL,
                    company_name NVARCHAR(200) NOT NULL,
                    email NVARCHAR(150) NOT NULL,
                    phone NVARCHAR(50) NOT NULL,
                    role_required NVARCHAR(150) NOT NULL,
                    experience_level NVARCHAR(100) DEFAULT 'Mid-Level (3-5 yrs)',
                    engagement_model NVARCHAR(150) DEFAULT 'Dedicated Full-Time Worker',
                    developers_count INT DEFAULT 1,
                    duration_months INT DEFAULT 6,
                    budget_range NVARCHAR(100),
                    requirements NVARCHAR(MAX) NOT NULL,
                    status NVARCHAR(100) NOT NULL DEFAULT 'Inquiry Received',
                    created_at DATETIME2 DEFAULT GETDATE()
                );

                IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'placements')
                CREATE TABLE placements (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    student_name NVARCHAR(150) NOT NULL,
                    course_completed NVARCHAR(200) NOT NULL,
                    company_placed NVARCHAR(200) NOT NULL,
                    role_title NVARCHAR(150) NOT NULL,
                    package_ctc NVARCHAR(100) NOT NULL,
                    location NVARCHAR(150) NOT NULL,
                    placed_year INT DEFAULT 2026,
                    hometown NVARCHAR(150) DEFAULT 'Jammalamadugu / Kadapa',
                    testimonial NVARCHAR(MAX),
                    created_at DATETIME2 DEFAULT GETDATE()
                );";

            await conn.ExecuteAsync(schemaSql);
        }

        private async Task EnsureSqliteSchemaAsync(SqliteConnection conn)
        {
            if (File.Exists("schema.sql"))
            {
                string schema = await File.ReadAllTextAsync("schema.sql");
                await conn.ExecuteAsync(schema);
            }
        }

        private async Task SeedSqlServerDataIfEmptyAsync(SqlConnection conn)
        {
            int validCount = await conn.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM courses WHERE syllabus_json IS NOT NULL AND LEN(CAST(syllabus_json AS NVARCHAR(MAX))) > 20");
            if (validCount >= 8) return;

            // Clear old courses table to re-seed with full curricula
            await conn.ExecuteAsync("DELETE FROM courses;");

            // Copy seed records from existing SQLite db if present
            if (File.Exists("nvn_india.db"))
            {
                using var sqlite = new SqliteConnection(_sqliteConn);
                await sqlite.OpenAsync();

                var courses = await sqlite.QueryAsync<Course>("SELECT * FROM courses");
                foreach (var c in courses)
                {
                    await conn.ExecuteAsync(@"
                        INSERT INTO courses (code, title, category, duration, mode, description, technologies, eligibility, training_model, modules_count, syllabus_json, featured)
                        VALUES (@Code, @Title, @Category, @Duration, @Mode, @Description, @Technologies, @Eligibility, @TrainingModel, @ModulesCount, @SyllabusJson, @Featured)", c);
                }

                // Check and seed trainees
                int validTrainees = await conn.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM trainees WHERE full_name != '' AND full_name IS NOT NULL");
                if (validTrainees < 5)
                {
                    await conn.ExecuteAsync("DELETE FROM trainees;");
                    var trainees = await sqlite.QueryAsync<Trainee>("SELECT * FROM trainees");
                    foreach (var t in trainees)
                    {
                        await conn.ExecuteAsync(@"
                            INSERT INTO trainees (full_name, email, phone, education, course_id, course_name, batch_mode, experience_level, statement, status, assigned_mentor, next_milestone)
                            VALUES (@FullName, @Email, @Phone, @Education, @CourseId, @CourseName, @BatchMode, @ExperienceLevel, @Statement, @Status, @AssignedMentor, @NextMilestone)", t);
                    }
                }

                // Check and seed consultations
                int validConsultations = await conn.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM consultations WHERE client_name != '' AND client_name IS NOT NULL");
                if (validConsultations < 4)
                {
                    await conn.ExecuteAsync("DELETE FROM consultations;");
                    var consultations = await sqlite.QueryAsync<Consultation>("SELECT * FROM consultations");
                    foreach (var c in consultations)
                    {
                        await conn.ExecuteAsync(@"
                            INSERT INTO consultations (client_name, organization, email, phone, consultancy_domain, preferred_date, budget_range, requirements, status)
                            VALUES (@ClientName, @Organization, @Email, @Phone, @ConsultancyDomain, @PreferredDate, @BudgetRange, @Requirements, @Status)", c);
                    }
                }

                // Check and seed projects
                int validProjects = await conn.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM projects WHERE project_title != '' AND project_title IS NOT NULL");
                if (validProjects < 6)
                {
                    await conn.ExecuteAsync("DELETE FROM projects;");
                    var projects = await sqlite.QueryAsync<Project>("SELECT * FROM projects");
                    foreach (var p in projects)
                    {
                        await conn.ExecuteAsync(@"
                            INSERT INTO projects (client_name, organization, email, phone, sector, project_title, scope_description, target_timeline, budget_range, architecture_spec, status)
                            VALUES (@ClientName, @Organization, @Email, @Phone, @Sector, @ProjectTitle, @ScopeDescription, @TargetTimeline, @BudgetRange, @ArchitectureSpec, @Status)", p);
                    }
                }

                // Check and seed staffing requests
                int validStaffing = await conn.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM staffing_requests WHERE client_name != '' AND client_name IS NOT NULL");
                if (validStaffing < 3)
                {
                    await conn.ExecuteAsync("DELETE FROM staffing_requests;");
                    var staffing = await sqlite.QueryAsync<StaffingRequest>("SELECT * FROM staffing_requests");
                    foreach (var s in staffing)
                    {
                        await conn.ExecuteAsync(@"
                            INSERT INTO staffing_requests (client_name, company_name, email, phone, role_required, experience_level, engagement_model, developers_count, duration_months, budget_range, requirements, status)
                            VALUES (@ClientName, @CompanyName, @Email, @Phone, @RoleRequired, @ExperienceLevel, @EngagementModel, @DevelopersCount, @DurationMonths, @BudgetRange, @Requirements, @Status)", s);
                    }
                }

                // Check and seed placements
                int validPlacements = await conn.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM placements WHERE student_name != '' AND student_name IS NOT NULL");
                if (validPlacements < 8)
                {
                    await conn.ExecuteAsync("DELETE FROM placements;");
                    var placements = await sqlite.QueryAsync<Placement>("SELECT * FROM placements");
                    foreach (var pl in placements)
                    {
                        await conn.ExecuteAsync(@"
                            INSERT INTO placements (student_name, course_completed, company_placed, role_title, package_ctc, location, placed_year, hometown, testimonial)
                            VALUES (@StudentName, @CourseCompleted, @CompanyPlaced, @RoleTitle, @PackageCtc, @Location, @PlacedYear, @Hometown, @Testimonial)", pl);
                    }
                }

                // Check and seed inquiries
                int validInquiries = await conn.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM inquiries");
                if (validInquiries < 3)
                {
                    await conn.ExecuteAsync("DELETE FROM inquiries;");
                    var inquiries = await sqlite.QueryAsync<Inquiry>("SELECT * FROM inquiries");
                    foreach (var inq in inquiries)
                    {
                        await conn.ExecuteAsync(@"
                            INSERT INTO inquiries (sender_name, email, phone, subject, message, status)
                            VALUES (@SenderName, @Email, @Phone, @Subject, @Message, @Status)", inq);
                    }
                }
            }
        }

        // ==================== Public CRUD Methods ====================

        public async Task<List<Course>> GetCoursesAsync()
        {
            using var conn = CreateConnection();
            var list = (await conn.QueryAsync<Course>("SELECT * FROM courses ORDER BY id ASC")).ToList();
            foreach (var item in list)
            {
                if (!string.IsNullOrEmpty(item.SyllabusJson))
                {
                    try
                    {
                        item.Syllabus = JsonSerializer.Deserialize<object>(item.SyllabusJson);
                    }
                    catch { }
                }
            }
            return list;
        }

        public async Task<Course?> GetCourseByIdAsync(int id)
        {
            using var conn = CreateConnection();
            var course = await conn.QueryFirstOrDefaultAsync<Course>("SELECT * FROM courses WHERE id = @Id", new { Id = id });
            if (course != null && !string.IsNullOrEmpty(course.SyllabusJson))
            {
                try
                {
                    course.Syllabus = JsonSerializer.Deserialize<object>(course.SyllabusJson);
                }
                catch { }
            }
            return course;
        }

        public async Task<List<Trainee>> GetTraineesAsync()
        {
            using var conn = CreateConnection();
            return (await conn.QueryAsync<Trainee>("SELECT * FROM trainees ORDER BY id DESC")).ToList();
        }

        public async Task<Trainee?> GetTraineeStatusAsync(string query)
        {
            using var conn = CreateConnection();
            string sql = "SELECT * FROM trainees WHERE LOWER(email) = LOWER(@Q) OR LOWER(full_name) = LOWER(@Q) OR phone = @Q";
            if (int.TryParse(query, out int numId))
            {
                sql = "SELECT * FROM trainees WHERE id = @NumId OR LOWER(email) = LOWER(@Q) OR phone = @Q";
                return await conn.QueryFirstOrDefaultAsync<Trainee>(sql, new { NumId = numId, Q = query.Trim() });
            }
            return await conn.QueryFirstOrDefaultAsync<Trainee>(sql, new { Q = query.Trim() });
        }

        public async Task<int> AddTraineeAsync(Trainee t)
        {
            using var conn = CreateConnection();
            string sql = @"
                INSERT INTO trainees (full_name, email, phone, education, course_id, course_name, batch_mode, experience_level, statement, status, assigned_mentor, next_milestone)
                VALUES (@FullName, @Email, @Phone, @Education, @CourseId, @CourseName, @BatchMode, @ExperienceLevel, @Statement, @Status, @AssignedMentor, @NextMilestone);
                SELECT " + (_activeEngine.Contains("SQL Server") ? "CAST(SCOPE_IDENTITY() AS INT);" : "last_insert_rowid();");
            return await conn.ExecuteScalarAsync<int>(sql, t);
        }

        public async Task<List<Consultation>> GetConsultationsAsync()
        {
            using var conn = CreateConnection();
            return (await conn.QueryAsync<Consultation>("SELECT * FROM consultations ORDER BY id DESC")).ToList();
        }

        public async Task<int> AddConsultationAsync(Consultation c)
        {
            using var conn = CreateConnection();
            string sql = @"
                INSERT INTO consultations (client_name, organization, email, phone, consultancy_domain, preferred_date, budget_range, requirements, status)
                VALUES (@ClientName, @Organization, @Email, @Phone, @ConsultancyDomain, @PreferredDate, @BudgetRange, @Requirements, @Status);
                SELECT " + (_activeEngine.Contains("SQL Server") ? "CAST(SCOPE_IDENTITY() AS INT);" : "last_insert_rowid();");
            return await conn.ExecuteScalarAsync<int>(sql, c);
        }

        public async Task<List<Project>> GetProjectsAsync()
        {
            using var conn = CreateConnection();
            return (await conn.QueryAsync<Project>("SELECT * FROM projects ORDER BY id DESC")).ToList();
        }

        public async Task<int> AddProjectAsync(Project p)
        {
            using var conn = CreateConnection();
            string sql = @"
                INSERT INTO projects (client_name, organization, email, phone, sector, project_title, scope_description, target_timeline, budget_range, architecture_spec, status)
                VALUES (@ClientName, @Organization, @Email, @Phone, @Sector, @ProjectTitle, @ScopeDescription, @TargetTimeline, @BudgetRange, @ArchitectureSpec, @Status);
                SELECT " + (_activeEngine.Contains("SQL Server") ? "CAST(SCOPE_IDENTITY() AS INT);" : "last_insert_rowid();");
            return await conn.ExecuteScalarAsync<int>(sql, p);
        }

        public async Task<List<Inquiry>> GetInquiriesAsync()
        {
            using var conn = CreateConnection();
            return (await conn.QueryAsync<Inquiry>("SELECT * FROM inquiries ORDER BY id DESC")).ToList();
        }

        public async Task<int> AddInquiryAsync(Inquiry inq)
        {
            using var conn = CreateConnection();
            string sql = @"
                INSERT INTO inquiries (sender_name, email, phone, subject, message, status)
                VALUES (@SenderName, @Email, @Phone, @Subject, @Message, @Status);
                SELECT " + (_activeEngine.Contains("SQL Server") ? "CAST(SCOPE_IDENTITY() AS INT);" : "last_insert_rowid();");
            return await conn.ExecuteScalarAsync<int>(sql, inq);
        }

        public async Task<List<StaffingRequest>> GetStaffingRequestsAsync()
        {
            using var conn = CreateConnection();
            return (await conn.QueryAsync<StaffingRequest>("SELECT * FROM staffing_requests ORDER BY id DESC")).ToList();
        }

        public async Task<int> AddStaffingRequestAsync(StaffingRequest req)
        {
            using var conn = CreateConnection();
            string sql = @"
                INSERT INTO staffing_requests (client_name, company_name, email, phone, role_required, experience_level, engagement_model, developers_count, duration_months, budget_range, requirements, status)
                VALUES (@ClientName, @CompanyName, @Email, @Phone, @RoleRequired, @ExperienceLevel, @EngagementModel, @DevelopersCount, @DurationMonths, @BudgetRange, @Requirements, @Status);
                SELECT " + (_activeEngine.Contains("SQL Server") ? "CAST(SCOPE_IDENTITY() AS INT);" : "last_insert_rowid();");
            return await conn.ExecuteScalarAsync<int>(sql, req);
        }

        public async Task<bool> UpdateStaffingStatusAsync(int id, string status)
        {
            using var conn = CreateConnection();
            int rows = await conn.ExecuteAsync("UPDATE staffing_requests SET status = @Status WHERE id = @Id", new { Id = id, Status = status });
            return rows > 0;
        }

        public async Task<bool> DeleteStaffingRequestAsync(int id)
        {
            using var conn = CreateConnection();
            int rows = await conn.ExecuteAsync("DELETE FROM staffing_requests WHERE id = @Id", new { Id = id });
            return rows > 0;
        }

        public async Task<List<Placement>> GetPlacementsAsync()
        {
            using var conn = CreateConnection();
            return (await conn.QueryAsync<Placement>("SELECT * FROM placements ORDER BY id ASC")).ToList();
        }

        public async Task<int> AddPlacementAsync(Placement pl)
        {
            using var conn = CreateConnection();
            string sql = @"
                INSERT INTO placements (student_name, course_completed, company_placed, role_title, package_ctc, location, placed_year, hometown, testimonial)
                VALUES (@StudentName, @CourseCompleted, @CompanyPlaced, @RoleTitle, @PackageCtc, @Location, @PlacedYear, @Hometown, @Testimonial);
                SELECT " + (_activeEngine.Contains("SQL Server") ? "CAST(SCOPE_IDENTITY() AS INT);" : "last_insert_rowid();");
            return await conn.ExecuteScalarAsync<int>(sql, pl);
        }

        public async Task<StatsDto> GetStatsAsync()
        {
            using var conn = CreateConnection();
            var stats = new StatsDto
            {
                Headquarters = "Jammalamadugu, Andhra Pradesh",
                Engine = $"{_activeEngine} (.NET 10.0)",
                TotalCourses = await conn.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM courses"),
                TotalTrainees = await conn.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM trainees"),
                EnrolledTrainees = await conn.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM trainees WHERE status IN ('Enrolled', 'Shortlisted')"),
                PlacedTrainees = await conn.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM trainees WHERE status = 'Placed'"),
                TotalProjects = await conn.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM projects"),
                DeliveredProjects = await conn.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM projects WHERE status = 'Delivered'"),
                TotalConsultations = await conn.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM consultations"),
                InquiriesCount = await conn.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM inquiries"),
                StaffingRequestsCount = await conn.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM staffing_requests"),
                ActiveWorkersCount = 28,
                PlacementsCount = 528,
                HiringPartnersCount = 85
            };
            stats.CoursesCount = stats.TotalCourses;
            stats.TraineesCount = stats.TotalTrainees;
            stats.ProjectsCount = stats.TotalProjects;
            stats.ConsultationsCount = stats.TotalConsultations;
            return stats;
        }

        public async Task<SqlQueryResponse> ExecuteRawSelectQueryAsync(string query)
        {
            var res = new SqlQueryResponse();
            if (string.IsNullOrWhiteSpace(query))
            {
                res.Success = false;
                res.Message = "Query string cannot be empty.";
                return res;
            }

            string trimmed = query.Trim();
            if (!trimmed.StartsWith("SELECT", StringComparison.OrdinalIgnoreCase))
            {
                res.Success = false;
                res.Message = "Security Restriction: Only SELECT queries are permitted in the web diagnostic console.";
                return res;
            }

            try
            {
                using var conn = CreateConnection();
                await conn.OpenAsync();
                using var cmd = conn.CreateCommand();
                cmd.CommandText = trimmed;
                using var reader = await cmd.ExecuteReaderAsync();

                for (int i = 0; i < reader.FieldCount; i++)
                {
                    res.Columns.Add(reader.GetName(i));
                }

                while (await reader.ReadAsync())
                {
                    var row = new Dictionary<string, object?>();
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        var colName = reader.GetName(i);
                        row[colName] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                    }
                    res.Rows.Add(row);
                }

                res.RowCount = res.Rows.Count;
                res.Success = true;
                res.Message = $"Query executed successfully. Returned {res.RowCount} rows from {_activeEngine}.";
            }
            catch (Exception ex)
            {
                res.Success = false;
                res.Message = $"SQL Execution Error: {ex.Message}";
            }

            return res;
        }

        public async Task<string> ExportTableCsvAsync(string table)
        {
            var allowed = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                "courses", "trainees", "consultations", "projects", "inquiries", "staffing_requests", "placements"
            };

            if (!allowed.Contains(table))
            {
                throw new ArgumentException("Invalid table specified for export.");
            }

            using var conn = CreateConnection();
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = $"SELECT * FROM {table}";
            using var reader = await cmd.ExecuteReaderAsync();

            var sb = new StringBuilder();
            var cols = new List<string>();
            for (int i = 0; i < reader.FieldCount; i++)
            {
                cols.Add(reader.GetName(i));
            }
            sb.AppendLine(string.Join(",", cols));

            while (await reader.ReadAsync())
            {
                var values = new List<string>();
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    if (reader.IsDBNull(i))
                    {
                        values.Add("\"\"");
                    }
                    else
                    {
                        string val = reader.GetValue(i).ToString()?.Replace("\"", "\"\"") ?? "";
                        values.Add($"\"{val}\"");
                    }
                }
                sb.AppendLine(string.Join(",", values));
            }

            return sb.ToString();
        }
    }
}
