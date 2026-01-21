# Email Configuration Guide

## Setting Up EmailJS for Silent Brother Production House

To enable email functionality on your website, follow these steps:

### Step 1: Create an EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create an Email Service
1. In the EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Select your email provider (Gmail, Outlook, etc.)
4. For Outlook (your provider), you can use:
   - Service Name: `service_silent_brother`
   - Select "Gmail" or "Outlook" as the service type
5. Click **Create Service**

### Step 3: Create an Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Set the template name: `template_silent_brother`
4. Use this template content:

```
Subject: New Message from Silent Brother Website

From: {{from_name}} ({{from_email}})

Message:
{{message}}

---
Sent via Silent Brother Production House Website
```

5. Set the "To Email" to: `{{to_email}}`
6. Click **Save**

### Step 4: Get Your Public Key
1. Go to **Account** → **API Keys**
2. Copy your **Public Key**
3. Replace `YOUR_PUBLIC_KEY` in `main.js` line 2 with your actual public key:

```javascript
emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your actual key
```

### Step 5: Test the Form
1. Open your website
2. Go to the Contact section
3. Fill in the form and submit
4. Check your email (mayiiimayiii@outlook.com) for the message

## Troubleshooting

- **Emails not sending?** Make sure your email service is verified in EmailJS
- **Check browser console** for any error messages
- **Verify Public Key** is correctly placed in main.js
- **Template name must match** `template_silent_brother` in the code

## Security Note
Your Public Key is safe to share as it only allows sending emails through your configured service. Never share your Private Key.

## Free Tier Limits
- EmailJS free tier allows 200 emails per month
- Perfect for a production house contact form

---

For more help, visit: https://www.emailjs.com/docs/
