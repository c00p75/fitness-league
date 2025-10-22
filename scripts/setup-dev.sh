#!/bin/bash

# Complete development environment setup script
# This script sets up the entire development environment

set -e

echo "🚀 Setting up Fitness League development environment..."

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ PNPM is not installed. Installing PNPM..."
    npm install -g pnpm@8
fi

if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Installing Firebase CLI..."
    npm install -g firebase-tools
fi

echo "✅ Prerequisites check completed"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build packages
echo "🔨 Building packages..."
pnpm build

# Setup environment
echo "⚙️ Setting up environment..."
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your Firebase configuration"
fi

# Setup Firebase
echo "🔥 Setting up Firebase..."
if [ ! -f .firebaserc ]; then
    echo "📝 Firebase configuration already exists"
else
    echo "⚠️  Please configure Firebase project:"
    echo "   firebase login"
    echo "   firebase use fit-league-930c6"
fi

echo ""
echo "✅ Development environment setup completed!"
echo ""
echo "🎯 Next steps:"
echo "1. Update .env.local with your Firebase configuration"
echo "2. Configure Firebase project: firebase use fit-league-930c6"
echo "3. Start development servers: pnpm dev"
echo "4. Start Firebase emulators: firebase emulators:start"
echo "5. Seed development data: ./scripts/seed-emulator.sh"
echo ""
echo "📚 For detailed setup instructions, see docs/setup.md"