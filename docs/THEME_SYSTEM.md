# Theme System Documentation

## Overview

The WhatsApp AI Admin Panel uses a CSS variable-based theme system that allows for easy customization and consistent styling across all components.

## Theme Variables

All theme variables are defined in `src/App.css` and follow the naming pattern `--admin-*`.

### Background Colors

```css
--admin-bg              /* Main background (slate-950) */
--admin-bg-secondary    /* Secondary background (slate-900/80) */
```

### Text Colors

```css
--admin-text            /* Primary text (slate-100) */
--admin-text-secondary   /* Secondary text (slate-300) */
--admin-text-muted       /* Muted text (slate-400) */
--admin-text-dim         /* Dim text (slate-500) */
```

### Border Colors

```css
--admin-border          /* Primary border (slate-800) */
--admin-border-light    /* Light border (slate-700) */
```

### Primary Colors (Blue)

```css
--admin-primary         /* Blue-500 */
--admin-primary-light   /* Blue-400 */
--admin-primary-dark    /* Blue-600 */
--admin-primary-darker  /* Blue-700 */
```

### Secondary Colors (Purple)

```css
--admin-secondary        /* Purple-500 */
--admin-secondary-light  /* Purple-400 */
--admin-secondary-dark   /* Purple-600 */
```

### Accent Colors

```css
--admin-accent-cyan      /* Cyan-500 */
--admin-accent-pink      /* Pink-500 */
--admin-accent-green     /* Green-600 */
--admin-accent-emerald   /* Emerald-500 */
--admin-accent-yellow    /* Yellow-400 */
--admin-accent-orange    /* Orange-400 */
```

## Usage in Components

### Inline Styles

```tsx
<div style={{ backgroundColor: 'var(--admin-bg-secondary)' }}>
  Content
</div>
```

### Tailwind CSS Classes

```tsx
<div className="bg-[var(--admin-bg-secondary)] text-[var(--admin-text)]">
  Content
</div>
```

### CSS Files

```css
.my-component {
  background-color: var(--admin-bg-secondary);
  color: var(--admin-text);
  border: 1px solid var(--admin-border);
}
```

## Color Values

### Current Theme (Dark)

| Variable | Hex Value | Description |
|----------|-----------|-------------|
| `--admin-bg` | `#020617` | Main background |
| `--admin-bg-secondary` | `rgba(15, 23, 42, 0.8)` | Secondary background |
| `--admin-text` | `#f1f5f9` | Primary text |
| `--admin-text-secondary` | `#cbd5e1` | Secondary text |
| `--admin-text-muted` | `#94a3b8` | Muted text |
| `--admin-text-dim` | `#64748b` | Dim text |
| `--admin-border` | `#1e293b` | Primary border |
| `--admin-border-light` | `#334155` | Light border |
| `--admin-primary` | `#3b82f6` | Primary blue |
| `--admin-primary-light` | `#60a5fa` | Light blue |
| `--admin-primary-dark` | `#2563eb` | Dark blue |
| `--admin-primary-darker` | `#1d4ed8` | Darker blue |
| `--admin-secondary` | `#a855f7` | Primary purple |
| `--admin-secondary-light` | `#c084fc` | Light purple |
| `--admin-secondary-dark` | `#9333ea` | Dark purple |
| `--admin-accent-cyan` | `#06b6d4` | Cyan accent |
| `--admin-accent-pink` | `#ec4899` | Pink accent |
| `--admin-accent-green` | `#16a34a` | Green accent |
| `--admin-accent-emerald` | `#10b981` | Emerald accent |
| `--admin-accent-yellow` | `#facc15` | Yellow accent |
| `--admin-accent-orange` | `#fb923c` | Orange accent |

## Common Patterns

### Card Component

```tsx
<div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4">
  {/* Card content */}
</div>
```

### Button Styles

```tsx
<button className="bg-[var(--admin-primary)] text-white hover:bg-[var(--admin-primary-dark)]">
  Click me
</button>
```

### Text Hierarchy

```tsx
<h1 className="text-[var(--admin-text)]">Primary Heading</h1>
<p className="text-[var(--admin-text-secondary)]">Secondary text</p>
<p className="text-[var(--admin-text-muted)]">Muted text</p>
<p className="text-[var(--admin-text-dim)]">Dim text</p>
```

### Gradient Text

```tsx
<h1 
  className="text-transparent bg-clip-text"
  style={{
    backgroundImage: 'linear-gradient(to right, var(--admin-primary-light), var(--admin-secondary-light))'
  }}
>
  Gradient Text
</h1>
```

## Customizing the Theme

### Changing Colors

To change the theme colors, edit `src/App.css`:

```css
:root {
  --admin-bg: #your-color;
  --admin-primary: #your-primary-color;
  /* ... other variables */
}
```

### Adding New Colors

1. Add the variable to `:root` in `src/App.css`:

```css
:root {
  --admin-custom-color: #ff0000;
}
```

2. Add to `@theme inline` if using Tailwind:

```css
@theme inline {
  --color-admin-custom: var(--admin-custom-color);
}
```

3. Use in components:

```tsx
<div className="bg-[var(--admin-custom-color)]">
  Content
</div>
```

## Theme Consistency

### Do's

✅ Always use theme variables for colors
✅ Use semantic color names (primary, secondary, muted)
✅ Maintain contrast ratios for accessibility
✅ Test color combinations for readability

### Don'ts

❌ Don't use hardcoded hex colors
❌ Don't use Tailwind color classes directly (e.g., `bg-blue-500`)
❌ Don't create new color variables without updating documentation
❌ Don't mix theme variables with hardcoded colors

## Responsive Design

Theme variables work seamlessly with responsive design:

```tsx
<div className="
  bg-[var(--admin-bg-secondary)]
  p-4 sm:p-6
  text-sm sm:text-base
">
  Responsive content
</div>
```

## Accessibility

### Contrast Ratios

Ensure sufficient contrast:
- Text on `--admin-bg`: Use `--admin-text` (high contrast)
- Text on `--admin-bg-secondary`: Use `--admin-text-secondary` or `--admin-text`
- Muted text: Use `--admin-text-muted` for less important content

### Color Blindness

- Don't rely solely on color to convey information
- Use icons, text, or patterns in addition to color
- Test with color blindness simulators

## Examples

### Stats Card

```tsx
<div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-5">
  <p className="text-sm text-[var(--admin-text-muted)]">Title</p>
  <h3 
    className="text-2xl font-bold text-transparent bg-clip-text"
    style={{
      backgroundImage: 'linear-gradient(to right, var(--admin-primary-dark), var(--admin-accent-cyan))'
    }}
  >
    Value
  </h3>
</div>
```

### Input Field

```tsx
<input
  className="
    bg-[var(--admin-bg-secondary)]
    border border-[var(--admin-border-light)]
    rounded-lg px-4 py-2
    text-[var(--admin-text)]
    placeholder:text-[var(--admin-text-dim)]
    focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary-dark)]
  "
  placeholder="Enter text..."
/>
```

## Migration Guide

If you find hardcoded colors in the codebase:

1. Identify the color being used
2. Find or create an appropriate theme variable
3. Replace hardcoded color with variable
4. Test to ensure visual consistency

### Before

```tsx
<div className="bg-slate-900 text-slate-100">
  Content
</div>
```

### After

```tsx
<div className="bg-[var(--admin-bg-secondary)] text-[var(--admin-text)]">
  Content
</div>
```

## Future Enhancements

Potential theme system improvements:

- [ ] Light mode support
- [ ] Theme switching functionality
- [ ] Custom theme builder
- [ ] Theme presets
- [ ] Runtime theme customization

## Resources

- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Tailwind CSS Variables](https://tailwindcss.com/docs/customizing-colors#using-css-variables)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

