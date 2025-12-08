# Module Development Guide

This guide provides detailed instructions for creating and maintaining modules in the WhatsApp AI Admin Panel.

## Module Template

Every module should follow this structure:

```
module-name/
├── page/
│   └── ModuleName.tsx      # Main page component
├── components/             # Module-specific components
│   └── ComponentName.tsx
├── utils/                  # Module-specific utilities
│   └── moduleUtils.ts
├── types/                  # TypeScript types (optional)
│   └── moduleTypes.ts
└── index.ts                # Module exports
```

## Step-by-Step Module Creation

### 1. Create Directory Structure

```bash
mkdir -p src/modules/your-module/{page,components,utils}
```

### 2. Create Main Page Component

**File**: `modules/your-module/page/YourModule.tsx`

```tsx
interface YourModuleProps {
  // Define props if needed
  onAction?: () => void;
}

export default function YourModule({ onAction }: YourModuleProps) {
  return (
    <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto">
      <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Your Module Title</h2>
        {/* Module content */}
      </div>
    </main>
  );
}
```

### 3. Create Module Components

**File**: `modules/your-module/components/YourComponent.tsx`

```tsx
interface YourComponentProps {
  title: string;
  data: YourDataType[];
}

export default function YourComponent({ title, data }: YourComponentProps) {
  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      {/* Component content */}
    </div>
  );
}
```

### 4. Create Utilities

**File**: `modules/your-module/utils/yourModuleUtils.ts`

```tsx
export interface YourDataType {
  id: string;
  name: string;
}

export const getYourData = (): YourDataType[] => {
  // Fetch or generate data
  return [];
};

export const processYourData = (data: YourDataType[]) => {
  // Process data
  return data;
};
```

### 5. Create Index File

**File**: `modules/your-module/index.ts`

```tsx
export { default as YourModule } from "./page/YourModule";
export * from "./utils/yourModuleUtils";
```

### 6. Add to Navigation

**File**: `components/sidebar/sidebarConfig.ts`

```tsx
import { YourIcon } from "lucide-react";

export const sidebarItems: SidebarItemConfig[] = [
  // ... existing items
  { icon: YourIcon, label: "Your Module", path: "/your-module" },
];
```

## Module Examples

### Dashboard Module

The dashboard module demonstrates:
- Multiple components (StatsCard, Charts, Lists)
- Data utilities
- Responsive design
- Theme integration

**Key Files:**
- `page/Dashboard.tsx`: Orchestrates all dashboard components
- `components/StatsCard.tsx`: Reusable stat card
- `utils/dashboardUtils.ts`: Data and helper functions

### Users Module

The users module is a template for future development:
- Basic page structure
- Ready for components and utilities
- Follows module pattern

## Component Development

### Component Checklist

- [ ] Component is in its own file
- [ ] Props interface is defined
- [ ] Component is responsive (mobile-first)
- [ ] Uses theme variables for colors
- [ ] Has proper TypeScript types
- [ ] Follows naming conventions
- [ ] Is exported from module index

### Component Patterns

#### Simple Display Component

```tsx
interface DisplayProps {
  title: string;
  value: string;
}

export default function Display({ title, value }: DisplayProps) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
```

#### Interactive Component

```tsx
interface InteractiveProps {
  data: DataType[];
  onSelect: (item: DataType) => void;
}

export default function Interactive({ data, onSelect }: InteractiveProps) {
  return (
    <div>
      {data.map((item) => (
        <button key={item.id} onClick={() => onSelect(item)}>
          {item.name}
        </button>
      ))}
    </div>
  );
}
```

#### Form Component

```tsx
interface FormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
}

export default function Form({ onSubmit, initialData }: FormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process form data
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Utility Functions

### Data Fetching

```tsx
// utils/yourModuleUtils.ts
export const fetchYourData = async (): Promise<DataType[]> => {
  // API call or data fetching logic
  const response = await fetch('/api/your-endpoint');
  return response.json();
};
```

### Data Transformation

```tsx
export const transformData = (rawData: RawDataType[]): ProcessedDataType[] => {
  return rawData.map(item => ({
    id: item.id,
    name: item.name.toUpperCase(),
    // ... transformations
  }));
};
```

### Calculations

```tsx
export const calculateMetrics = (data: DataType[]): Metrics => {
  return {
    total: data.length,
    average: data.reduce((sum, item) => sum + item.value, 0) / data.length,
    // ... calculations
  };
};
```

## Type Definitions

### Module Types

**File**: `modules/your-module/types/moduleTypes.ts` (optional)

```tsx
export interface YourModuleData {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface YourModuleState {
  data: YourModuleData[];
  loading: boolean;
  error: string | null;
}
```

## Integration with App

### Using in App.tsx

```tsx
import { YourModule } from "@/modules/your-module";

// In component
<YourModule onAction={handleAction} />
```

### Routing (Future)

When routing is added:

```tsx
import { YourModule } from "@/modules/your-module";

<Route path="/your-module" element={<YourModule />} />
```

## Testing Your Module

### Component Testing

```tsx
// __tests__/YourComponent.test.tsx
import { render, screen } from '@testing-library/react';
import YourComponent from '../components/YourComponent';

test('renders component', () => {
  render(<YourComponent title="Test" data={[]} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

### Utility Testing

```tsx
// __tests__/yourModuleUtils.test.ts
import { getYourData } from '../utils/yourModuleUtils';

test('returns data', () => {
  const data = getYourData();
  expect(data).toBeDefined();
});
```

## Common Patterns

### Loading States

```tsx
const [loading, setLoading] = useState(true);
const [data, setData] = useState<DataType[]>([]);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    const result = await fetchYourData();
    setData(result);
    setLoading(false);
  };
  fetchData();
}, []);

if (loading) return <div>Loading...</div>;
```

### Error Handling

```tsx
const [error, setError] = useState<string | null>(null);

try {
  const data = await fetchYourData();
  setData(data);
} catch (err) {
  setError(err instanceof Error ? err.message : 'An error occurred');
}
```

### Responsive Design

```tsx
// Use Tailwind responsive classes
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Content */}
</div>
```

## Best Practices

1. **Keep modules independent**: Don't create circular dependencies
2. **Use TypeScript**: Always define types for props and data
3. **Follow naming conventions**: PascalCase for components, camelCase for utilities
4. **Mobile-first**: Design for mobile, enhance for desktop
5. **Theme consistency**: Use CSS variables for colors
6. **Documentation**: Add comments for complex logic
7. **Error boundaries**: Consider error handling for production

## Troubleshooting

### Import Errors

If you get import errors:
- Check that `index.ts` exports are correct
- Verify path aliases in `tsconfig.json`
- Ensure file extensions are correct

### Type Errors

If TypeScript complains:
- Verify all interfaces are defined
- Check that props match component usage
- Ensure utility return types are correct

### Styling Issues

If styles don't apply:
- Verify CSS variable names match theme
- Check Tailwind classes are correct
- Ensure responsive classes are in right order

## Next Steps

After creating your module:

1. Add it to navigation
2. Test on mobile and desktop
3. Add error handling
4. Write unit tests
5. Update documentation
6. Consider accessibility

