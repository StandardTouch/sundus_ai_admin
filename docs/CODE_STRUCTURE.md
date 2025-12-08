# Code Structure Documentation

## Overview

This WhatsApp AI Admin Panel follows a modular architecture pattern, ensuring maintainability, scalability, and clear separation of concerns. Each module is self-contained with its own components, utilities, and pages.

## Directory Structure

```
src/
├── components/          # Shared/reusable components
│   ├── sidebar/        # Sidebar navigation module
│   ├── layout/         # Layout components (overlays, containers)
│   └── ui/             # Base UI components (shadcn/ui)
│
├── modules/            # Feature modules
│   ├── dashboard/     # Dashboard module
│   └── users/         # Users management module
│
├── lib/                # Shared utilities and helpers
├── assets/             # Static assets (images, icons)
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Component Organization

### Shared Components (`src/components/`)

Shared components are reusable across multiple modules.

#### Sidebar Module (`components/sidebar/`)

- **Sidebar.tsx**: Main sidebar container component
- **SidebarItem.tsx**: Individual navigation item component
- **sidebarConfig.ts**: Sidebar configuration and menu items data
- **index.ts**: Module exports

**Usage:**
```tsx
import { Sidebar } from "@/components/sidebar";

<Sidebar isOpen={isOpen} onClose={handleClose} />
```

#### Layout Components (`components/layout/`)

- **MobileMenuOverlay.tsx**: Mobile menu backdrop overlay
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
├── utils/                  # Module-specific utilities
│   └── moduleUtils.ts
└── index.ts                # Module exports
```

### Dashboard Module (`modules/dashboard/`)

The dashboard module contains all dashboard-related functionality.

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
│   └── DashboardHeader.tsx     # Dashboard header with search
└── utils/
    └── dashboardUtils.ts        # Dashboard data & utilities
```

#### Components:

1. **Dashboard.tsx**: Main dashboard page that orchestrates all dashboard components
2. **StatsCard.tsx**: Reusable card component for displaying statistics
3. **MessageVolumeChart.tsx**: Chart component for message volume visualization
4. **ResponseTimeChart.tsx**: Chart component for response time trends
5. **RecentConversations.tsx**: List component for recent conversations
6. **DashboardHeader.tsx**: Header component with search and menu toggle

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

The users module is structured for future user management features.

#### Structure:
```
users/
├── page/
│   └── Users.tsx           # Main users page
├── components/             # User-related components (ready for expansion)
└── utils/                  # User-related utilities (ready for expansion)
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `StatsCard.tsx`, `DashboardHeader.tsx`)
- **Utilities**: camelCase with descriptive suffix (e.g., `dashboardUtils.ts`)
- **Pages**: PascalCase matching module name (e.g., `Dashboard.tsx`, `Users.tsx`)
- **Config files**: camelCase with "Config" suffix (e.g., `sidebarConfig.ts`)
- **Index files**: Always `index.ts` for clean imports

## Import Patterns

### Module Imports

```tsx
// Import from module
import { Dashboard } from "@/modules/dashboard";
import { Users } from "@/modules/users";
```

### Component Imports

```tsx
// Import shared components
import { Sidebar } from "@/components/sidebar";
import { MobileMenuOverlay } from "@/components/layout";
```

### Utility Imports

```tsx
// Import utilities
import { getStatsData } from "@/modules/dashboard/utils/dashboardUtils";
```

## Adding a New Module

To add a new module (e.g., "Analytics"):

1. **Create module directory structure:**
   ```
   modules/analytics/
   ├── page/
   │   └── Analytics.tsx
   ├── components/
   ├── utils/
   └── index.ts
   ```

2. **Create the main page component:**
   ```tsx
   // modules/analytics/page/Analytics.tsx
   export default function Analytics() {
     return (
       <main className="flex-1 p-4 sm:p-6">
         {/* Analytics content */}
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

5. **Use in App.tsx or routing:**
   ```tsx
   import { Analytics } from "@/modules/analytics";
   ```

## Component Guidelines

### Component Size

- Keep components focused and single-purpose
- If a component exceeds ~150 lines, consider breaking it into smaller components
- Extract complex logic into utility functions

### Props Interface

- Always define TypeScript interfaces for component props
- Use descriptive prop names
- Group related props into objects when appropriate

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
- **Shared utilities**: Place in `lib/utils.ts`

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
- `--admin-primary`: Primary accent color
- `--admin-secondary`: Secondary accent color

### Usage

```tsx
className="bg-[var(--admin-bg-secondary)] text-[var(--admin-text)]"
```

## Best Practices

1. **Single Responsibility**: Each component should have one clear purpose
2. **Reusability**: Extract reusable logic into utilities or shared components
3. **Type Safety**: Always use TypeScript interfaces for props and data
4. **Consistency**: Follow the established patterns and naming conventions
5. **Documentation**: Add JSDoc comments for complex functions
6. **Modularity**: Keep modules independent and self-contained
7. **Clean Imports**: Use index.ts files for clean import paths

## Path Aliases

The project uses path aliases configured in `tsconfig.json`:

- `@/components` → `src/components`
- `@/modules` → `src/modules`
- `@/lib` → `src/lib`

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

