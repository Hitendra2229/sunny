using System;
using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NVNIndiaPortal.Data;
using NVNIndiaPortal.Models;

var builder = WebApplication.CreateBuilder(args);

// Add Services
builder.Services.AddSingleton<DatabaseService>();
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
    options.SerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseLower;
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Initialize Database on Startup (SQL Server / SQLite)
var dbService = app.Services.GetRequiredService<DatabaseService>();
await dbService.InitializeAsync();

// Middleware
app.UseCors("AllowAll");
app.UseDefaultFiles(); // Serves wwwroot/index.html on root '/'
app.UseStaticFiles();  // Serves wwwroot/css, js, images

// ==================== REST API ENDPOINTS ====================

// 1. Health & Engine Diagnostics
app.MapGet("/api/health", () =>
{
    return Results.Ok(new
    {
        status = "healthy",
        company = "NVN India Private Limited",
        headquarters = "Jammalamadugu, Andhra Pradesh",
        framework = ".NET 10.0 ASP.NET Core",
        engine = dbService.ActiveEngine,
        timestamp = DateTime.UtcNow.ToString("o")
    });
});

// 2. Real-Time Aggregate Stats
app.MapGet("/api/stats", async () =>
{
    var stats = await dbService.GetStatsAsync();
    return Results.Ok(new { success = true, data = stats });
});

// 3. All Courses Training Tracks
app.MapGet("/api/courses", async () =>
{
    var courses = await dbService.GetCoursesAsync();
    return Results.Ok(new { success = true, data = courses, total = courses.Count });
});

app.MapGet("/api/courses/{id:int}", async (int id) =>
{
    var course = await dbService.GetCourseByIdAsync(id);
    if (course == null) return Results.NotFound(new { success = false, error = "Course not found." });
    return Results.Ok(new { success = true, data = course });
});

// 4. Trainee Registrations & Tracker
app.MapGet("/api/trainees", async () =>
{
    var trainees = await dbService.GetTraineesAsync();
    return Results.Ok(new { success = true, data = trainees, total = trainees.Count });
});

app.MapGet("/api/trainees/status", async (string? q) =>
{
    if (string.IsNullOrWhiteSpace(q))
    {
        return Results.BadRequest(new { success = false, error = "Please provide an email, phone, or application ID to track." });
    }
    var trainee = await dbService.GetTraineeStatusAsync(q);
    if (trainee == null)
    {
        return Results.NotFound(new { success = false, error = $"No admission record found for '{q}'. Verify your email or phone." });
    }
    return Results.Ok(new { success = true, data = trainee });
});

app.MapPost("/api/trainees", async (Trainee trainee) =>
{
    if (string.IsNullOrWhiteSpace(trainee.FullName) || string.IsNullOrWhiteSpace(trainee.Email) || string.IsNullOrWhiteSpace(trainee.CourseName))
    {
        return Results.BadRequest(new { success = false, error = "Full name, email, and course name are required." });
    }
    int id = await dbService.AddTraineeAsync(trainee);
    trainee.Id = id;
    return Results.Created($"/api/trainees/{id}", new { success = true, id = id, message = "Application submitted successfully to Jammalamadugu Tech Academy.", data = trainee });
});

// 5. IT Advisory & Consultations
app.MapGet("/api/consultations", async () =>
{
    var list = await dbService.GetConsultationsAsync();
    return Results.Ok(new { success = true, data = list, total = list.Count });
});

app.MapPost("/api/consultations", async (Consultation consultation) =>
{
    if (string.IsNullOrWhiteSpace(consultation.ClientName) || string.IsNullOrWhiteSpace(consultation.Email) || string.IsNullOrWhiteSpace(consultation.Requirements))
    {
        return Results.BadRequest(new { success = false, error = "Client name, email, and requirements are required." });
    }
    int id = await dbService.AddConsultationAsync(consultation);
    consultation.Id = id;
    return Results.Created($"/api/consultations/{id}", new { success = true, id = id, message = "Consultation requested successfully. Our Solutions Architect will reach out within 24h.", data = consultation });
});

// 6. Sector Software Projects
app.MapGet("/api/projects", async () =>
{
    var projects = await dbService.GetProjectsAsync();
    return Results.Ok(new { success = true, data = projects, total = projects.Count });
});

app.MapPost("/api/projects", async (Project project) =>
{
    if (string.IsNullOrWhiteSpace(project.ClientName) || string.IsNullOrWhiteSpace(project.Email) || string.IsNullOrWhiteSpace(project.ProjectTitle) || string.IsNullOrWhiteSpace(project.ScopeDescription))
    {
        return Results.BadRequest(new { success = false, error = "Client name, email, title, and scope description are required." });
    }
    int id = await dbService.AddProjectAsync(project);
    project.Id = id;
    return Results.Created($"/api/projects/{id}", new { success = true, id = id, message = "Software project proposal received. Scoping documentation initiated.", data = project });
});

// 7. General Inquiries
app.MapGet("/api/inquiries", async () =>
{
    var inquiries = await dbService.GetInquiriesAsync();
    return Results.Ok(new { success = true, data = inquiries, total = inquiries.Count });
});

app.MapPost("/api/inquiries", async (Inquiry inq) =>
{
    if (string.IsNullOrWhiteSpace(inq.SenderName) || string.IsNullOrWhiteSpace(inq.Email) || string.IsNullOrWhiteSpace(inq.Message))
    {
        return Results.BadRequest(new { success = false, error = "Sender name, email, and message are required." });
    }
    int id = await dbService.AddInquiryAsync(inq);
    inq.Id = id;
    return Results.Created($"/api/inquiries/{id}", new { success = true, id = id, message = "Thank you. Your message has been routed to our Jammalamadugu team.", data = inq });
});

// 8. "Worker for Client" Staff Augmentation
app.MapGet("/api/staffing", async () =>
{
    var requests = await dbService.GetStaffingRequestsAsync();
    return Results.Ok(new { success = true, data = requests, total = requests.Count });
});

app.MapPost("/api/staffing", async (StaffingRequest req) =>
{
    if (string.IsNullOrWhiteSpace(req.ClientName) || string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.RoleRequired))
    {
        return Results.BadRequest(new { success = false, error = "Client name, email, and required developer role are required." });
    }
    int id = await dbService.AddStaffingRequestAsync(req);
    req.Id = id;
    return Results.Created($"/api/staffing/{id}", new { success = true, id = id, message = "Staffing inquiry received. Matching pre-vetted engineers for deployment within 48h.", data = req });
});

app.MapPatch("/api/staffing/{id:int}", async (int id, JsonElement body) =>
{
    string status = "Worker Deployed";
    if (body.TryGetProperty("status", out var statusProp))
    {
        status = statusProp.GetString() ?? status;
    }
    bool updated = await dbService.UpdateStaffingStatusAsync(id, status);
    if (!updated) return Results.NotFound(new { success = false, error = "Staffing request not found." });
    return Results.Ok(new { success = true, message = $"Staffing status updated to {status}." });
});

app.MapDelete("/api/staffing/{id:int}", async (int id) =>
{
    bool deleted = await dbService.DeleteStaffingRequestAsync(id);
    if (!deleted) return Results.NotFound(new { success = false, error = "Staffing request not found." });
    return Results.Ok(new { success = true, message = "Staffing request removed successfully." });
});

// 9. Alumni Placements Hall of Fame
app.MapGet("/api/placements", async () =>
{
    var list = await dbService.GetPlacementsAsync();
    return Results.Ok(new { success = true, data = list, total = list.Count });
});

app.MapPost("/api/placements", async (Placement pl) =>
{
    if (string.IsNullOrWhiteSpace(pl.StudentName) || string.IsNullOrWhiteSpace(pl.CompanyPlaced) || string.IsNullOrWhiteSpace(pl.RoleTitle))
    {
        return Results.BadRequest(new { success = false, error = "Student name, company, and role are required." });
    }
    int id = await dbService.AddPlacementAsync(pl);
    pl.Id = id;
    return Results.Created($"/api/placements/{id}", new { success = true, message = "Placement record added to Hall of Fame.", data = pl });
});

// 10. Admin SQL Console Runner
app.MapPost("/api/db/query", async (SqlQueryRequest req) =>
{
    if (string.IsNullOrWhiteSpace(req.Query))
    {
        return Results.BadRequest(new { success = false, error = "Query cannot be empty." });
    }
    var res = await dbService.ExecuteRawSelectQueryAsync(req.Query);
    return Results.Ok(res);
});

// 11. Admin CSV Export
app.MapGet("/api/db/export", async (string? table) =>
{
    string targetTable = string.IsNullOrWhiteSpace(table) ? "courses" : table.Trim();
    try
    {
        string csv = await dbService.ExportTableCsvAsync(targetTable);
        return Results.File(System.Text.Encoding.UTF8.GetBytes(csv), "text/csv", $"{targetTable}_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv");
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { success = false, error = ex.Message });
    }
});

// 12. Fallback to index.html for SPA Navigation
app.MapFallbackToFile("index.html");

app.Run();
