# 🔐 Google OAuth Setup Guide for Kaveri-arts

## Overview
This guide will help you set up Google Sign-In authentication so that only `kaveriprajapati123@gmail.com` can access admin features.

---

## 📋 Prerequisites
- Gmail account: `kaveriprajapati123@gmail.com`
- GitHub Pages URL: `https://suryakant7.github.io/Kaveri-arts/`

---

## 🚀 Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create New Project:**
   - Click "Select a project" → "New Project"
   - **Project Name:** `Kaveri-arts-Portfolio`
   - Click "Create"
   - Wait for project to be created (takes a few seconds)

3. **Select Your Project:**
   - Make sure "Kaveri-arts-Portfolio" is selected at the top

---

### Step 2: Enable Google Sign-In API

1. **Navigate to APIs & Services:**
   - In left sidebar: Click "APIs & Services" → "Library"

2. **Search for Google Identity:**
   - Search: "Google Identity"
   - Click on "Google+ API" or "Google Identity Services"
   - Click "Enable"

---

### Step 3: Create OAuth 2.0 Credentials

1. **Go to Credentials:**
   - Left sidebar: "APIs & Services" → "Credentials"

2. **Configure OAuth Consent Screen:**
   - Click "Configure Consent Screen"
   - Choose **External** (for personal use)
   - Click "Create"

3. **Fill OAuth Consent Screen:**
   - **App name:** `Kaveri-arts Portfolio`
   - **User support email:** `kaveriprajapati123@gmail.com`
   - **App logo:** (Optional - upload logo later)
   - **Authorized domains:** `github.io`
   - **Developer contact:** `kaveriprajapati123@gmail.com`
   - Click "Save and Continue"

4. **Scopes (Step 2):**
   - Click "Add or Remove Scopes"
   - Select: `email`, `profile`, `openid`
   - Click "Update" → "Save and Continue"

5. **Test Users (Step 3):**
   - Click "Add Users"
   - Enter: `kaveriprajapati123@gmail.com`
   - Click "Add" → "Save and Continue"

6. **Summary:**
   - Review and click "Back to Dashboard"

7. **Create Credentials:**
   - Click "Credentials" in left sidebar
   - Click "+ Create Credentials" → "OAuth client ID"

8. **Configure OAuth Client:**
   - **Application type:** Web application
   - **Name:** `Kaveri-arts Web Client`
   
   - **Authorized JavaScript origins:**
     ```
     https://suryakant7.github.io
     http://localhost:8000
     http://localhost:3000
     http://127.0.0.1:8000
     ```
   
   - **Authorized redirect URIs:**
     ```
     https://suryakant7.github.io/Kaveri-arts/
     https://suryakant7.github.io/Kaveri-arts/index.html
     ```
   
   - Click "Create"

9. **Save Your Client ID:**
   - A popup will show your **Client ID**
   - **COPY THIS!** It looks like:
     ```
     123456789-abcdefghijklmnop.apps.googleusercontent.com
     ```
   - Click "OK"

---

### Step 4: Update Website Code

1. **Open `index.html`**

2. **Find this line (around line 649):**
   ```html
   data-client_id="YOUR_GOOGLE_CLIENT_ID"
   ```

3. **Replace with your actual Client ID:**
   ```html
   data-client_id="123456789-abcdefghijklmnop.apps.googleusercontent.com"
   ```

4. **Save the file**

---

### Step 5: Update Admin Sign Out Function

1. **Open `js/admin.js`**

2. **Find the `signOutGoogle()` function (around line 80)**

3. **Update the Client ID in the reset HTML:**
   ```javascript
   data-client_id="YOUR_ACTUAL_CLIENT_ID_HERE"
   ```

4. **Save the file**

---

### Step 6: Test Locally (Optional but Recommended)

1. **Start a local server:**
   ```bash
   cd /Users/suryakant/Documents/MyWebsites/Kaveri-arts
   python3 -m http.server 8000
   ```

2. **Open in browser:**
   ```
   http://localhost:8000
   ```

3. **Test Google Login:**
   - Click "Google Login" button
   - Sign in with `kaveriprajapati123@gmail.com`
   - Verify admin panel appears

---

### Step 7: Deploy to GitHub Pages

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Add Google OAuth authentication"
   git push origin main
   ```

2. **Wait 2-3 minutes** for GitHub Pages to rebuild

3. **Test on live site:**
   ```
   https://suryakant7.github.io/Kaveri-arts/
   ```

---

## ✅ Verification Checklist

- [ ] Google Cloud Project created
- [ ] OAuth Consent Screen configured
- [ ] Test user added (kaveriprajapati123@gmail.com)
- [ ] OAuth Client ID created
- [ ] Authorized origins added
- [ ] Client ID copied
- [ ] `index.html` updated with Client ID
- [ ] `admin.js` updated with Client ID
- [ ] Tested locally (optional)
- [ ] Deployed to GitHub Pages
- [ ] Tested on live site

---

## 🎯 Expected Behavior

### For Authorized Admin (kaveriprajapati123@gmail.com):
1. Click "Google Login"
2. Sign in with Google
3. See "Admin Dashboard" with two tabs
4. Can add/edit/delete artworks
5. Can edit page content

### For Other Users:
1. Click "Google Login"
2. Sign in with any Google account
3. See welcome message: "You're signed in but don't have admin privileges"
4. Only option: Sign Out

---

## 🔒 Security Features

✅ **Only authorized email** gets admin access
✅ **Session-based** storage (more secure)
✅ **JWT token parsing** for user verification
✅ **Real Google OAuth** (no dummy logins)
✅ **Test users restricted** in OAuth consent screen

---

## 🐛 Troubleshooting

### "Sign-In button not showing"
- Check if Client ID is correct in `index.html`
- Verify authorized origins include `github.io`
- Clear browser cache

### "Unauthorized error"
- Make sure you added the email to Test Users
- OAuth consent screen must be in "Testing" mode
- Check authorized redirect URIs

### "Button shows but doesn't work"
- Open browser console (F12)
- Check for JavaScript errors
- Verify Google Sign-In script is loading

### "Can't sign in on GitHub Pages"
- Make sure authorized JavaScript origins include:
  - `https://suryakant7.github.io`
- Make sure authorized redirect URIs include:
  - `https://suryakant7.github.io/Kaveri-arts/`

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors (F12 → Console)
2. Verify all URLs in Google Console match exactly
3. Make sure OAuth consent screen is published (or in Testing mode with test users)
4. Try in incognito mode to rule out cache issues

---

## 📝 Important Notes

- **Client ID is PUBLIC** - it's safe to commit to GitHub
- **Never commit Client Secret** - but we're not using it (client-side OAuth)
- **Test mode** limits to test users only - that's what we want!
- **Publishing app** requires verification - not needed for single user

---

## 🎉 After Setup

Once configured, the website will:
- Show "Google Login" button to everyone
- Allow anyone to sign in with Google
- Only grant admin privileges to `kaveriprajapati123@gmail.com`
- All other users see a friendly "not authorized" message
- Admin can add artworks via Google Drive links
- Admin can edit page content dynamically

---

**Ready to publish? Your art gallery awaits! 🎨**
