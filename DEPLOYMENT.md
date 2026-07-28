# 🚀 Deployment Guide - Render (100% Free)

This guide walks you through deploying your full-stack application on Render's free tier.

## Prerequisites

- GitHub account
- MongoDB Atlas account (free tier)
- Cloudinary account
- Your code pushed to GitHub

---

## Step 1: Setup MongoDB Atlas (Free Tier)

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. **Create Cluster**:
   - Click "Create" → "Shared" (FREE tier)
   - Choose a cloud provider & region (closest to you)
   - Cluster Name: `auraselect` (or any name)
3. **Database Access**:
   - Go to "Database Access" → "Add New Database User"
   - Username: `your_username`
   - Password: Generate a secure password (SAVE THIS!)
   - Database User Privileges: "Read and write to any database"
4. **Network Access**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm
5. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with your database name (e.g., `auraselect`)
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/auraselect?retryWrites=true&w=majority`

---

## Step 2: Deploy Backend to Render

1. **Sign Up**: Go to [Render](https://render.com/) and sign up with GitHub
2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     ```
     Name: auraselect-backend (or your choice)
     Region: Choose closest region
     Branch: main (or your branch)
     Root Directory: backend
     Runtime: Node
     Build Command: npm install
     Start Command: npm start
     Instance Type: Free
     ```
3. **Environment Variables**:
   Click "Advanced" → "Add Environment Variable" and add these:

   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your_mongodb_atlas_connection_string>
   JWT_SECRET=<generate_random_32_character_string>
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
   CLOUDINARY_API_KEY=<your_cloudinary_api_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
   FRONTEND_URL=https://auraselect.onrender.com
   ```

   > **Note**: For FRONTEND_URL, use a placeholder for now. Update it after deploying the frontend in Step 3.

   > **Generate JWT Secret**: Use this command in your terminal:
   >
   > ```bash
   > node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   > ```

4. **Create Service**: Click "Create Web Service"
5. **Wait for Deployment**: First deployment takes ~5 minutes
6. **Save Backend URL**: Copy your backend URL (e.g., `https://auraselect-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Render

1. **Create Static Site**:

   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     ```
     Name: auraselect (or your choice)
     Branch: main
     Root Directory: client
     Build Command: npm install && npm run build
     Publish Directory: dist
     ```

   > **Note**: The `client/public/_redirects` file is critical for SPA routing. It ensures that all routes (like `/about` or `/admin/upload`) serve `index.html`, allowing React Router to handle routing client-side instead of returning 404 errors.

2. **Environment Variables**:
   Click "Advanced" → "Add Environment Variable":

   ```
   VITE_API_URL=<your_backend_url_from_step_2>
   ```

   Example: `VITE_API_URL=https://auraselect-backend.onrender.com`

3. **Create Static Site**: Click "Create Static Site"
4. **Wait for Deployment**: Takes ~3-5 minutes
5. **Save Frontend URL**: Copy your frontend URL (e.g., `https://auraselect.onrender.com`)

---

## Step 4: Update Backend CORS Configuration

Now that you have your frontend URL, update the backend:

1. Go to your **Backend Web Service** on Render
2. Go to "Environment" tab
3. **Update** the `FRONTEND_URL` variable with your actual frontend URL:
   ```
   FRONTEND_URL=https://auraselect.onrender.com
   ```
4. Click "Save Changes"
5. Render will automatically redeploy your backend

---

## Step 5: Verification

Test your deployed application:

### ✅ Backend Health Check

Visit: `https://your-backend-url.onrender.com/`

You should see:

```json
{
  "status": "OK",
  "service": "Backend API running"
}
```

### ✅ Frontend Access

Visit: `https://your-frontend-url.onrender.com/`

Should load your login page.

### ✅ Test Full Flow

1. **Register** a new user
2. **Login** with credentials
3. **Upload** a model (if admin)
4. **Add to favorites**
5. **Verify** images load from Cloudinary

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Backend won't start

- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

**Problem**: CORS errors

- Verify `FRONTEND_URL` matches your exact frontend URL (no trailing slash)
- Check browser console for specific error

### Frontend Issues

**Problem**: Can't connect to backend

- Verify `VITE_API_URL` is set correctly
- Check backend is deployed and running
- Open browser DevTools → Network tab to see failed requests

**Problem**: Blank page after deployment

- Check browser console for errors
- Verify build completed successfully in Render logs

### Database Issues

**Problem**: MongoDB connection timeout

- Verify IP whitelist includes 0.0.0.0/0 in MongoDB Atlas
- Check connection string format
- Ensure password doesn't contain special characters (URL encode if needed)

---

## 💡 Important Notes

### Free Tier Limitations

- **Backend**: Spins down after 15 minutes of inactivity

  - First request after inactivity takes ~30 seconds (cold start)
  - Not ideal for production, perfect for testing/demos

- **Frontend**: Always fast (served from CDN)

- **MongoDB Atlas**: 512 MB storage limit (plenty for testing)

### Future Upgrades

When ready to go live:

- Upgrade Render backend to paid tier ($7/month) for 24/7 uptime
- Consider upgrading MongoDB Atlas if you need more storage

### Security Reminders

- ✅ Never commit `.env` files to Git
- ✅ Use strong JWT secrets
- ✅ Rotate credentials periodically
- ✅ Keep dependencies updated

---

## 📱 Making Updates

### Code Changes

Push to your GitHub repository and Render will auto-deploy:

```bash
git add .
git commit -m "your changes"
git push origin main
```

### Environment Variable Changes

1. Go to Render dashboard
2. Select your service
3. Go to "Environment" tab
4. Update variables
5. Service will automatically redeploy

---

## 🎉 You're Done!

Your application is now live and accessible at:

- **Frontend**: `https://your-app-name.onrender.com`
- **Backend**: `https://your-backend-name.onrender.com`

Share the frontend URL with anyone to access your app!
