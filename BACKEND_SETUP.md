# Silent Brother Backend Configuration

## Environment Variables

Create a `.env` file in the project root with the following:

```env
# Email Configuration
EMAIL_USER=dualoznebusiness@gmail.com
EMAIL_PASSWORD=your_app_password_here
ADMIN_EMAIL=dualoznebusiness@gmail.com

# Environment
NODE_ENV=production
```

## Gmail App Password Setup

1. Go to Google Account Security: https://myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Create an App Password for "Mail" on "Windows Computer"
4. Copy the 16-character password to `EMAIL_PASSWORD` in `.env`

## Installation & Running

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start
```

Server will run on `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /api/health
Response: { status: "Backend is running!" }
```

### Submit Registration
```
POST /api/submit-registration
Content-Type: multipart/form-data

Body:
- name: string (required)
- email: string (required)
- skills: string (required)
- experience: string (required)
- portfolio: string (required)
- photo: file (optional)
- video: file (optional)

Response on Success:
{
  "success": true,
  "message": "Registration submitted successfully!"
}

Response on Error:
{
  "success": false,
  "message": "Error message here"
}
```

## Features

✓ Form validation (required fields, email format)
✓ File upload handling (photos and demo reels up to 50MB)
✓ Email delivery to admin with attachments
✓ Auto-confirmation email to applicant
✓ HTML formatted emails
✓ Error handling and logging
✓ CORS enabled for frontend communication
✓ HTML escaping for security

## Testing the Backend

```bash
curl -X POST http://localhost:3000/api/submit-registration \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "skills": "Video Editing",
    "experience": "5 years",
    "portfolio": "https://example.com"
  }'
```
