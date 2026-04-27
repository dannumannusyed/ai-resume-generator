#!/bin/bash
cd "$(dirname "$0")"

# ============================================================================
# AI Resume Generator - One-Click Start Script
# ============================================================================

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================================${NC}"
echo -e "${BLUE}   🚀  AI RESUME GENERATOR - SYSTEM STARTER                   ${NC}"
echo -e "${BLUE}================================================================${NC}"
echo ""

# 1. Check if Node.js is installed
echo -e "${BOLD}[1/4] Checking environment...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed.${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# 2. Check for dependencies
echo ""
echo -e "${BOLD}[2/4] Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 node_modules not found. Installing dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}✅ dependencies ready${NC}"
fi

# 3. Check for environment variables
echo ""
echo -e "${BOLD}[3/4] Preparing environment variables...${NC}"
if [ ! -f ".env.local" ]; then
    if [ -f ".env.local.example" ]; then
        echo -e "${YELLOW}📝 .env.local not found. Creating from example...${NC}"
        cp .env.local.example .env.local
        echo -e "${YELLOW}⚠️  WARNING: Please update .env.local with your API keys!${NC}"
    else
        echo -e "${RED}❌ Error: .env.local and .env.local.example missing.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ .env.local ready${NC}"
fi

# 4. Start the application
echo ""
echo -e "${BOLD}[4/4] Starting Frontend and API...${NC}"
echo -e "${BLUE}Starting Next.js server on http://localhost:3000${NC}"
echo ""

# Open browser after a short delay
(sleep 5 && open http://localhost:3000 || xdg-open http://localhost:3000 || start http://localhost:3000) &

# Run the app
npm run dev
