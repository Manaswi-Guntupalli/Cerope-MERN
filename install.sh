#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}================================${NC}"
echo -e "${CYAN}Cerope MERN Stack Installation${NC}"
echo -e "${CYAN}================================${NC}"
echo ""

# Check if Node.js is installed
echo -e "${YELLOW}Checking for Node.js...${NC}"
if command -v node &> /dev/null
then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js found: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js not found. Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

# Check for npm
if command -v npm &> /dev/null
then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm found: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi

# MongoDB check
echo ""
echo -e "${YELLOW}Checking for MongoDB...${NC}"
echo -e "${NC}Note: Make sure MongoDB is installed and running${NC}"
echo -e "${NC}  - Local: MongoDB service should be running${NC}"
echo -e "${NC}  - Or use MongoDB Atlas cloud connection${NC}"

# Install Backend Dependencies
echo ""
echo -e "${CYAN}================================${NC}"
echo -e "${CYAN}Installing Backend Dependencies${NC}"
echo -e "${CYAN}================================${NC}"
cd backend
echo -e "${YELLOW}Running: npm install${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed successfully${NC}"
else
    echo -e "${RED}✗ Backend installation failed${NC}"
    cd ..
    exit 1
fi
cd ..

# Install Frontend Dependencies
echo ""
echo -e "${CYAN}================================${NC}"
echo -e "${CYAN}Installing Frontend Dependencies${NC}"
echo -e "${CYAN}================================${NC}"
cd frontend
echo -e "${YELLOW}Running: npm install${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed successfully${NC}"
else
    echo -e "${RED}✗ Frontend installation failed${NC}"
    cd ..
    exit 1
fi
cd ..

# Success Message
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Installation Complete! ✓${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${CYAN}Next Steps:${NC}"
echo -e "${NC}1. Make sure MongoDB is running${NC}"
echo -e "${NC}2. Open TWO terminal windows${NC}"
echo ""
echo -e "${YELLOW}Terminal 1 - Start Backend:${NC}"
echo -e "${NC}  cd backend${NC}"
echo -e "${NC}  npm run dev${NC}"
echo ""
echo -e "${YELLOW}Terminal 2 - Start Frontend:${NC}"
echo -e "${NC}  cd frontend${NC}"
echo -e "${NC}  npm run dev${NC}"
echo ""
echo -e "${CYAN}Then open your browser to: http://localhost:3000${NC}"
echo ""
echo -e "${NC}For detailed instructions, see README.md or QUICKSTART.md${NC}"
echo ""
