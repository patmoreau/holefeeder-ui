# Theme System Quick Reference

## Import Shortcuts

### All-in-one import (recommended)

```typescript
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '@/types/theme';
```

### Individual imports

```typescript
import { spacing } from '@/types/theme/design-tokens';
import { createCardStyle } from '@/types/theme/theme-utils';
```

## Design Tokens

### Spacing (4px grid)

```typescript
spacing.xs    // 4px
spacing.sm    // 8px
spacing.md    // 12px
spacing.lg    // 16px
spacing.xl    // 20px
spacing['2xl'] // 24px
spacing['3xl'] // 32px
spacing['4xl'] // 40px
spacing['5xl'] // 48px
```

### Border Radius

```typescript
borderRadius.none   // 0
borderRadius.xs     // 2
borderRadius.sm     // 6
borderRadius.md     // 8
borderRadius.lg     // 10
borderRadius.xl     // 12
borderRadius['2xl'] // 16
borderRadius['3xl'] // 20
borderRadius['4xl'] // 24
borderRadius.full   // 9999
```

### Font Sizes (Platform-aware)

```typescript
fontSize.xs      // 11
fontSize.sm      // 12
fontSize.base    // 14
fontSize.md      // 15 (iOS) / 16 (Android/Web)
fontSize.lg      // 17 (iOS) / 18 (Android/Web)
fontSize.xl      // 20 (iOS) / 22 (Android/Web)
fontSize['2xl']  // 28 (iOS) / 30 (Android/Web)
fontSize['3xl']  // 34 (iOS) / 36 (Android/Web)
```

### Font Weights

```typescript
fontWeight.thin       // '100'
fontWeight.extraLight // '200'
fontWeight.light      // '300'
fontWeight.normal     // '400'
fontWeight.medium     // '500'
fontWeight.semiBold   // '600'
fontWeight.bold       // '700'
fontWeight.extraBold  // '800'
fontWeight.black      // '900'
```

### Shadows

```typescript
shadows.none  // No shadow
shadows.sm    // Subtle shadow
shadows.base  // Default shadow
shadows.md    // Medium shadow
shadows.lg    // Large shadow
shadows.xl    // Extra large shadow
```

### Component Sizes

```typescript
// Buttons
componentSizes.button.sm  // 32
componentSizes.button.md  // 44 (iOS) / 48 (Android)
componentSizes.button.lg  // 52

// Inputs
componentSizes.input.sm   // 36
componentSizes.input.md   // 40
componentSizes.input.lg   // 48

// Icons
componentSizes.icon.xs    // 16
componentSizes.icon.sm    // 20
componentSizes.icon.md    // 24
componentSizes.icon.lg    // 32
componentSizes.icon.xl    // 40
```

## Theme Utilities

### Create Card Style

```typescript
// Default card
createCardStyle(theme)

// Custom card
createCardStyle(theme, { padding: 'xl', radius: '2xl' })
```

### Create Button Style

```typescript
createButtonStyle('primary', theme)      // Primary button
createButtonStyle('secondary', theme)    // Secondary button
createButtonStyle('destructive', theme)  // Destructive button
createButtonStyle('link', theme)         // Link button
createButtonStyle('primary', theme, 'lg') // Large primary button
```

### Create Input Style

```typescript
createInputStyle(theme)
createInputStyle(theme, { height: 'lg' })
```

### Platform Spacing

```typescript
platformSpacing.page      // Page-level padding
platformSpacing.section   // Section spacing
platformSpacing.card      // Card spacing
```

## Common Usage Patterns

### Basic Component Styles

```typescript
import { spacing, borderRadius, shadows } from '@/types/theme';

const createStyles = (theme: Theme) => ({
  container: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: theme.colors.background,
  },
  card: {
    ...theme.styles.containers.card,  // Use base style
    marginBottom: spacing.md,
  },
});
```

### Using Theme Typography

```typescript
const createStyles = (theme: Theme) => ({
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
  },
});
```

### Platform-Specific Values

```typescript
import { Platform } from 'react-native';
import { spacing } from '@/types/theme';

const createStyles = (theme: Theme) => ({
  container: {
    padding: Platform.select({
      ios: spacing.lg,
      android: spacing.lg,
      web: spacing.xl,
    }),
  },
});
```

## Migration Checklist

- [ ] Replace hardcoded pixel values with `spacing.*`
- [ ] Replace hardcoded border radius with `borderRadius.*`
- [ ] Replace font sizes with `fontSize.*`
- [ ] Replace font weights with `fontWeight.*`
- [ ] Replace shadow definitions with `shadows.*`
- [ ] Use `theme.typography.*` for text styles
- [ ] Consider using utilities for common patterns
- [ ] Import from `@/types/theme` for convenience

## Color Usage

Always use theme colors for consistency:

```typescript
const createStyles = (theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background,      // ✅
    // backgroundColor: '#FFFFFF',                 // ❌ Don't hardcode
  },
  text: {
    color: theme.colors.text,                      // ✅
    // color: '#333',                              // ❌ Don't hardcode
  },
});
```

## Web-Specific Considerations

For web, some tokens automatically provide better defaults:

- Larger font sizes for better readability
- Adjusted spacing for desktop layouts
- Platform-specific component sizes

Use `platformSpacing` for automatic platform adjustments.

