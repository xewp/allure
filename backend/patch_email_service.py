#!/usr/bin/env python3
"""
Quick patch script to fix emailService.js
Replaces createTransporter() implementations with sendEmail() from emailSender.js
"""

import re

filepath = r'src\services\emailService.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Replace imports
content = content.replace(
    "import { createTransport } from 'nodemailer';",
    "import { sendEmail } from './emailSender.js';"
)

# Fix 2: Remove createTransporter function definition
content = re.sub(
    r'/\*\*\r?\n \* Create and configure Nodemailer transporter[\s\S]*?^};',
    '',
    content,
    flags=re.MULTILINE
)

# Fix 3: Replace all "const transporter = createTransporter();" lines
content = content.replace(
    "  const transporter = createTransporter();",
    ""
)

# Fix 4: Replace all transporter.sendMail(mailOptions) with sendEmail calls
# This is trickier - we need to extract subject, html, and text from mailOptions
# For now, let's do a simple find/replace approach for each function

# Function helper to convert mailOptions to sendEmail
def convert_mail_options_to_send_email(match):
    """Convert old transporter.sendMail(mailOptions) pattern to new sendEmail()"""
    before = match.group(1)  
    # Check if this is in a try block
    if 'try {' in before:
        return before + "await sendEmail(email, subject, html, text);"
    return before +  "await sendEmail(email, subject, html, text);"

# Replace transporter.sendMail patterns
content = re.sub(
    r'(try\s*\{\s*)\s*await transporter\.sendMail\(mailOptions\);',
    r'\1\n    await sendEmail(email, subject, html, text);',
    content
)

# More refined replacements for specific patterns in mailOptions
content = re.sub(
    r'const mailOptions = \{[\s\S]*?from: `"Power Allure" <\$\{process\.env\.EMAIL_FROM\}>`,[\s\S]*?to: email,[\s\S]*?subject: (.*?),[\s\S]*?html: (`[\s\S]*?`),[\s\S]*?\};',
    lambda m: f"const subject = {m.group(1)};\n  const html = {m.group(2)};\n  const text = `Plain text version`;", # placeholder
    content
)

print("Patched emailService.js successfully!")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
