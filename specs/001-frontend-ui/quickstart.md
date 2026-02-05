# Frontend UI Quickstart Guide

## Overview
Quickstart guide for setting up and developing the frontend UI for the Todo application.

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Navigate to Frontend Directory
```bash
cd frontend
```

### 3. Install Dependencies
```bash
npm install
# or
yarn install
```

### 4. Environment Configuration
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-here
```

## Development Server
Start the development server:
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to view the application in development mode.

## Project Structure
```
frontend/
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   ├── login/
│   │   │   └── page.tsx    # Login page
│   │   ├── signup/
│   │   │   └── page.tsx    # Signup page
│   │   ├── dashboard/
│   │   │   └── page.tsx    # Dashboard page
│   │   └── about/
│   │       └── page.tsx    # About page
│   ├── components/         # Reusable UI components
│   │   ├── Button.tsx      # Button component
│   │   ├── Input.tsx       # Input component
│   │   ├── Navbar.tsx      # Navigation component
│   │   └── auth/
│   │       └── ProtectedRoute.tsx
│   ├── lib/                # Utilities and API client
│   │   └── api/
│   ├── styles/             # Global styles
│   │   └── globals.css
│   └── types/              # Type definitions
│       └── index.ts
├── public/                 # Static assets
├── package.json
└── tailwind.config.js      # Tailwind CSS configuration
```

## Available Scripts

### Development
```bash
npm run dev
```
Runs the application in development mode with hot reloading.

### Build
```bash
npm run build
```
Creates an optimized production build.

### Linting
```bash
npm run lint
```
Checks for code quality issues.

### Formatting
```bash
npm run format
```
Formats code using Prettier.

## Key Components

### Reusable Components
- `Button.tsx`: Customizable button component
- `Input.tsx`: Form input with validation support
- `Navbar.tsx`: Responsive navigation bar

### Page Structure
Each page follows the Next.js App Router pattern with:
- Layout composition
- Responsive design
- Error boundaries
- Loading states

## Styling
- Tailwind CSS for utility-first styling
- Responsive design with mobile-first approach
- Consistent color palette and typography
- Accessibility-focused design patterns

## Component Development
To create a new component:
1. Add the component to the `src/components/` directory
2. Export it with proper TypeScript interfaces
3. Use Tailwind CSS for styling
4. Ensure responsive behavior across breakpoints

## API Integration
The frontend is designed to connect to the backend API. When backend endpoints become available:
1. Update the API client in `src/lib/api/`
2. Follow the API contract specifications
3. Implement proper error handling and loading states