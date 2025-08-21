#!/bin/bash

echo "🚀 Starting CY Pet Store Deployment..."

# Check for Git changes
if [[ -n $(git status -s) ]]; then
    echo "📝 Found code changes, preparing to commit..."
    git add .
    echo "Enter commit message:"
    read commit_message
    git commit -m "$commit_message"
    git push
    echo "✅ Code pushed to repository"
else
    echo "ℹ️ No code changes detected"
fi

# Build frontend
echo "🔨 Building frontend application..."
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Build production version
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

cd ..

# Check backend dependencies
echo "🔍 Checking backend dependencies..."
cd backend

if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate || source venv/Scripts/activate

# Install Python dependencies
echo "📦 Installing backend dependencies..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend dependency installation failed"
    exit 1
fi

cd ..

echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. 🌐 Deploy frontend to Vercel: https://vercel.com"
echo "2. 🔗 Deploy backend to Railway: https://railway.app"
echo "3. 🗄️ Set up PostgreSQL database on Railway"
echo "4. ⚙️ Configure environment variables"
echo ""
echo "📚 Full deployment guide: See DEPLOYMENT.md"
echo "🔧 API Documentation: /docs endpoint on your backend"