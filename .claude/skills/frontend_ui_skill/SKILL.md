---
name: eye-catching-frontend-ui
description: Create modern, eye-catching, responsive UI components for Todo app with glassmorphism buttons, gradient themes, hover animations, responsive grids, and accessibility best practices. Use when building task cards, forms, auth screens, buttons, and layouts in Next.js + Tailwind.
---

# Eye-Catching Frontend UI Skill

## Core Instructions
You are an expert in creating **modern, visually stunning, responsive** UI for Todo applications using **Next.js 16+ (App Router)**, **TypeScript**, and **Tailwind CSS**.

**Must-follow design principles:**
- Eye-catching & premium feel: Combine **glassmorphism** (frosted glass) with **vibrant gradients**
- Responsive: Mobile-first, fluid layouts (sm/md/lg/xl breakpoints)
- Dark mode support: Use `dark:` prefix consistently
- Accessibility: Semantic HTML, ARIA labels, keyboard focus, sufficient contrast (WCAG AA), focus rings
- Performance: Lazy load images, optimize with Next.js `<Image>`, avoid heavy animations on mobile
- Reusability: Components in `/frontend/components`, pages/layouts in `/frontend/app`

## Key Styles & Patterns

### 1. Glassmorphism Buttons & Elements
- Semi-transparent background + backdrop blur
- Subtle border & inner shadow
- Hover: scale up, brighter gradient, stronger blur/shadow

Example button:
```tsx
<button
  className="relative overflow-hidden rounded-xl px-6 py-3 font-medium text-white transition-all duration-300
             bg-gradient-to-r from-indigo-500/80 to-purple-600/80 backdrop-blur-md border border-white/20
             shadow-lg hover:scale-105 hover:shadow-xl hover:from-indigo-600/90 hover:to-purple-700/90
             focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900"
  aria-label="Add Task"
>
  <span className="relative z-10">Add Task</span>
</button>
```

### 2. Gradient Themes
Use these gradient palettes consistently:
- Primary: `from-indigo-500 to-purple-600`
- Success: `from-green-400 to-emerald-500`
- Warning: `from-yellow-400 to-orange-500`
- Danger: `from-red-400 to-pink-500`
- Info: `from-blue-400 to-cyan-500`

### 3. Task Cards
```tsx
<div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 p-4 shadow-md transition-all hover:shadow-lg hover:scale-[1.01]">
  <h3 className="text-lg font-semibold text-white mb-2">Task Title</h3>
  <p className="text-gray-300 text-sm mb-3">Task description goes here</p>
  <div className="flex gap-2">
    <button className="glassmorphism-button bg-green-500/80 hover:bg-green-600/90">Complete</button>
    <button className="glassmorphism-button bg-red-500/80 hover:bg-red-600/90">Delete</button>
  </div>
</div>
```

### 4. Responsive Grid Layouts
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
  {/* Task cards go here */}
</div>
```

### 5. Forms with Glassmorphism
```tsx
<form className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 space-y-4">
  <div>
    <label htmlFor="title" className="block text-sm font-medium text-white mb-1">Title</label>
    <input
      type="text"
      id="title"
      className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      placeholder="Enter task title"
    />
  </div>
  <button type="submit" className="glassmorphism-button w-full">
    Create Task
  </button>
</form>
```

### 6. Authentication Screens
```tsx
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
  <div className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
    <h1 className="text-2xl font-bold text-center text-white mb-6">Welcome Back</h1>
    <form className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email</label>
        <input
          type="email"
          id="email"
          className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white mb-1">Password</label>
        <input
          type="password"
          id="password"
          className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
        />
      </div>
      <button type="submit" className="glassmorphism-button w-full mt-2">
        Sign In
      </button>
    </form>
  </div>
</div>
```

### 7. Navigation & Layout
```tsx
<nav className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      <div className="flex items-center">
        <span className="text-xl font-bold text-white">TodoMaster</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="glassmorphism-button hidden sm:block">New Task</button>
        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <UserIcon className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  </div>
</nav>
```

### 8. Animations & Transitions
- Use `transition-all duration-300` for smooth state changes
- Hover effects: `hover:scale-105`, `hover:shadow-xl`
- Focus states: `focus:ring-2 focus:ring-indigo-400`
- Loading states: `animate-pulse` for skeleton loaders

### 9. Dark Mode Support
```tsx
// Use dark: prefix for dark mode variants
dark:bg-gray-800 dark:text-white
dark:border-gray-700
dark:focus:ring-indigo-500
```

### 10. Accessibility Features
- Semantic HTML5 elements
- ARIA attributes: `aria-label`, `aria-live`, `aria-hidden`
- Keyboard navigation support
- Focus management with `focus:ring` and `focus:ring-offset`
- Sufficient color contrast (WCAG AA compliance)
- Screen reader support with proper labels

## Implementation Guidelines

1. **Component Structure**:
   - Reusable components in `/frontend/components/ui/`
   - Page-specific components in `/frontend/components/[page-name]/`
   - Layouts in `/frontend/app/layout.tsx`

2. **Performance Optimization**:
   - Use Next.js `<Image>` for optimized images
   - Lazy load non-critical components
   - Avoid heavy animations on mobile devices
   - Use CSS transforms for animations (GPU accelerated)

3. **Responsive Design**:
   - Mobile-first approach
   - Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:)
   - Test on multiple screen sizes
   - Ensure touch targets are at least 48x48px

4. **Testing & Quality**:
   - Visual regression testing
   - Accessibility audits (axe, Lighthouse)
   - Cross-browser compatibility
   - Performance testing (Lighthouse scores > 90)

## Usage Examples

### Creating a Task Card Component
```tsx
// frontend/components/ui/TaskCard.tsx
import React from 'react';

interface TaskCardProps {
  title: string;
  description: string;
  status: 'pending' | 'completed';
  onComplete: () => void;
  onDelete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  status,
  onComplete,
  onDelete
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 p-4 shadow-md transition-all hover:shadow-lg hover:scale-[1.01]">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
        }`}>
          {status}
        </span>
      </div>
      <p className="text-gray-300 text-sm mb-4">{description}</p>
      <div className="flex gap-2">
        <button
          onClick={onComplete}
          className="glassmorphism-button bg-green-500/80 hover:bg-green-600/90 flex-1"
        >
          Complete
        </button>
        <button
          onClick={onDelete}
          className="glassmorphism-button bg-red-500/80 hover:bg-red-600/90 flex-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
```

### Using the Task Card in a Page
```tsx
// frontend/app/tasks/page.tsx
import TaskCard from '@/components/ui/TaskCard';

export default function TasksPage() {
  const tasks = [
    {
      id: 1,
      title: 'Build UI Components',
      description: 'Create glassmorphism task cards and buttons',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Add Authentication',
      description: 'Implement JWT auth with glassmorphism forms',
      status: 'completed'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Your Tasks</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              status={task.status}
              onComplete={() => console.log('Complete', task.id)}
              onDelete={() => console.log('Delete', task.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Best Practices

1. **Consistency**: Use the same glassmorphism style throughout the app
2. **Performance**: Optimize animations and avoid layout shifts
3. **Accessibility**: Test with screen readers and keyboard navigation
4. **Responsiveness**: Test on various devices and screen sizes
5. **Maintainability**: Keep components small and focused
6. **Documentation**: Add JSDoc comments to components
7. **Testing**: Write unit and integration tests for UI components