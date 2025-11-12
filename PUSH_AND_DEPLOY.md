# Quick Guide: Push and Deploy to Vercel

## Step 1: Commit and Push Your Changes

You have uncommitted changes. Let's commit and push them:

```bash
cd /Users/zhipingzhang/Documents/Phd/25fall/CS5610/webdev/kambaz-next-js

# Add all changes
git add .

# Commit changes
git commit -m "Add server integration and prepare for Vercel deployment"

# Push to current branch (a4)
git push origin a4
```

## Step 2: Choose Your Deployment Branch

### Option A: Deploy from `a4` (Recommended for Testing)
- ✅ Already has your latest changes
- ✅ Good for testing
- Use this branch in Vercel

### Option B: Deploy from `main` (Recommended for Production)
- ✅ Standard production branch
- Need to merge `a4` into `main` first:
  ```bash
  git checkout main
  git merge a4
  git push origin main
  ```
- Use this branch in Vercel

### Option C: Create New Branch `a5` (Optional)
- Only if you want to keep `a4` separate
- ```bash
  git checkout -b a5
  git push origin a5
  ```
- Use this branch in Vercel

## Step 3: Deploy on Vercel

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import repository: `kambaz-next-js`
4. Select branch: `a4` (or `main` or `a5`)
5. Framework Preset: **Next.js**
6. Set environment variable:
   - Key: `NEXT_PUBLIC_HTTP_SERVER`
   - Value: `https://kambaz-node-server-app-0sb6.onrender.com`
7. Click "Deploy"

## Step 4: Update Render's CLIENT_URL

After Vercel deployment:
1. Get your Vercel URL (e.g., `https://kambaz-next-js.vercel.app`)
2. Go to Render dashboard
3. Update `CLIENT_URL` environment variable to your Vercel URL
4. Render will automatically rebuild

