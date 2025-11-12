# Configuring Environment Variables in Vercel

## Overview

Configure your Vercel deployment to connect to your Render server by setting the `NEXT_PUBLIC_HTTP_SERVER` environment variable.

## Prerequisites

- ✅ Render server is deployed and running: `https://kambaz-node-server-app-0sb6.onrender.com`
- ✅ Vercel project is created and connected to GitHub
- ✅ React app code uses `process.env.NEXT_PUBLIC_HTTP_SERVER` (already configured)

## Step-by-Step Configuration

### Step 1: Navigate to Your Vercel Project

1. Go to https://vercel.com
2. Sign in to your account
3. Click on your project: `kambaz-next-js` (or your project name)

### Step 2: Access Environment Variables

**Option A: From Project Settings (Recommended)**

1. In your project dashboard, click **"Settings"** tab (top navigation)
2. Click **"Environment Variables"** in the left sidebar
3. You'll see the Environment Variables screen

**Option B: From Deployment Details**

1. In your project dashboard, go to **"Deployments"** tab
2. Click on the latest deployment
3. In the Deployment Details screen, look for **"Environment"** label
4. Click on **"Production"** (or the environment you want to configure)
5. This will take you to Project Settings → Environment Variables

### Step 3: Create Environment Variable

1. In the Environment Variables screen, you'll see a section to **"Create new"** variable
2. Click on the **"Create new"** tab or button
3. Fill in the form:
   - **Key**: `NEXT_PUBLIC_HTTP_SERVER`
   - **Value**: `https://kambaz-node-server-app-0sb6.onrender.com`
   - **Environments**: Select the environments where this variable should be available:
     - ✅ **Production** (required)
     - ✅ **Preview** (recommended for testing)
     - ✅ **Development** (optional, for local development with Vercel CLI)

**Important Notes:**
- ✅ **Include `https://`** in the URL
- ✅ **No trailing slash** - do NOT end with `/`
- ✅ Use your actual Render URL: `https://kambaz-node-server-app-0sb6.onrender.com`
- ✅ The variable name is `NEXT_PUBLIC_HTTP_SERVER` (not `NEXT_PUBLIC_REMOTE_SERVER`)

### Step 4: Save the Environment Variable

1. Click **"Save"** button
2. The environment variable will be added to your project
2. You'll see it listed in the Environment Variables screen

### Step 5: Redeploy the Application

After adding the environment variable, you need to redeploy for it to take effect:

**Option A: Redeploy from Deployment Page**

1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **"..."** (three dots) menu
4. Click **"Redeploy"**
5. Confirm the redeployment

**Option B: Redeploy from Overview**

1. Go to **"Overview"** tab
2. Click **"Redeploy"** button (if available)
3. Confirm the redeployment

**Option C: Trigger New Deployment**

1. Make a small change to your code (or add a comment)
2. Commit and push to GitHub
3. Vercel will automatically create a new deployment with the environment variable

### Step 6: Verify the Configuration

After redeployment, verify that everything is working:

1. **Visit your Vercel URL** (e.g., `https://kambaz-next-js-cs5610-sp25.vercel.app`)

2. **Open Browser DevTools:**
   - Press `F12` or right-click → "Inspect"
   - Go to **"Network"** tab
   - Filter by "XHR" or "Fetch"

3. **Test the Application:**
   - Try signing in or signing up
   - Navigate to Dashboard
   - Check that courses are loading
   - Navigate to a Course
   - Check that modules are loading

4. **Verify API Requests:**
   - In the Network tab, check the API requests
   - Verify that requests are going to: `https://kambaz-node-server-app-0sb6.onrender.com`
   - ✅ **Should NOT see**: `http://localhost:3000` or `http://localhost:4000`
   - ✅ **Should see**: `https://kambaz-node-server-app-0sb6.onrender.com`

5. **Test All Labs:**
   - Navigate to Labs section
   - Test Lab 5 endpoints
   - Verify all labs work correctly

## Environment Variable Details

| Variable Name | Value | Notes |
|---------------|-------|-------|
| `NEXT_PUBLIC_HTTP_SERVER` | `https://kambaz-node-server-app-0sb6.onrender.com` | Your Render server URL with `https://`, no trailing slash |

## Verification Checklist

- [ ] Environment variable `NEXT_PUBLIC_HTTP_SERVER` is set in Vercel
- [ ] Value is correct: `https://kambaz-node-server-app-0sb6.onrender.com`
- [ ] No trailing slash in the URL
- [ ] Environment variable is set for Production (and Preview if needed)
- [ ] Application has been redeployed after setting the variable
- [ ] Dashboard loads courses from Render server
- [ ] Modules page loads modules from Render server
- [ ] Network tab shows requests going to Render server (not localhost)
- [ ] All labs work correctly
- [ ] Sign in/sign up works correctly
- [ ] No CORS errors in console

## Troubleshooting

### Environment Variable Not Working

**Issue**: API requests still going to localhost or not working

**Solutions**:
1. Verify the environment variable is set correctly in Vercel
2. Make sure you redeployed after adding the variable
3. Check that the variable name is exactly `NEXT_PUBLIC_HTTP_SERVER`
4. Verify the value has `https://` and no trailing slash
5. Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### CORS Errors

**Issue**: CORS errors in browser console

**Solutions**:
1. Verify Render server's `CLIENT_URL` matches your Vercel URL
2. Check that CORS is configured correctly in Render server
3. Verify both URLs are using HTTPS
4. Check that `credentials: true` is set in CORS config

### Requests Going to Localhost

**Issue**: Network tab shows requests to `http://localhost:4000`

**Solutions**:
1. Verify environment variable is set in Vercel
2. Make sure you redeployed after setting the variable
3. Check that `NEXT_PUBLIC_HTTP_SERVER` is used in all client files
4. Clear browser cache
5. Check if there's a cached version of the app

### Build Errors

**Issue**: Build fails in Vercel

**Solutions**:
1. Check build logs in Vercel dashboard
2. Verify all dependencies are in `package.json`
3. Check for TypeScript errors
4. Verify environment variables are set correctly

## Next Steps

After configuring Vercel:

1. ✅ **Update Render's CLIENT_URL:**
   - Go to Render dashboard
   - Update `CLIENT_URL` environment variable to your Vercel URL
   - Example: `https://kambaz-next-js-cs5610-sp25.vercel.app`

2. ✅ **Test Full Integration:**
   - Sign in/sign up
   - Create courses
   - Create modules
   - Create assignments
   - Test all CRUD operations

3. ✅ **Monitor Both Services:**
   - Check Render logs for server errors
   - Check Vercel logs for client errors
   - Monitor both dashboards for issues

## Important Notes

- **Environment Variable Naming**: Use `NEXT_PUBLIC_HTTP_SERVER` (not `NEXT_PUBLIC_REMOTE_SERVER`)
- **URL Format**: Include `https://` but no trailing slash
- **Redeploy Required**: Always redeploy after adding/updating environment variables
- **Multiple Environments**: Set the variable for Production, Preview, and Development if needed
- **No Localhost**: Verify that no requests are going to localhost in production

## Quick Reference

**Render Server URL**: `https://kambaz-node-server-app-0sb6.onrender.com`

**Environment Variable to Set in Vercel**:
- Key: `NEXT_PUBLIC_HTTP_SERVER`
- Value: `https://kambaz-node-server-app-0sb6.onrender.com`
- Environments: Production, Preview, Development

**After Setting Variable**:
1. Save the environment variable
2. Redeploy the application
3. Verify requests are going to Render server
4. Update Render's CLIENT_URL with your Vercel URL

