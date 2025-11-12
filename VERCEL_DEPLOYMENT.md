# Deploying Next.js App to Vercel

## Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
   - Repository: `https://github.com/ZhipingZhangArya/kambaz-next-js.git`
   - Current branch: `a4` (or `main` for production)
2. **Render Server URL**: Your Node.js server should be deployed on Render
   - Example: `https://kambaz-node-server-app-cs5610-sp25.onrender.com`
3. **Vercel Account**: Create an account at https://vercel.com if you don't have one

## Step-by-Step Deployment Instructions

### 1. Commit Any Uncommitted Changes

Before deploying, make sure all your changes are committed and pushed to GitHub:

```bash
cd /Users/zhipingzhang/Documents/Phd/25fall/CS5610/webdev/kambaz-next-js
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 2. Sign In to Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** or **"Log In"**
3. Sign in with your GitHub account (recommended for easy repository access)

### 3. Create a New Project

1. Click **"Add New..."** button (top right)
2. Select **"Project"**
3. Click **"Import Git Repository"**
4. Search for your repository: `kambaz-next-js`
5. Select it from the list
6. Click **"Import"**

### 4. Configure the Project

1. **Project Name**: 
   - Keep the default `kambaz-next-js` or change it to your preferred name
   - Example: `kambaz-next-js-cs5610-sp25`

2. **Framework Preset**: 
   - Vercel should automatically detect **"Next.js"**
   - If not, select **"Next.js"** from the dropdown

3. **Root Directory**: 
   - Leave as `./` (root of the repository)

4. **Build Command**: 
   - Leave as default: `npm run build` or `next build`
   - Vercel will automatically detect Next.js and use the correct build command

5. **Output Directory**: 
   - Leave as default (Next.js handles this automatically)

6. **Install Command**: 
   - Leave as default: `npm install`

### 5. Configure Environment Variables

**IMPORTANT**: You need to set the `NEXT_PUBLIC_HTTP_SERVER` environment variable to point to your Render server.

1. Click **"Environment Variables"** section
2. Click **"Add"** to add a new environment variable
3. Add the following:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `NEXT_PUBLIC_HTTP_SERVER` | `https://YOUR-RENDER-URL.onrender.com` | Production, Preview, Development |

   **Important Notes:**
   - Replace `YOUR-RENDER-URL.onrender.com` with your actual Render server URL
   - Include `https://` in the URL
   - You can set it for all environments (Production, Preview, Development) or just Production
   - Example: `https://kambaz-node-server-app-cs5610-sp25.onrender.com`

### 6. Deploy

1. Click **"Deploy"** button
2. Wait for the build to complete (usually takes 1-3 minutes)
3. Watch the build logs for any errors

### 7. Check the Deployment

1. Once deployed, Vercel will provide a URL like:
   - `https://kambaz-next-js-cs5610-sp25.vercel.app`
   - Or: `https://kambaz-next-js-xxxxx.vercel.app` (if modified)

2. **Test the deployment:**
   - Visit your Vercel URL
   - Try signing in or signing up
   - Test the Dashboard to see if courses load
   - Test the Courses page to see if modules load

### 8. Update Render Server CLIENT_URL

After deploying to Vercel, update your Render server's `CLIENT_URL` environment variable:

1. Go to your Render dashboard
2. Click on your Node.js server service
3. Go to **"Environment"** tab
4. Click **"Edit"** on `CLIENT_URL`
5. Update the value to your Vercel URL (e.g., `https://kambaz-next-js-cs5610-sp25.vercel.app`)
6. Click **"Save Changes"**
7. Render will automatically rebuild and redeploy

### 9. Verify Integration

1. **Test the connection:**
   - Open your Vercel app in a browser
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try signing in or fetching courses
   - Check that API requests are going to your Render server URL

2. **Test CORS:**
   - If you see CORS errors, verify:
     - `CLIENT_URL` in Render matches your Vercel URL exactly
     - `NEXT_PUBLIC_HTTP_SERVER` in Vercel matches your Render URL
     - Both are using HTTPS

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

1. **Production**: Deploys from your main branch (or branch you configured)
2. **Preview**: Creates a preview deployment for every pull request
3. **Automatic**: Each push to GitHub triggers a new deployment

## Environment Variables in Vercel

### Setting Environment Variables

1. Go to your project dashboard on Vercel
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in the left sidebar
4. Add, edit, or delete environment variables
5. Click **"Save"**
6. Redeploy if necessary

### Environment Variable Scopes

- **Production**: Used in production deployments
- **Preview**: Used in preview deployments (pull requests)
- **Development**: Used in local development (if using Vercel CLI)

## Troubleshooting

### Build Fails

1. **Check build logs:**
   - Go to your project dashboard
   - Click on the failed deployment
   - Check the build logs for errors

2. **Common issues:**
   - Missing dependencies in `package.json`
   - TypeScript errors
   - Missing environment variables
   - Build command issues

### Runtime Errors

1. **Check function logs:**
   - Go to your project dashboard
   - Click **"Functions"** tab
   - Check logs for runtime errors

2. **Common issues:**
   - Environment variables not set correctly
   - API server not accessible
   - CORS errors

### CORS Errors

1. **Verify environment variables:**
   - `NEXT_PUBLIC_HTTP_SERVER` in Vercel should point to Render
   - `CLIENT_URL` in Render should point to Vercel

2. **Check server configuration:**
   - Verify CORS is configured correctly in your Render server
   - Check that `credentials: true` is set in CORS config
   - Verify session configuration

### API Requests Not Working

1. **Check network tab:**
   - Open browser DevTools
   - Go to Network tab
   - Check if requests are going to the correct URL
   - Check for CORS errors

2. **Verify environment variables:**
   - `NEXT_PUBLIC_HTTP_SERVER` should be set correctly
   - Restart your Vercel deployment after changing environment variables

### Session Not Working

1. **Check cookie settings:**
   - Verify `sameSite: 'none'` and `secure: true` in server config
   - Check that `withCredentials: true` is set in axios requests
   - Verify CORS credentials are enabled

2. **Check domain configuration:**
   - Don't set cookie domain for cross-origin requests
   - Let the browser handle cookie domain automatically

## Useful Vercel Features

### Custom Domain

1. Go to your project dashboard
2. Click **"Settings"** tab
3. Click **"Domains"** in the left sidebar
4. Add your custom domain
5. Follow the DNS configuration instructions

### Analytics

1. Go to your project dashboard
2. Click **"Analytics"** tab
3. Enable Analytics to track your app's performance

### Logs

1. Go to your project dashboard
2. Click **"Logs"** tab
3. View real-time logs from your deployments

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_HTTP_SERVER` | Your Render server URL | `https://kambaz-node-server-app.onrender.com` |

**Note**: 
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Make sure to include `https://` in the URL
- Update this variable if your Render server URL changes

## Deployment Checklist

- [ ] Code is committed and pushed to GitHub
- [ ] Vercel account is created
- [ ] Project is imported from GitHub
- [ ] Environment variables are set (especially `NEXT_PUBLIC_HTTP_SERVER`)
- [ ] Deployment is successful
- [ ] Vercel URL is working
- [ ] Render server `CLIENT_URL` is updated to Vercel URL
- [ ] Integration is tested (sign in, fetch courses, etc.)
- [ ] CORS is working correctly
- [ ] Sessions are working correctly

## Next Steps

1. **Deploy to Vercel** following the steps above
2. **Update Render server** `CLIENT_URL` to point to Vercel
3. **Test the integration** between Vercel and Render
4. **Monitor** both deployments for any issues
5. **Set up custom domain** (optional)

## Support

If you encounter any issues:
1. Check the deployment logs in Vercel
2. Check the server logs in Render
3. Verify environment variables are set correctly
4. Test the API endpoints directly
5. Check browser console for errors

