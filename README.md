# Fitness League 🏋️‍♀️

## 📗 Table of Contents
- [📗 Table of Contents](#-table-of-contents)
- [📖 About](#-about)
  - [🛠️ Built With](#️-built-with)
    - [Tech Stack](#tech-stack)
    - [Key Features](#key-features)
  - [🚀 Live Demo](#-deployment-link)
  - [💻 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Installation](#installation)
    - [Environment Setup](#environment-setup)
  - [📜 Available Scripts](#-available-scripts)
  - [🏗️ Project Structure](#️-project-structure)
  - [🧪 Testing](#-testing)
  - [📖 Documentation](#-documentation)
  - [🤝 Contributing](#-contributing)
  - [⭐️ Show Your Support](#️-show-your-support)
  - [🙏 Acknowledgments](#-acknowledgments)
  - [📝 License](#-license)
  - [⚠️ Disclaimer](#️-disclaimer)

## 📖 About <a name="about-project"></a>

**Fitness League** is a fitness tracking web application that helps users set, track, and achieve their health goals with personalized workout plans. Built with modern technologies including React, TypeScript, Firebase, and TanStack Query, the app provides a comprehensive platform for managing fitness goals, tracking workouts, and monitoring progress.

## 🛠️ Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>
<details>
  <summary>Frontend</summary>
  <ul>
    <li><a href="https://reactjs.org/">React 18</a> - UI library</li>
    <li><a href="https://www.typescriptlang.org/">TypeScript</a> - Type safety</li>
    <li><a href="https://vitejs.dev/">Vite</a> - Build tool</li>
    <li><a href="https://tailwindcss.com/">Tailwind CSS</a> - Styling</li>
    <li><a href="https://ui.shadcn.com/">shadcn/ui</a> - Component library</li>
    <li><a href="https://reactrouter.com/">React Router</a> - Routing</li>
  </ul>
 </details>

<details>
  <summary>Backend & Database</summary>
  <ul>
    <li><a href="https://firebase.google.com/">Firebase</a> - Backend services</li>
    <li><a href="https://firebase.google.com/docs/firestore">Firestore</a> - NoSQL database</li>
    <li><a href="https://firebase.google.com/docs/auth">Firebase Auth</a> - Authentication</li>
    <li><a href="https://firebase.google.com/docs/storage">Firebase Storage</a> - File storage</li>
  </ul>
 </details>

<details>
  <summary>State Management & Data Fetching</summary>
  <ul>
    <li><a href="https://tanstack.com/query">TanStack Query</a> - Server state management</li>
    <li><a href="https://www.react-hook-form.com/">React Hook Form</a> - Form handling</li>
  </ul>
 </details>

<details>
  <summary>Development Tools</summary>
  <ul>
    <li><a href="https://pnpm.io/">PNPM</a> - Package manager</li>
    <li><a href="https://turbo.build/">Turborepo</a> - Monorepo build system</li>
    <li><a href="https://vitest.dev/">Vitest</a> - Testing framework</li>
    <li><a href="https://playwright.dev/">Playwright</a> - E2E testing</li>
    <li><a href="https://storybook.js.org/">Storybook</a> - Component development</li>
  </ul>
 </details>

<details>
  <summary>Validation & Security</summary>
  <ul>
    <li><a href="https://zod.dev/">Zod</a> - Schema validation</li>
    <li><a href="https://eslint.org/">ESLint</a> - Code linting</li>
  </ul>
 </details>

### Key Features
- **🔐 Secure Authentication** - Email/password authentication with Firebase Auth
- **🎯 Goal Management** - Create, track, and update fitness goals with progress visualization
- **💪 Workout Plans** - Generate personalized workout plans based on goals and preferences
- **📊 Progress Tracking** - Real-time progress monitoring with charts and analytics
- **🏆 Gamification** - Earn badges and maintain streaks for motivation
- **👤 User Profiles** - Manage personal information and biometrics
- **📱 Responsive Design** - Mobile-first design that works on all devices
- **♿ Accessible** - WCAG 2.1 AA compliant for optimal accessibility
- **⚡ High Performance** - Code splitting, lazy loading, and optimized builds

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🚀 Live Demo <a name="deployment-link"></a>

Live demo: [Fitness League](https://fit-league-930c6.web.app/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 💻 Getting Started <a name="getting-started"></a>

This is a monorepo project built with [Vite](https://vitejs.dev/) and managed with [PNPM](https://pnpm.io/).

### Prerequisites

- **Node.js** 18+ 
- **PNPM** 8+
- **Firebase CLI**
- **Git**

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fitness-league.git
   cd fitness-league
   ```

### Installation

2. **Install dependencies**
   ```bash
   pnpm install
   ```

### Environment Setup

3. **Create environment file**
   
   Create a `.env.local` file in the `apps/web` directory:
   ```env
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. **Set up Firebase**
   ```bash
   firebase login
   firebase use your-project-id
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 📜 Available Scripts <a name="available-scripts"></a>

### Root Level

Run these commands from the project root:

   ```bash
# Development
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm typecheck        # Type check all packages
pnpm test             # Run all tests
pnpm test:e2e         # Run E2E tests
pnpm storybook        # Start Storybook

# Firebase
pnpm setup            # Run setup script
pnpm seed             # Seed emulator with test data
pnpm deploy           # Build and deploy to Firebase
```

### App Level (`apps/web`)

```bash
cd apps/web

# Start development server
pnpm dev              # Runs on http://localhost:5173

# Build for production
pnpm build            # Outputs to apps/web/dist

# Preview production build
pnpm preview          # Local preview of built app

# Run tests
pnpm test             # Run unit tests
pnpm test:ui          # Run tests with UI

# Type check
pnpm typecheck        # Check TypeScript types

# Lint code
pnpm lint             # ESLint check

# Storybook
pnpm storybook        # Start Storybook
pnpm build-storybook  # Build Storybook for production
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🏗️ Project Structure <a name="project-structure"></a>

```
fitness-league/
├── apps/
│   └── web/                          # React frontend application
│       ├── src/
│       │   ├── components/          # Reusable React components
│       │   │   ├── auth/            # Authentication components
│       │   │   ├── goals/           # Goal-related components
│       │   │   ├── layout/          # Layout components
│       │   │   ├── onboarding/      # Onboarding flow components
│       │   │   ├── ui/              # UI components
│       │   │   ├── video/           # Video player components
│       │   │   └── workouts/        # Workout components
│       │   ├── pages/              # Page components
│       │   │   ├── auth/           # Login, Signup pages
│       │   │   ├── dashboard/      # Dashboard page
│       │   │   ├── goals/          # Goals pages
│       │   │   ├── onboarding/     # Onboarding page
│       │   │   ├── profile/        # Profile page
│       │   │   ├── videos/         # Videos page
│       │   │   └── workouts/       # Workout pages
│       │   ├── services/          # Firestore service layer
│       │   │   └── firestore/     # Database services
│       │   ├── hooks/             # Custom React hooks
│       │   ├── lib/               # Utilities and configurations
│       │   ├── types/            # TypeScript type definitions
│       │   └── utils/            # Helper functions
│       ├── public/                # Static assets
│       └── dist/                 # Build output
├── packages/
│   ├── shared/                   # Shared Zod schemas and types
│   ├── ui/                       # Shared UI components
│   ├── env/                      # Environment variable validation
│   ├── seeding/                 # Test fixtures and seed data
│   └── tsconfig/                # Shared TypeScript configs
├── docs/                        # Project documentation
│   ├── archive/                 # Archived documentation
│   ├── architecture.md          # Architecture overview
│   ├── commands.md              # Command reference
│   ├── design-guidelines.md     # Design standards
│   ├── rubric.md               # Grading rubric
│   └── setup.md                # Setup instructions
├── scripts/                    # Utility scripts
│   ├── seed-emulator.sh       # Seed script
│   ├── setup-dev.sh           # Dev setup script
│   └── setup-env.sh           # Environment setup script
├── tests/                      # E2E tests
│   └── e2e/
├── firebase.json              # Firebase configuration
├── firestore.rules           # Firestore security rules
├── firestore.indexes.json    # Firestore indexes
└── turbo.json                # Turborepo configuration
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🧪 Testing <a name="testing"></a>

### Unit Tests
```bash
pnpm test              # Run all unit tests
pnpm test --watch      # Run tests in watch mode
pnpm test:ui           # Run tests with Vitest UI
```

### E2E Tests
```bash
pnpm test:e2e          # Run Playwright E2E tests
```

### Component Tests
```bash
pnpm storybook         # Start Storybook for visual testing
```

### Test Coverage
- **Unit Tests**: Vitest for utilities and hooks
- **Component Tests**: Testing Library for React components  
- **E2E Tests**: Playwright for full user journeys
- **Visual Tests**: Storybook for component documentation

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 📖 Documentation <a name="documentation"></a>

Detailed documentation is available in the `/docs` directory:

- **[Architecture](./docs/architecture.md)** - System architecture overview
- **[Commands](./docs/commands.md)** - Command reference guide
- **[Design Guidelines](./docs/design-guidelines.md)** - Design system documentation
- **[Setup](./docs/setup.md)** - Detailed setup instructions
- **[Technical Design Doc](./docs/Technical%20Design%20Doc.md)** - Complete technical design document

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🤝 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Feel free to check the [issues page](https://github.com/yourusername/fitness-league/issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## ⭐️ Show Your Support <a name="support"></a>

Give a ⭐️ if you like this project!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🙏 Acknowledgments <a name="acknowledgments"></a>

- Special thanks to [Hytel](https://www.hytel.io/) for the bootcamp project framework.
- Design idea was inspired by [Ronas IT on Dribbble](https://dribbble.com/shots/25956041-Fitness-Web-App-UI-Design)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 📝 License <a name="license"></a>

This project is [MIT](./LICENSE) licensed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## ⚠️ Disclaimer

This is an educational demonstration project. Please note:

- This project is intended for demonstration and educational purposes only
- It is not associated with or representative of any real fitness organization
- Firebase emulator is used for local development only
- Do not use production Firebase credentials for testing

If you have any questions or concerns about the project, please feel free to create an issue for clarification.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
