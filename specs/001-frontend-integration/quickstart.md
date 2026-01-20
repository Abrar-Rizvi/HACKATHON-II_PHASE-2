# Quickstart Guide: Frontend Integration & Responsive UI for Full-Stack Todo App

## Prerequisites

- Node.js 18+ installed
- Access to the backend API (FastAPI server running)
- Better Auth configured with JWT authentication

## Setup

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

3. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

4. **Environment Configuration**:
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   NEXTAUTH_URL=http://localhost:3000
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser** to [http://localhost:3000](http://localhost:3000) to see the application.

## Key Features

### Authentication Flow
- Users can register and login via the authentication pages
- Better Auth handles JWT token management automatically
- Protected routes are restricted to authenticated users only

### Task Management
- **List Tasks**: View all tasks with completion status
- **Create Task**: Add new tasks with title, description, and due date
- **Update Task**: Edit existing task details
- **Delete Task**: Remove tasks from the list
- **Toggle Completion**: Mark tasks as complete/incomplete

### Responsive Design
- Mobile-first design approach
- Adapts to different screen sizes (mobile, tablet, desktop)
- Touch-friendly controls for mobile devices

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages (login, dashboard, etc.)
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

## Authentication Integration

Better Auth is integrated throughout the application:

- Session management with automatic token refresh
- Protected routes that redirect unauthenticated users
- User context available throughout the application
- Secure API requests with JWT tokens

## Running Tests

Execute the following command to run tests:

```bash
npm run test
# or
yarn test
# or
pnpm test
```

For tests with coverage:

```bash
npm run test:coverage
# or
yarn test:coverage
# or
pnpm test:coverage
```

## Build for Production

To build the application for production:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

Then serve the application:

```bash
npm run start
# or
yarn start
# or
pnpm start
```