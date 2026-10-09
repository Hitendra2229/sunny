"""
NVN India Private LTD - Email Notification Service
Handles asynchronous dispatch of incoming enquiry alerts to nvnindiapvtltd@gmail.com
and auto-acknowledgement emails to prospective students/clients.
"""

import os
import smtplib
import threading
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

# Environment / Default Settings
SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SMTP_USER = os.environ.get("SMTP_USER", "nvnindiapvtltd@gmail.com")
SMTP_PASS = os.environ.get("SMTP_PASS", "")  # Gmail App Password (16 characters)
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "nvnindiapvtltd@gmail.com")

LOG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "enquiry_notifications.log")

def log_notification(title, details):
    """Writes the notification details to a persistent local log file."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = f"[{timestamp}] {title}\n"
    for k, v in details.items():
        entry += f"  - {k}: {v}\n"
    entry += "=" * 60 + "\n"
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(entry)
    except Exception as e:
        print(f"[EmailService] Failed to write notification log: {e}")

def _send_email_thread(subject, recipient, html_content, text_content=""):
    """Internal thread worker to dispatch SMTP email without blocking the HTTP thread."""
    if not SMTP_PASS or not SMTP_USER:
        print(f"[EmailService Notification Logged]: '{subject}' for {recipient} (SMTP_PASS not set in environment)")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"NVN India Official <{SMTP_USER}>"
        msg["To"] = recipient

        if text_content:
            msg.attach(MIMEText(text_content, "plain"))
        msg.attach(MIMEText(html_content, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, recipient, msg.as_string())

        print(f"[EmailService] Successfully sent email '{subject}' to {recipient}")
        return True
    except Exception as e:
        print(f"[EmailService Error] Failed to send email to {recipient}: {e}")
        return False

def notify_new_enquiry(enquiry_type, applicant_name, applicant_email, applicant_phone, extra_details=None):
    """
    Public entry point called when any enquiry is submitted.
    Dispatches:
      1. Alert email to NVN Admin (nvnindiapvtltd@gmail.com)
      2. Confirmation acknowledgment email to the applicant
    """
    if extra_details is None:
        extra_details = {}

    timestamp = datetime.now().strftime("%d %b %Y, %I:%M %p IST")
    details = {
        "Enquiry Category": enquiry_type,
        "Full Name": applicant_name,
        "Email": applicant_email,
        "Phone / Mobile": applicant_phone or "Not provided",
        "Submitted At": timestamp,
        **extra_details
    }

    # 1. Always log notification to disk
    log_notification(f"NEW {enquiry_type.upper()} ENQUIRY: {applicant_name}", details)

    # 2. Build Admin HTML Alert
    details_html = "".join(
        f"<tr><td style='padding:8px 12px; font-weight:600; color:#334155; border-bottom:1px solid #e2e8f0; width:35%;'>{k}</td>"
        f"<td style='padding:8px 12px; color:#0f172a; border-bottom:1px solid #e2e8f0;'>{v}</td></tr>"
        for k, v in details.items()
    )

    admin_subject = f"🔔 [NVN India Alert] New {enquiry_type}: {applicant_name}"
    admin_html = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f1f5f9; margin:0; padding:24px;">
      <div style="max-width:620px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.06); border:1px solid #e2e8f0;">
        <div style="background:linear-gradient(135deg, #090d16 0%, #0d213a 100%); padding:28px; text-align:center; color:#ffffff; border-bottom:3px solid #00e5ff;">
          <h2 style="margin:0; font-size:22px; letter-spacing:0.5px; color:#ffffff;">NVN INDIA PRIVATE LIMITED</h2>
          <p style="margin:6px 0 0; color:#94a3b8; font-size:13px;">Corporate Headquarters & Innovation Center — Jammalamadugu, AP</p>
          <div style="display:inline-block; margin-top:12px; background:rgba(0, 229, 255, 0.15); border:1px solid #00e5ff; color:#00e5ff; padding:4px 14px; border-radius:20px; font-size:12px; font-weight:700;">
            NEW {enquiry_type.upper()} RECEIVED
          </div>
        </div>
        <div style="padding:28px;">
          <p style="font-size:15px; color:#1e293b; margin-top:0;">You have received a new prospective lead through the official portal:</p>
          <table style="width:100%; border-collapse:collapse; margin:18px 0; background:#f8fafc; border-radius:8px; overflow:hidden; font-size:14px;">
            {details_html}
          </table>
          <div style="margin-top:24px; display:flex; gap:12px;">
            <a href="mailto:{applicant_email}" style="display:inline-block; background:#00e5ff; color:#090d16; text-decoration:none; padding:10px 20px; border-radius:6px; font-weight:700; font-size:13px; margin-right:8px;">
              ✉️ Reply to {applicant_name}
            </a>
            {f'<a href="https://wa.me/91{applicant_phone.replace("+91", "").replace(" ", "").replace("-", "")}" style="display:inline-block; background:#10b981; color:#ffffff; text-decoration:none; padding:10px 20px; border-radius:6px; font-weight:700; font-size:13px;">💬 Chat on WhatsApp</a>' if applicant_phone else ''}
          </div>
        </div>
        <div style="background:#f8fafc; padding:16px 28px; text-align:center; color:#64748b; font-size:12px; border-top:1px solid #e2e8f0;">
          CIN: U72900AP2024PTC189000 | Opposite Town Church, Upstairs, Jammalamadugu - 516434
        </div>
      </div>
    </body>
    </html>
    """

    # 3. Build Applicant Acknowledgment HTML
    applicant_subject = f"Thank you for contacting NVN India Private Limited ({enquiry_type})"
    applicant_html = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f8fafc; margin:0; padding:24px;">
      <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.05); border:1px solid #e2e8f0;">
        <div style="background:linear-gradient(135deg, #090d16 0%, #1e293b 100%); padding:28px; text-align:center; color:#ffffff; border-bottom:3px solid #10b981;">
          <h2 style="margin:0; font-size:22px; color:#ffffff;">NVN INDIA PRIVATE LIMITED</h2>
          <p style="margin:6px 0 0; color:#38bdf8; font-size:13px;">Software Solutions • Tech Academy • Staff Augmentation</p>
        </div>
        <div style="padding:28px; color:#334155; font-size:14px; line-height:1.6;">
          <p style="font-size:16px; color:#0f172a; margin-top:0;"><strong>Dear {applicant_name},</strong></p>
          <p>Thank you for submitting your <strong>{enquiry_type}</strong> to NVN India Private Limited. We have successfully registered your details in our system.</p>
          <div style="background:#f1f5f9; padding:16px; border-radius:8px; border-left:4px solid #10b981; margin:20px 0;">
            <p style="margin:0; font-weight:600; color:#0f172a;">Next Steps:</p>
            <p style="margin:6px 0 0; color:#475569; font-size:13px;">
              Our specialized team in Jammalamadugu will review your requirements and get in touch with you within <strong>24 to 48 business hours</strong> via Phone or Email.
            </p>
          </div>
          <p>If you have any urgent queries or would like to visit our campus, you can reach us directly:</p>
          <ul style="padding-left:20px; color:#475569; font-size:13px;">
            <li><strong>Hotline:</strong> +91 86390 92368</li>
            <li><strong>WhatsApp:</strong> +91 86390 92368</li>
            <li><strong>Official Email:</strong> nvnindiapvtltd@gmail.com</li>
            <li><strong>Campus Address:</strong> D.No. 1/674, Opposite Town Church, Upstairs, Jammalamadugu, AP - 516434</li>
          </ul>
          <p style="margin-top:24px;">Warm regards,<br><strong>Admissions & Client Relations Team</strong><br>NVN India Private Limited</p>
        </div>
        <div style="background:#f8fafc; padding:16px; text-align:center; color:#94a3b8; font-size:12px; border-top:1px solid #e2e8f0;">
          © {datetime.now().year} NVN India Private Limited. All Rights Reserved.
        </div>
      </div>
    </body>
    </html>
    """

    # Dispatch via background threads
    t1 = threading.Thread(target=_send_email_thread, args=(admin_subject, ADMIN_EMAIL, admin_html), daemon=True)
    t1.start()

    if applicant_email and "@" in applicant_email:
        t2 = threading.Thread(target=_send_email_thread, args=(applicant_subject, applicant_email, applicant_html), daemon=True)
        t2.start()

    return True
