#!/bin/bash

# Seed Firebase Emulator with development data
# This script builds the seeding package and runs the seed script

set -e

echo "🌱 Seeding Firebase Emulator..."

# Build the seeding package
echo "📦 Building seeding package..."
pnpm --filter @fitness-league/seeding build

# Check if Firebase emulators are running
if ! curl -s http://localhost:4000 > /dev/null; then
    echo "❌ Firebase emulators are not running. Please start them first:"
    echo "   firebase emulators:start"
    exit 1
fi

# Run the seeding script
echo "🌱 Running seed script..."
pnpm --filter @fitness-league/seeding seed:emulator

echo "✅ Emulator seeding completed successfully!"
echo ""
echo "📧 Demo user email: demo@fitnessteam.com"
echo "🔑 Demo user UID: demo-user-123"
echo "🏃‍♂️ Exercise library: 12+ exercises loaded"
echo "🏆 Badge definitions: 15+ badges loaded"
echo ""
echo "You can now test the application with the demo user account."