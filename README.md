# Fitness League 🏋️‍♀️

A gamified fitness tracking web app that helps users set, track, and crush their health goals with personalized workout plans.

## 🚀 Features

- **User Authentication** - Secure sign-up/login with Firebase Auth
- **Personalized Onboarding** - Multi-step setup to understand your fitness goals
- **User Profiles** - Manage personal information and biometrics
- **Workout Tracking** - Log and track your fitness activities
- **Gamification** - Earn badges and maintain streaks
- **Progress Visualization** - Charts and insights into your fitness journey

## 🏗️ Architecture

This is a **PNPM monorepo** built with modern web technologies:

### Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: tRPC API routes integrated in web app
- **Database**: Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **State Management**: TanStack Query
- **UI**: Tailwind CSS + shadcn/ui
- **Validation**: Zod
- **Testing**: Vitest + Playwright + Storybook
- **Build System**: Turborepo + PNPM

### Monorepo Structure

```
fitness-league/
├── apps/
│   └── web/                 # React app with integrated API routes
│       ├── src/api/        # tRPC API routes (replaces functions/)
│       ├── src/components/ # React components
│       ├── src/pages/      # Page components
│       └── src/lib/        # Utilities and configurations
├── packages/
│   ├── shared/             # Shared Zod schemas and types
│   ├── ui/                 # Shared UI components and design system
│   ├── env/                # Environment variable validation
│   ├── seeding/            # Test fixtures and seed data
│   └── tsconfig/           # Shared TypeScript configurations
├── docs/                   # Project documentation
└── firebase.json           # Firebase configuration (hosting only)
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ 
- PNPM 8+
- Firebase CLI
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fitness-league
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Firebase project configuration in `.env.local`:
   ```env
   FIREBASE_PROJECT_ID=fit-league-930c6
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=fit-league-930c6.firebaseapp.com
   # ... other Firebase config
   ```

4. **Set up Firebase project**
   ```bash
   firebase login
   firebase use fit-league-930c6
   ```

5. **Start development servers**
   ```bash
   # Start all services
   pnpm dev
   
   # Or start individually:
   pnpm --filter @fitness-league/web dev    # Frontend (port 5173)
   firebase emulators:start                 # Firebase emulators
   ```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @fitness-league/web test

# Run E2E tests
pnpm test:e2e

# Run Storybook
pnpm storybook
```

### Test Coverage

- **Unit Tests**: Vitest for utilities and hooks
- **Component Tests**: Testing Library for React components  
- **E2E Tests**: Playwright for full user journeys
- **Visual Tests**: Storybook for component documentation

## 🚀 Deployment

### Firebase Hosting

```bash
# Build for production
pnpm --filter @fitness-league/web build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Full Deployment

```bash
# Deploy everything
firebase deploy
```

## 📁 Project Structure

### Frontend (`apps/web/`)

- `src/pages/` - Page components (auth, onboarding, profile, dashboard)
- `src/components/` - Reusable UI components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utilities and configurations
- `src/api/` - tRPC API routes and routers
- `src/types/` - TypeScript type definitions

### API Routes (`apps/web/src/api/`)

- `routers/` - tRPC route handlers (auth, user, onboarding)
- `context.ts` - Request context with Firebase Admin SDK
- `trpc.ts` - tRPC configuration with protected procedures
- `index.ts` - Main app router combining all routers

### Shared Packages

- `packages/shared/` - Zod schemas and shared types
- `packages/ui/` - Design system and UI components
- `packages/env/` - Environment variable validation
- `packages/seeding/` - Test data and fixtures

## 🔧 Development Commands

```bash
# Development
pnpm dev                    # Start all dev servers
pnpm build                  # Build all packages
pnpm lint                   # Lint all packages
pnpm typecheck              # Type check all packages

# Package-specific
pnpm --filter <package> <command>

# Firebase
firebase emulators:start    # Start local emulators
firebase deploy             # Deploy to production
```

## 🎨 Design System

The app uses a custom design system built on Tailwind CSS and shadcn/ui:

- **Colors**: Dark theme with fitness-focused accent colors
- **Typography**: SF Pro Text for modern, clean look
- **Components**: Accessible, customizable UI components
- **Layout**: Responsive grid system with mobile-first approach

## 🔒 Security

- **Authentication**: Firebase Auth with email/password
- **Authorization**: Firestore security rules for user-scoped data
- **Validation**: Zod schemas for type-safe data validation
- **Environment**: T3 Env for secure environment variable handling

## 📊 Data Model

### Firestore Collections

- `artifacts/{appId}/users/{uid}/profile` - User profiles
- `artifacts/{appId}/users/{uid}/workoutLogs` - Workout history
- `artifacts/{appId}/users/{uid}/goals` - Fitness goals
- `artifacts/{appId}/public/data/exercises` - Exercise library
- `artifacts/{appId}/public/data/badges` - Badge definitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join community discussions in GitHub Discussions

---

**Built with ❤️ for the fitness community**