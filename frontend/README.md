# Todo App Frontend

This is the frontend for the secure Todo application with authentication and task management features.

## Features

- User authentication (login/register)
- Task management (create, read, update, delete, toggle completion)
- Responsive design for mobile, tablet, and desktop
- Loading and error state handling
- JWT-based authentication with automatic token management

## Tech Stack

- Next.js 16+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- Better Auth (for authentication)

## Getting Started

### Prerequisites

- Node.js 18+
- Access to the backend API (FastAPI server running)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: The base URL of the backend API

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with auth provider
│   ├── page.tsx            # Home page (redirects based on auth status)
│   ├── login/page.tsx      # Login page
│   ├── register/page.tsx   # Registration page
│   └── dashboard/
│       ├── page.tsx        # Task dashboard
│       └── layout.tsx      # Dashboard layout
├── components/             # Reusable React components
│   ├── TaskCard.tsx        # Component to display individual tasks
│   ├── TaskForm.tsx        # Form for creating/updating tasks
│   ├── TaskList.tsx        # Component to display list of tasks
│   └── AuthProvider.tsx    # Better Auth integration component
├── lib/                    # Utilities and API client
│   ├── api.ts              # API client with JWT token handling
│   └── auth.ts             # Authentication utilities
├── types/                  # TypeScript type definitions
│   ├── task.ts             # Task interface/type
│   └── user.ts             # User interface/type
├── hooks/                  # Custom React hooks
│   ├── useTasks.ts         # Hook for task operations
│   └── useAuth.ts          # Hook for authentication state
└── styles/                 # Global styles and Tailwind configuration
    └── globals.css         # Global CSS including Tailwind directives
```

## API Integration

The frontend communicates with the backend through a centralized API client that automatically attaches JWT tokens to requests. The API client handles:

- Authentication token inclusion in headers
- Request/response transformation
- Error handling and user feedback
- Loading state management
- Token validation and refresh

## Authentication

Authentication is handled through:

- Session management with automatic token refresh
- Protected routes that redirect unauthenticated users
- User context available throughout the application
- Secure API requests with JWT tokens

## Development

To run the application in development mode:

```bash
npm run dev
```

To build the application for production:

```bash
npm run build
```

To start the production build:

```bash
npm start
```
