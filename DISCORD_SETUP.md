# Discord Integration Setup Guide

## How to Set Up Discord Webhook for Registration Form

The registration form now sends all submissions to Discord. Follow these steps to complete the setup:

### Step 1: Create a Discord Webhook

1. Open your Discord Server
2. Go to **Server Settings** (⚙️)
3. Select **Integrations** from the left menu
4. Click **Webhooks**
5. Click **Create Webhook**
6. Give it a name (e.g., "Silent Brother Registration")
7. Select the channel where you want registrations sent (channel ID: `970985085497147432`)
8. Click **Copy Webhook URL**

### Step 2: Add Webhook URL to Your Website

1. Open `credits.js` in your website files
2. Find this line at the top:
   ```javascript
   const DISCORD_WEBHOOK_URL = 'https://discordapp.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN';
   ```
3. Replace it with your actual webhook URL:
   ```javascript
   const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/YOUR_COPIED_WEBHOOK_URL';
   ```
4. Save the file

### Step 3: Test the Form

1. Go to your website's credits page
2. Fill out the registration form with test data
3. Submit the form
4. Check your Discord channel - you should see an embedded message with all the registration details

## Features

✅ **Automatic Discord Notifications** - Every submission appears as a formatted Discord embed
✅ **File Information** - Photo and video uploads are logged (with file size)
✅ **Email Backup** - Submissions also go to dualoznebusiness@gmail.com
✅ **Professional Formatting** - Clean Discord embed with all applicant information

## Form Fields

- **Name** (Required) - Applicant's full name
- **Email** (Required) - Contact email
- **Skills** (Required) - Skills listing
- **Experience** (Required) - Experience details
- **Portfolio URL** (Required) - Portfolio or social media link
- **Photo** (Optional) - Profile photo upload
- **Video** (Optional) - Demo reel or video portfolio

## Notes

- File uploads (photo/video) are optional but recommended
- File information is sent to Discord, but the actual files are stored locally
- All submissions include a timestamp
- You can delete the webhook anytime from Discord server settings

## Troubleshooting

If submissions aren't appearing:

1. **Check the webhook URL** - Make sure you copied it correctly
2. **Verify the channel** - Confirm the webhook posts to the right channel
3. **Check permissions** - Ensure the webhook has permission to post messages
4. **Console errors** - Open browser developer tools (F12) and check for errors

For more help, visit: https://support.discord.com/hc/en-us/articles/228383668-Webhooks-Guide
