#!/bin/bash
cd "$(dirname "$0")"

# Development setup script for AI Resume Generator

echo "🚀 Setting up AI Resume Generator..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup environment
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local..."
    cp .env.local.example .env.local
    echo "⚠️  Please update .env.local with your API keys"
else
    echo "✅ .env.local already exists"
fi

# Build project
echo "🏗️  Building project..."
npm run build

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your API keys"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000"
echo ""
