# Code Structure Documentation

## Overview

This WhatsApp AI Admin Panel follows a modular architecture pattern, ensuring maintainability, scalability, and clear separation of concerns. Each module is self-contained with its own components, utilities, pages, and state management.

## Directory Structure

```
src/
├── components/          # Shared/reusable components
│   ├── sidebar/        # Sidebar navigation module
│   ├── layout/         # Layout components (overlays, containers)
│   ├── theme/          # Theme-related components
│   └── ui/             # Base UI components (shadcn/ui)
│
├── modules/            # Feature modules
│   ├── auth/          # Authentication module
│   ├── dashboard/     # Dashboard module
│   ├── users/         # Users management module
│   ├── analytics/     # Analytics module
│   ├── conversations/ # Conversations module
│   ├── settings/       # Settings module
│   └── training/      # Training module
│
├── lib/                # Shared utilities and helpers
│   ├── api/           # API client and endpoints
│   └── utils/         # Utility functions
│
├── routes/             # Routing configuration
├── store/              # Redux store configuration
├── contexts/           # React contexts
├── assets/             # Static assets (images, icons)
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Component Organization

### Shared Components (`src/components/`)

Shared components are reusable across multiple modules.

#### Sidebar Module (`components/sidebar/`)

- **Sidebar.tsx**: Main sidebar container component with navigation
- **SidebarItem.tsx**: Individual navigation item component
- **sidebarConfig.ts**: Sidebar configuration and menu items data
- **index.ts**: Module exports

**Usage:**
```tsx
import { Sidebar } from "@/components/sidebar";

<Sidebar isOpen={isOpen} onClose={handleClose} currentPage={currentPage} />
```

#### Layout Components (`components/layout/`)

- **MobileMenuOverlay.tsx**: Mobile menu backdrop overlay
- **index.ts**: Module exports

#### Theme Components (`components/theme/`)

- **ThemeToggle.tsx**: Dark/light mode toggle component
- **index.ts**: Module exports

## Module Structure

Each module follows a consistent structure:

```
module-name/
├── page/
│   └── ModuleName.tsx      # Main page component
├── components/             # Module-specific components
│   ├── Component1.tsx
│   └── Component2.tsx
├── store/                  # Redux slice (if needed)
│   ├── moduleSlice.ts
│   └── index.ts
├── utils/                  # Module-specific utilities
│   └── moduleUtils.ts
└── index.ts                # Module exports
```

### Auth Module (`modules/auth/`)

The authentication module handles login, logout, password reset, and user session management.

#### Structure:
```
auth/
├── page/
│   └── Login.tsx                    # Main login page
├── components/
│   ├── LoginForm.tsx               # Login form component
│   ├── ForgotPasswordForm.tsx     # Forgot password form
│   ├── NewPasswordForm.tsx         # New password creation form
│   ├── EmailField.tsx              # Email input field
│   ├── PasswordField.tsx           # Password input field
│   ├── OtpInput.tsx                # OTP input component
│   └── LoginLogo.tsx               # Login page logo
├── store/
│   ├── authSlice.ts                # Redux slice for auth state
│   └── index.ts
└── index.ts
```

#### Features:
- Login with username/password
- Forgot password flow (email → OTP → new password)
- JWT token management (localStorage + cookies)
- User session management
- Protected route authentication

**Usage:**
```tsx
import { Login } from "@/modules/auth";
```

### Dashboard Module (`modules/dashboard/`)

The dashboard module contains all dashboard-related functionality including stats, charts, and AI toggle.

#### Structure:
```
dashboard/
├── page/
│   └── Dashboard.tsx           # Main dashboard page
├── components/
│   ├── StatsCard.tsx           # Statistics card component
│   ├── MessageVolumeChart.tsx  # Message volume chart
│   ├── ResponseTimeChart.tsx   # Response time chart
│   ├── RecentConversations.tsx # Recent conversations list
│   ├── DashboardHeader.tsx     # Dashboard header with search
│   └── EnableAIToggle.tsx     # AI enable/disable toggle
└── utils/
    └── dashboardUtils.ts        # Dashboard data & utilities
```

#### Components:

1. **Dashboard.tsx**: Main dashboard page that orchestrates all dashboard components
2. **StatsCard.tsx**: Reusable card component for displaying statistics
3. **MessageVolumeChart.tsx**: Chart component for message volume visualization
4. **ResponseTimeChart.tsx**: Chart component for response time trends
5. **RecentConversations.tsx**: List component for recent conversations
6. **DashboardHeader.tsx**: Header component with search, AI toggle, theme toggle, and menu toggle
7. **EnableAIToggle.tsx**: Toggle component for enabling/disabling WhatsApp AI webhook

#### Utilities:

- **dashboardUtils.ts**: Contains:
  - `getStatsData()`: Returns dashboard statistics data
  - `getRecentConversations()`: Returns recent conversations data
  - Type definitions for dashboard data structures

**Usage:**
```tsx
import { Dashboard } from "@/modules/dashboard";

<Dashboard onMenuClick={handleMenuClick} />
```

### Users Module (`modules/users/`)

The users module provides full CRUD functionality for user management.

#### Structure:
```
users/
├── page/
│   └── Users.tsx                    # Main users page
├── components/
│   ├── UsersTable.tsx              # Users table with actions
│   ├── UsersFilters.tsx            # Filter controls
│   ├── UsersPagination.tsx          # Pagination controls
│   ├── CreateUserModal.tsx          # Create user modal
│   ├── EditUserModal.tsx            # Edit user modal
│   └── DeleteUserConfirmModal.tsx   # Delete confirmation modal
├── store/
│   ├── usersSlice.ts                # Redux slice for users state
│   └── index.ts
└── index.ts
```

#### Features:
- Get all users (paginated, searchable, filterable, sortable)
- Create new user
- Update existing user
- Delete user (with confirmation)
- Responsive design (table on desktop, cards on mobile)

**Usage:**
```tsx
import { Users } from "@/modules/users";
```

## API Structure (`src/lib/api/`)

The API layer is organized by domain with a shared axios client.

### Structure:
```
lib/api/
├── axios.ts        # Axios instance with interceptors
├── auth.ts         # Authentication endpoints
├── users.ts        # User management endpoints
└── settings.ts     # Settings endpoints
```

### Axios Client (`axios.ts`)

- Base URL configuration from environment variables
- Request interceptor: Adds Authorization header from localStorage/cookies
- Response interceptor: Handles 401 errors and redirects to login

### Auth API (`auth.ts`)

- `login()`: POST /api/auth/login
- `getCurrentUser()`: GET /api/auth/me
- `logout()`: POST /api/auth/logout
- `sendOtp()`: POST /api/auth/forgot-password
- `verifyOtp()`: POST /api/auth/verify-otp
- `resetPassword()`: POST /api/auth/reset-password

### Users API (`users.ts`)

- `getUsers()`: GET /api/users (with pagination, search, filters)
- `createUser()`: POST /api/users
- `updateUser()`: PUT /api/users/:id
- `deleteUser()`: DELETE /api/users/:id

### Settings API (`settings.ts`)

- `getWebhookStatus()`: GET /api/settings/webhook/status
- `toggleWebhookStatus()`: POST /api/settings/webhook/toggle

## Utilities (`src/lib/utils/`)

### Structure:
```
lib/utils/
├── cookies.ts      # Cookie management utilities
├── toast/          # Toast notification utilities
│   ├── toast.ts    # Toast functions
│   ├── toast.css   # Toast styles
│   └── index.ts
└── utils.ts        # General utilities
```

### Cookie Utilities (`cookies.ts`)

- `setCookie()`: Set a cookie
- `getCookie()`: Get a cookie value
- `deleteCookie()`: Delete a cookie

### Toast Utilities (`toast/`)

- `showSuccess()`: Display success toast
- `showError()`: Display error toast
- `showInfo()`: Display info toast
- `showWarning()`: Display warning toast
- `showToast()`: Generic toast function

## State Management (`src/store/`)

The application uses Redux Toolkit for state management.

### Structure:
```
store/
├── index.ts        # Store configuration
└── hooks.ts        # Typed Redux hooks
```

### Redux Slices

Redux slices are organized within their respective modules:

- **Auth Slice** (`modules/auth/store/authSlice.ts`):
  - User state
  - Authentication status
  - Token management
  - Login form state
  - Async thunks: `loginUser`, `fetchCurrentUser`, `logoutUser`

- **Users Slice** (`modules/users/store/usersSlice.ts`):
  - Users list
  - Pagination state
  - Filters state
  - Loading/error states
  - Async thunks: `fetchUsers`, `createNewUser`, `updateExistingUser`, `deleteExistingUser`

### Typed Hooks (`store/hooks.ts`)

- `useAppDispatch()`: Typed dispatch hook
- `useAppSelector()`: Typed selector hook

**Usage:**
```tsx
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/modules/auth/store";

const dispatch = useAppDispatch();
const user = useAppSelector((state) => state.auth.user);
```

## Routing (`src/routes/`)

### Structure:
```
routes/
├── index.ts            # Route exports
├── routes.tsx          # Route definitions
├── MainLayout.tsx       # Main layout with sidebar
├── ProtectedRoute.tsx   # Protected route wrapper
└── PublicRoutes.tsx    # Public routes wrapper
```

### Route Configuration

- **Public Routes**: `/login`
- **Protected Routes**: `/dashboard`, `/users`, `/analytics`, `/conversations`, `/training`, `/settings`
- **ProtectedRoute**: Checks authentication and redirects to login if not authenticated
- **MainLayout**: Provides sidebar and main content area for authenticated routes

## File Naming Conventions

- **Components**: PascalCase (e.g., `StatsCard.tsx`, `DashboardHeader.tsx`)
- **Utilities**: camelCase with descriptive suffix (e.g., `dashboardUtils.ts`)
- **Pages**: PascalCase matching module name (e.g., `Dashboard.tsx`, `Users.tsx`)
- **Config files**: camelCase with "Config" suffix (e.g., `sidebarConfig.ts`)
- **Redux slices**: camelCase with "Slice" suffix (e.g., `authSlice.ts`, `usersSlice.ts`)
- **API files**: camelCase matching domain (e.g., `auth.ts`, `users.ts`)
- **Index files**: Always `index.ts` for clean imports

## Import Patterns

### Module Imports

```tsx
// Import from module
import { Dashboard } from "@/modules/dashboard";
import { Users } from "@/modules/users";
import { Login } from "@/modules/auth";
```

### Component Imports

```tsx
// Import shared components
import { Sidebar } from "@/components/sidebar";
import { MobileMenuOverlay } from "@/components/layout";
import ThemeToggle from "@/components/theme/ThemeToggle";
```

### API Imports

```tsx
// Import API functions
import { login, getCurrentUser } from "@/lib/api/auth";
import { getUsers, createUser } from "@/lib/api/users";
import { getWebhookStatus, toggleWebhookStatus } from "@/lib/api/settings";
```

### Utility Imports

```tsx
// Import utilities
import { getStatsData } from "@/modules/dashboard/utils/dashboardUtils";
import { showSuccess, showError } from "@/lib/utils/toast";
import { setCookie, getCookie } from "@/lib/utils/cookies";
```

### Redux Imports

```tsx
// Import Redux hooks and actions
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, logoutUser } from "@/modules/auth/store";
import { fetchUsers } from "@/modules/users/store";
```

## Adding a New Module

To add a new module (e.g., "Analytics"):

1. **Create module directory structure:**
   ```
   modules/analytics/
   ├── page/
   │   └── Analytics.tsx
   ├── components/
   ├── store/          # If state management needed
   ├── utils/
   └── index.ts
   ```

2. **Create the main page component:**
   ```tsx
   // modules/analytics/page/Analytics.tsx
   export default function Analytics() {
     return (
       <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
         <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
           <h2 className="text-xl sm:text-2xl font-bold mb-4">Analytics</h2>
           {/* Analytics content */}
         </div>
       </main>
     );
   }
   ```

3. **Create index.ts for exports:**
   ```tsx
   // modules/analytics/index.ts
   export { default as Analytics } from "./page/Analytics";
   ```

4. **Add to sidebar navigation:**
   ```tsx
   // components/sidebar/sidebarConfig.ts
   { icon: LineChart, label: "Analytics", path: "/analytics" }
   ```

5. **Add route in MainLayout.tsx:**
   ```tsx
   import { Analytics } from "@/modules/analytics";
   
   <Route path="/analytics" element={<Analytics />} />
   ```

6. **If state management is needed, create Redux slice:**
   ```tsx
   // modules/analytics/store/analyticsSlice.ts
   import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
   
   // Define slice...
   ```

7. **Register reducer in store:**
   ```tsx
   // store/index.ts
   import { analyticsReducer } from "@/modules/analytics/store";
   
   export const store = configureStore({
     reducer: {
       // ... existing reducers
       analytics: analyticsReducer,
     },
   });
   ```

## Component Guidelines

### Component Size

- Keep components focused and single-purpose
- If a component exceeds ~150 lines, consider breaking it into smaller components
- Extract complex logic into utility functions or custom hooks

### Props Interface

- Always define TypeScript interfaces for component props
- Use descriptive prop names
- Group related props into objects when appropriate
- Use optional props with default values when appropriate

### Example Component Structure

```tsx
// components/example/ExampleComponent.tsx
interface ExampleComponentProps {
  title: string;
  onAction: () => void;
  optional?: boolean;
}

export default function ExampleComponent({ 
  title, 
  onAction, 
  optional = false 
}: ExampleComponentProps) {
  // Component logic
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

## Utility Functions

### Location

- **Module-specific utilities**: Place in `modules/[module]/utils/`
- **Shared utilities**: Place in `lib/utils/`
- **API functions**: Place in `lib/api/`

### Naming

- Use descriptive function names
- Group related functions in the same file
- Export types/interfaces alongside functions

### Example

```tsx
// modules/dashboard/utils/dashboardUtils.ts
export interface StatsData {
  title: string;
  value: string;
  change: string;
}

export const getStatsData = (): StatsData[] => {
  // Implementation
};
```

## Styling

### Theme Variables

All colors use CSS variables defined in `src/App.css`:

- `--admin-bg`: Main background color
- `--admin-bg-secondary`: Secondary background
- `--admin-text`: Primary text color
- `--admin-text-muted`: Muted text color
- `--admin-text-dim`: Dim text color
- `--admin-primary`: Primary accent color
- `--admin-primary-dark`: Darker primary color
- `--admin-secondary`: Secondary accent color
- `--admin-border`: Border color
- `--admin-border-light`: Light border color

### Usage

```tsx
className="bg-[var(--admin-bg-secondary)] text-[var(--admin-text)]"
```

### Responsive Design

- Mobile-first approach
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Test on multiple screen sizes
- Use flexbox/grid for layouts

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Access in code:
```tsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

## Best Practices

1. **Single Responsibility**: Each component should have one clear purpose
2. **Reusability**: Extract reusable logic into utilities or shared components
3. **Type Safety**: Always use TypeScript interfaces for props and data
4. **Consistency**: Follow the established patterns and naming conventions
5. **Documentation**: Add JSDoc comments for complex functions
6. **Modularity**: Keep modules independent and self-contained
7. **Clean Imports**: Use index.ts files for clean import paths
8. **Error Handling**: Always handle errors in API calls and async operations
9. **Loading States**: Show loading indicators for async operations
10. **User Feedback**: Use toast notifications for user actions

## Path Aliases

The project uses path aliases configured in `tsconfig.json`:

- `@/components` → `src/components`
- `@/modules` → `src/modules`
- `@/lib` → `src/lib`
- `@/store` → `src/store`
- `@/routes` → `src/routes`

## Testing Structure (Future)

When adding tests, mirror the source structure:

```
src/
└── modules/
    └── dashboard/
        ├── __tests__/
        │   ├── Dashboard.test.tsx
        │   └── components/
        │       └── StatsCard.test.tsx
```

## Questions or Issues?

For questions about the code structure or to propose changes, please refer to the project maintainers or create an issue in the repository.
