# 🚀 CY Pet Store Deployment Checklist

## ✅ Pre-deployment (已完成)
- [x] Git repository prepared and pushed to GitHub
- [x] Frontend production build tested
- [x] Deployment configurations created
- [x] Environment variables templates ready

## 🔄 Railway Backend Deployment (进行中)

### Step 1: Create Railway Project
- [ ] Visit https://railway.app and login with GitHub
- [ ] Click "New Project" → "Deploy from GitHub repo"
- [ ] Select your `Aus-pet-store` repository
- [ ] Wait for automatic detection of `railway.toml`

### Step 2: Add PostgreSQL Database
- [ ] In your project, click "New" → "Database" → "Add PostgreSQL"
- [ ] Wait for database creation
- [ ] Copy the database connection URL (optional, Railway auto-configures)

### Step 3: Configure Backend Environment Variables
Go to your backend service → Settings → Environment Variables and add:

**Essential Variables:**
- [ ] `SECRET_KEY` = [Generate a long random string, 32+ chars]
- [ ] `ADMIN_EMAIL` = admin@cypetstore.com
- [ ] `ADMIN_PASSWORD` = [Your secure password]
- [ ] `PROJECT_NAME` = CY Pet Store
- [ ] `CORS_ORIGINS` = [Your Vercel domain, get this after frontend deployment]

**Database (Auto-configured):**
- [ ] `SQLALCHEMY_DATABASE_URI` = `${{Postgres.DATABASE_URL}}`

### Step 4: Deploy and Test Backend
- [ ] Wait for deployment to complete
- [ ] Copy your Railway backend URL (e.g., https://your-project.railway.app)
- [ ] Test API: Visit https://your-backend-url.railway.app/docs
- [ ] Check health: Visit https://your-backend-url.railway.app/health (if available)

## 🌐 Vercel Frontend Deployment

### Step 1: Create Vercel Project
- [ ] Visit https://vercel.com and login with GitHub
- [ ] Click "New Project"
- [ ] Select `Aus-pet-store` repository
- [ ] Click "Import"

### Step 2: Configure Build Settings
- [ ] Framework Preset: `Create React App`
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `build`
- [ ] Install Command: `npm install`

### Step 3: Configure Frontend Environment Variables
Add in Project Settings → Environment Variables:
- [ ] `REACT_APP_API_URL` = [Your Railway backend URL]/api/v1
- [ ] `REACT_APP_APP_NAME` = CY Pet Store
- [ ] `NODE_ENV` = production

### Step 4: Deploy Frontend
- [ ] Click "Deploy"
- [ ] Wait for build and deployment
- [ ] Copy your Vercel frontend URL

## 🔗 Final Configuration

### Update CORS Settings
- [ ] Go back to Railway backend environment variables
- [ ] Update `CORS_ORIGINS` with your actual Vercel URL
- [ ] Redeploy backend if needed

### Test Full Integration
- [ ] Visit your frontend URL
- [ ] Test user registration/login
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test admin panel (login with admin credentials)

## 🎯 URLs After Deployment

After successful deployment, you'll have:

- **Frontend**: https://your-project.vercel.app
- **Backend API**: https://your-project.railway.app/api/v1
- **API Documentation**: https://your-project.railway.app/docs
- **Admin Panel**: https://your-project.vercel.app/admin

## 🔧 Post-Deployment Tasks

### Optional Enhancements
- [ ] Set up custom domain names
- [ ] Configure SSL certificates (usually automatic)
- [ ] Set up monitoring and logging
- [ ] Configure email notifications
- [ ] Add Google Analytics

### Security Checklist
- [ ] Changed default admin password
- [ ] Generated secure SECRET_KEY
- [ ] Updated CORS origins to actual domains
- [ ] Removed debug mode in production
- [ ] Database passwords are secure

## 🆘 Troubleshooting

### Common Issues:

**Backend not starting:**
- Check Railway logs for errors
- Verify all environment variables are set
- Ensure database connection is working

**Frontend can't connect to backend:**
- Verify REACT_APP_API_URL is correct
- Check CORS settings in backend
- Test backend API directly

**Database connection issues:**
- Ensure PostgreSQL addon is added
- Check SQLALCHEMY_DATABASE_URI format
- Verify network connectivity

## 📞 Need Help?

If you encounter issues:
1. Check the logs in Railway/Vercel dashboards
2. Verify all environment variables
3. Test API endpoints directly
4. Check the DEPLOYMENT.md for detailed instructions

---

**Ready to deploy? Let's do this! 🚀**