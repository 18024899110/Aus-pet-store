# 🚀 CY Pet Store Deployment Guide

## Prerequisites
- Git repository (GitHub/GitLab)
- Railway account
- Vercel account (optional, for frontend)

## 🏗️ Deployment Architecture

```
Frontend (React) → Vercel/Netlify
       ↓
Backend (FastAPI) → Railway
       ↓
Database (PostgreSQL) → Railway
```

## 📋 Step-by-Step Deployment

### 1. Prepare Your Code Repository

1. **Initialize Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/cy-pet-store.git
   git push -u origin main
   ```

### 2. Deploy Backend on Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Connect your GitHub repository**
3. **Add PostgreSQL database:**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Copy the database URL

4. **Deploy backend:**
   - Click "New" → "GitHub Repo" → Select your repository
   - Railway will automatically detect the `railway.toml` file

5. **Set Environment Variables in Railway:**
   ```env
   SECRET_KEY=generate-a-long-random-string-here
   SQLALCHEMY_DATABASE_URI=postgresql://user:pass@host:port/dbname
   CORS_ORIGINS=https://your-frontend-domain.vercel.app
   ADMIN_EMAIL=admin@yourstore.com
   ADMIN_PASSWORD=SecurePassword123!
   PROJECT_NAME=CY Pet Store
   ```

6. **Get your backend URL:**
   - It will be something like: `https://your-app-name.railway.app`

### 3. Deploy Frontend on Vercel

1. **Go to [Vercel.com](https://vercel.com)**
2. **Import your repository**
3. **Configure build settings:**
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **Set Environment Variables in Vercel:**
   ```env
   REACT_APP_API_URL=https://your-backend.railway.app/api/v1
   REACT_APP_APP_NAME=CY Pet Store
   ```

5. **Deploy and get your frontend URL**

### 4. Update CORS Settings

Update your backend environment variables in Railway:
```env
CORS_ORIGINS=https://your-actual-frontend-domain.vercel.app
```

## 🔧 Alternative: Single Platform Deployment

### Deploy Everything on Railway

1. **Create `nixpacks.toml`:**
   ```toml
   [variables]
   NODE_VERSION = "18"
   PYTHON_VERSION = "3.11"

   [phases.setup]
   aptPkgs = ["python3", "python3-pip", "nodejs", "npm"]

   [phases.build]
   cmds = [
     "cd frontend && npm install && npm run build",
     "cd backend && pip install -r requirements.txt"
   ]

   [phases.deploy]
   startCommand = "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT"
   ```

2. **Update backend to serve frontend:**
   Add to `backend/app/main.py`:
   ```python
   from fastapi.staticfiles import StaticFiles
   
   # Serve React build files
   app.mount("/", StaticFiles(directory="frontend/build", html=True), name="frontend")
   ```

## 🗄️ Database Migration

1. **Connect to your production database:**
   ```bash
   # Use the DATABASE_URL from Railway
   export SQLALCHEMY_DATABASE_URI="postgresql://..."
   ```

2. **Run database initialization:**
   The app will automatically create tables on first run.

## 🔒 Security Checklist

- [ ] Change default SECRET_KEY
- [ ] Change default admin password
- [ ] Update CORS origins to your actual domains
- [ ] Enable HTTPS only
- [ ] Set strong database passwords
- [ ] Review file upload permissions

## 🚀 Custom Domain (Optional)

### For Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown

### For Railway:
1. Go to Project Settings → Domains
2. Add custom domain
3. Configure DNS CNAME record

## 📊 Monitoring & Analytics

### Add Error Tracking (Sentry):
```env
REACT_APP_SENTRY_DSN=your-sentry-dsn
```

### Add Analytics (Google Analytics):
```env
REACT_APP_GA_ID=your-ga-id
```

## 🔄 CI/CD Pipeline (Optional)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Railway
        uses: railwayapp/railway-deploy@v1
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
```

## 🎯 Performance Optimization

1. **Enable gzip compression**
2. **Use CDN for static assets**
3. **Implement database connection pooling**
4. **Add Redis for caching (optional)**

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Error:**
   - Check CORS_ORIGINS in backend
   - Ensure frontend URL is correct

2. **Database Connection:**
   - Verify DATABASE_URL format
   - Check network connectivity

3. **Build Fails:**
   - Check Node.js/Python versions
   - Verify all dependencies are installed

4. **API Not Working:**
   - Check backend logs in Railway
   - Verify environment variables

## 📞 Support

If you encounter issues:
1. Check Railway/Vercel logs
2. Review environment variables
3. Test API endpoints directly
4. Check database connections

---

**🎉 Congratulations! Your CY Pet Store is now live!**

Frontend: `https://your-frontend.vercel.app`
Backend API: `https://your-backend.railway.app`
API Docs: `https://your-backend.railway.app/docs`