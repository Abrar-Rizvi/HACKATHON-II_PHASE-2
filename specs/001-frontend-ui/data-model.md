# Data Model: Frontend UI Components

## Overview
Data model for frontend UI components and structures for the Todo application frontend.

## UI Components

### Button Component
**Entity**: Button
**Props**:
- variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
- size: 'sm' | 'md' | 'lg'
- disabled: boolean
- children: ReactNode
- onClick?: () => void
- className?: string
- type?: 'button' | 'submit' | 'reset'

**Validation**:
- Must have either children or aria-label for accessibility
- Disabled state prevents onClick execution

### Input Component
**Entity**: Input
**Props**:
- type: 'text' | 'email' | 'password' | 'tel' | 'url'
- placeholder?: string
- value?: string
- onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
- error?: string
- label?: string
- required?: boolean
- className?: string

**Validation**:
- Email type must pass email validation
- Password must meet minimum length requirements (if specified)
- Required fields must have values

### Navbar Component
**Entity**: Navbar
**Props**:
- logoText: string
- navLinks: Array<{name: string, href: string}>
- user?: {name: string, avatar?: string} // For authenticated state
- onLogout?: () => void

**State Transitions**:
- Anonymous → Authenticated (when user logs in)
- Authenticated → Anonymous (when user logs out)

## Page Structures

### Home Page
**Entity**: HomePage
**Components**:
- Navbar (anonymous view)
- HeroSection
- CallToActionButtons (Login, SignUp)

### Login Page
**Entity**: LoginPage
**Components**:
- LoginForm (with email, password fields)
- Navigation links (to SignUp)

**State**:
- Loading: boolean
- Error: string | null
- FormData: {email: string, password: string}

### Signup Page
**Entity**: SignupPage
**Components**:
- SignupForm (with name, email, password fields)
- Navigation links (to Login)

**State**:
- Loading: boolean
- Error: string | null
- FormData: {name: string, email: string, password: string}

### Dashboard Page
**Entity**: DashboardPage
**Components**:
- Navbar (authenticated view with user dropdown)
- TodoListPlaceholder
- AddTodoButton
- EmptyState

**State**:
- User: {id: string, name: string, email: string}
- Todos: Array<TodoItem>

### About Page
**Entity**: AboutPage
**Components**:
- StaticContent
- Navigation links

## Form Validation Rules

### Login Form Validation
- Email: Required, must be valid email format
- Password: Required, minimum 6 characters
- Real-time validation enabled as user types

### Signup Form Validation
- Name: Required, 2-50 characters
- Email: Required, must be valid email format
- Password: Required, minimum 8 characters with complexity
- Real-time validation enabled as user types

## Responsive Breakpoints

### Breakpoint Definitions
- Mobile: width < 768px
- Tablet: width >= 768px AND width <= 1024px
- Desktop: width > 1024px

**Component Adaptations**:
- Navbar: Hamburger menu on mobile, full navigation on tablet/desktop
- Forms: Full-width on mobile, centered card on tablet/desktop
- Grid layouts: Single column on mobile, multi-column on tablet/desktop