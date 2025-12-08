# Documentation Index

Welcome to the WhatsApp AI Admin Panel documentation. This directory contains comprehensive guides for understanding and working with the codebase.

## Documentation Files

### 📁 [CODE_STRUCTURE.md](./CODE_STRUCTURE.md)
Complete overview of the codebase structure, directory organization, and architectural patterns. Essential reading for understanding how the project is organized.

**Topics covered:**
- Directory structure
- Component organization
- Module structure
- File naming conventions
- Import patterns
- Best practices

### 📁 [MODULE_GUIDE.md](./MODULE_GUIDE.md)
Step-by-step guide for creating and maintaining modules. Includes templates, examples, and best practices.

**Topics covered:**
- Module creation process
- Component development patterns
- Utility function guidelines
- Type definitions
- Testing strategies
- Common patterns and troubleshooting

### 📁 [THEME_SYSTEM.md](./THEME_SYSTEM.md)
Complete guide to the theme system, CSS variables, and styling conventions.

**Topics covered:**
- Theme variable reference
- Color values and usage
- Styling patterns
- Customization guide
- Accessibility considerations
- Migration from hardcoded colors

## Quick Start

### For New Developers

1. Start with [CODE_STRUCTURE.md](./CODE_STRUCTURE.md) to understand the project architecture
2. Review existing modules (Dashboard, Users) to see patterns in action
3. Use [MODULE_GUIDE.md](./MODULE_GUIDE.md) when creating new features

### For Contributors

1. Read [CODE_STRUCTURE.md](./CODE_STRUCTURE.md) to understand conventions
2. Follow patterns in [MODULE_GUIDE.md](./MODULE_GUIDE.md) when adding features
3. Maintain consistency with existing code structure

## Project Overview

### Architecture

The project follows a **modular architecture** where:

- **Components** (`src/components/`) contain shared, reusable UI components
- **Modules** (`src/modules/`) contain feature-specific code organized by domain
- Each module is self-contained with its own components, utilities, and pages

### Key Principles

1. **Modularity**: Each feature is a self-contained module
2. **Reusability**: Shared components are in `components/`
3. **Separation of Concerns**: Clear boundaries between modules
4. **Type Safety**: Full TypeScript support
5. **Responsive Design**: Mobile-first approach
6. **Theme Consistency**: CSS variables for theming

## Module Structure

Every module follows this pattern:

```
module-name/
├── page/           # Main page component
├── components/     # Module-specific components
├── utils/          # Module-specific utilities
└── index.ts        # Module exports
```

## Common Tasks

### Adding a New Module

See [MODULE_GUIDE.md](./MODULE_GUIDE.md) for detailed instructions.

Quick steps:
1. Create module directory structure
2. Create page component
3. Add components as needed
4. Create utilities for data/logic
5. Export from index.ts
6. Add to navigation

### Modifying Existing Modules

1. Locate the module in `src/modules/[module-name]/`
2. Follow existing patterns in that module
3. Maintain consistency with module structure
4. Update related components if needed

### Adding Shared Components

1. Determine if component is truly shared
2. If shared, add to `src/components/[component-name]/`
3. Create index.ts for exports
4. Document usage in component file

## Code Conventions

### Naming

- **Components**: PascalCase (`StatsCard.tsx`)
- **Utilities**: camelCase with suffix (`dashboardUtils.ts`)
- **Pages**: PascalCase matching module (`Dashboard.tsx`)
- **Types**: PascalCase (`StatsData`)

### File Organization

- One component per file
- Related utilities in same file
- Index files for clean imports
- Types in utils or separate types file

### Styling

- Use CSS variables: `var(--admin-bg)`
- Mobile-first responsive design
- Tailwind CSS for utility classes
- Consistent spacing and sizing

## Resources

### External Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

### Internal Resources

- Component library: `src/components/ui/`
- Theme variables: `src/App.css`
- Shared utilities: `src/lib/utils.ts`

## Getting Help

If you have questions about:

- **Code structure**: See [CODE_STRUCTURE.md](./CODE_STRUCTURE.md)
- **Creating modules**: See [MODULE_GUIDE.md](./MODULE_GUIDE.md)
- **Specific issues**: Check existing code for patterns
- **Best practices**: Review established modules

## Contributing

When contributing:

1. Follow the established structure
2. Maintain consistency with existing code
3. Add documentation for complex logic
4. Update relevant docs if structure changes
5. Test on mobile and desktop

## Version History

- **v1.0**: Initial modular structure
  - Dashboard module
  - Users module template
  - Sidebar component
  - Theme system
  - Mobile responsiveness

---

For detailed information, please refer to the specific documentation files listed above.

