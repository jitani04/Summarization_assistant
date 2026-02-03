#!/bin/bash

# Quick Setup Script for Summarization Assistant

echo "🚀 Starting Complete Setup..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
echo "✅ Backend dependencies installed"
echo ""

# Install Playwright Chromium
echo "📥 Installing Playwright Chromium browser (~200MB, please wait)..."
npx playwright install chromium
if [ $? -ne 0 ]; then
    echo "❌ Playwright installation failed"
    exit 1
fi
echo "✅ Chromium installed"
echo ""

cd ..

# Check for .env file
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your VITE_GOOGLE_GEMINI_API_KEY"
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📚 Next Steps:"
echo ""
echo "1️⃣  Add your Google Gemini API key to .env:"
echo "   VITE_GOOGLE_GEMINI_API_KEY=your_key_here"
echo ""
echo "2️⃣  Run the application:"
echo ""
echo "   Option A: Frontend only (no bot gate support)"
echo "   $ npm run dev"
echo ""
echo "   Option B: Full stack (with bot gate support)"
echo "   $ npm run dev:all"
echo ""
echo "3️⃣  Open browser:"
echo "   http://localhost:5173"
echo ""
echo "📖 For more details, see SETUP_GUIDE.md"
echo ""
