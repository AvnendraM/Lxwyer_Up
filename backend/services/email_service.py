import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

logger = logging.getLogger(__name__)

def send_waitlist_notification(name: str, email: str, message: str = "", phone: str = "", role: str = ""):
    """
    Sends an automated email notification when someone joins the waitlist.
    Sends a confirmation to the user and a notification to the admin.
    """
    SMTP_EMAIL = os.getenv("SMTP_EMAIL")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
    
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        logger.warning("SMTP_EMAIL or SMTP_PASSWORD not set in .env. Skipping waitlist email notifications.")
        return

    sender_email = SMTP_EMAIL
    admin_email = "avnendram.7@gmail.com"
    
    # 1. Send Notification to Admin
    admin_subject = f"🚀 New Early Access Signup: {name}"
    admin_body = f"""
    <h2>New Early Access Signup</h2>
    <p>A new user has submitted the early access form for LxwyerUp!</p>
    <ul>
        <li><strong>Name:</strong> {name}</li>
        <li><strong>Email:</strong> {email}</li>
        <li><strong>Phone:</strong> {phone if phone else "<em>Not provided</em>"}</li>
        <li><strong>Role:</strong> {role if role else "<em>Not provided</em>"}</li>
        <li><strong>Message:</strong> {message if message else "<em>No message provided</em>"}</li>
    </ul>
    """
    admin_msg = MIMEMultipart()
    admin_msg['From'] = f"LxwyerUp Notifications <{sender_email}>"
    admin_msg['To'] = admin_email
    admin_msg['Subject'] = admin_subject
    admin_msg.attach(MIMEText(admin_body, 'html'))
    
    # 2. Send Welcome/Confirmation to User
    user_subject = "Welcome to LxwyerUp Early Access!"
    user_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #2563eb;">You're on the list, {name}!</h2>
        <p>Thank you for signing up for early access to <strong>LxwyerUp</strong> - India's future legal platform.</p>
        <p>We've successfully received your details. Since you registered as a <strong>{role}</strong>, we'll make sure to tailor the updates specifically to how LxwyerUp can best serve you.</p>
        <p>We are working hard behind the scenes to revolutionize legal justice and will reach out to you directly at this email address when we launch.</p>
        <br>
        <p>Best regards,<br><strong>The LxwyerUp Team</strong></p>
    </div>
    """
    user_msg = MIMEMultipart()
    user_msg['From'] = f"LxwyerUp <{sender_email}>"
    user_msg['To'] = email
    user_msg['Subject'] = user_subject
    user_msg.attach(MIMEText(user_body, 'html'))
    
    try:
        # Connect to Gmail SMTP server using SSL to avoid port 587 blocks and set 3s timeout
        import smtplib
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=3)
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        
        # Send both emails
        server.send_message(admin_msg)
        server.send_message(user_msg)
        
        server.quit()
        logger.info(f"Waitlist notification emails sent successfully for {email}")
    except Exception as e:
        logger.error(f"Failed to send waitlist email notification: {e}")
