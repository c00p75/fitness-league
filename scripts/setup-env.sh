#!/bin/bash

# Setup environment variables for Fitness League
# This script creates the necessary .env.local file

set -e

echo "🔧 Setting up environment variables..."

# Create .env.local from .env.example
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created successfully!"
    echo ""
    echo "⚠️  IMPORTANT: You need to update .env.local with your actual Firebase configuration:"
    echo "   1. Go to Firebase Console: https://console.firebase.google.com/"
    echo "   2. Select project: fit-league-930c6"
    echo "   3. Go to Project Settings > General"
    echo "   4. Copy the Firebase config values to .env.local"
    echo "   5. Generate a service account key for Firebase Admin SDK"
    echo ""
    echo "📚 For detailed setup instructions, see docs/setup.md"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Update .env.local with your Firebase configuration"
echo "2. Start Firebase emulators: firebase emulators:start"
echo "3. Seed development data: ./scripts/seed-emulator.sh"
echo "4. Start development: pnpm dev"
