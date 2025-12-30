# Theme Refactoring Examples

This document shows real examples of components before and after the theme system refactoring.

## Example 1: DashboardScreen

### Before (Repetitive, hardcoded values)

```typescript
const createStyles = (theme: Theme) => ({
  container: {
    ...theme.styles.containers.center,
  },
  largeTitle: {
    fontSize: 34,                    // ❌ Hardcoded
    fontWeight: 'bold' as const,     // ❌ Magic string
    color: theme.colors.primaryText,
    marginBottom: 4,                 // ❌ Hardcoded
  },
  subtitle: {
    fontSize: 16,                    // ❌ Hardcoded
    color: theme.colors.secondaryText,
    opacity: 0.8,
  },
  contentCard: {
    backgroundColor: theme.colors.secondaryBackground,
    marginHorizontal: 16,            // ❌ Hardcoded
    marginVertical: 8,               // ❌ Hardcoded
    padding: 16,                     // ❌ Hardcoded
    borderRadius: 12,                // ❌ Hardcoded
    shadowColor: '#000',             // ❌ Hardcoded
    shadowOffset: { width: 0, height: 1 },  // ❌ Hardcoded
    shadowOpacity: 0.1,              // ❌ Hardcoded
    shadowRadius: 3,                 // ❌ Hardcoded
    elevation: 2,                    // ❌ Hardcoded
  },
});
```

### After (Clean, using design tokens)

```typescript
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/types/theme/design-tokens';

const createStyles = (theme: Theme) => ({
  container: {
    ...theme.styles.containers.center,
  },
  largeTitle: {
    ...theme.typography.largeTitle,  // ✅ Uses theme typography
    color: theme.colors.primaryText,
    marginBottom: spacing.xs,        // ✅ Design token
  },
  subtitle: {
    fontSize: fontSize!.md,          // ✅ Design token
    color: theme.colors.secondaryText,
    opacity: 0.8,
  },
  contentCard: {
    backgroundColor: theme.colors.secondaryBackground,
    marginHorizontal: spacing.lg,    // ✅ Design token
    marginVertical: spacing.sm,      // ✅ Design token
    padding: spacing.lg,             // ✅ Design token
    borderRadius: borderRadius.xl,   // ✅ Design token
    ...shadows.base,                 // ✅ Shadow preset
  },
});
```

**Benefits:**

- 🎯 Consistent spacing across components
- 📱 Platform-specific values built-in
- 🔧 Easy to adjust globally
- 📖 Self-documenting code
- ⚡ Better autocomplete

---

## Example 2: AccountCard

### Before

```typescript
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.secondaryBackground,
      borderRadius: 16,                // ❌ Hardcoded
      padding: 16,                     // ❌ Hardcoded
      marginRight: 16,                 // ❌ Hardcoded
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },  // ❌ Hardcoded
      shadowOpacity: 0.1,              // ❌ Hardcoded
      shadowRadius: 8,                 // ❌ Hardcoded
      elevation: 4,                    // ❌ Hardcoded
    },
    balanceAmount: {
      ...theme.typography.largeTitle,
      color: theme.colors.text,
      fontWeight: '700',               // ❌ Magic string
    },
  });
```

### After

```typescript
import { borderRadius, fontWeight, shadows, spacing } from '@/types/theme/design-tokens';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.secondaryBackground,
      borderRadius: borderRadius.xl,   // ✅ Design token
      padding: spacing.lg,             // ✅ Design token
      marginRight: spacing.lg,         // ✅ Design token
      shadowColor: theme.colors.text,
      ...shadows.base,                 // ✅ Shadow preset
    },
    balanceAmount: {
      ...theme.typography.largeTitle,
      color: theme.colors.text,
      fontWeight: fontWeight.bold,     // ✅ Design token
    },
  });
```

---

## Example 3: Using Theme Utilities

### Before (Custom card implementation)

```typescript
const createStyles = (theme: Theme) => ({
  card: {
    backgroundColor: theme.colors.secondaryBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

### After (Using utility function)

```typescript
import { createCardStyle } from '@/types/theme/theme-utils';

const createStyles = (theme: Theme) => ({
  card: createCardStyle(theme),  // ✅ One-liner!
  // Or with custom options:
  largeCard: createCardStyle(theme, { padding: 'xl', radius: '2xl' }),
});
```

---

## Example 4: Platform-Specific Spacing

### Before

```typescript
import { Platform } from 'react-native';

const createStyles = (theme: Theme) => ({
  container: {
    padding: Platform.select({
      ios: 16,        // ❌ Hardcoded values
      android: 16,
      web: 20,
    }),
  },
});
```

### After

```typescript
import { platformSpacing } from '@/types/theme';

const createStyles = (theme: Theme) => ({
  container: {
    padding: platformSpacing.page,  // ✅ Pre-configured platform spacing
  },
});
```

Or use the token directly:

```typescript
import { Platform } from 'react-native';
import { spacing } from '@/types/theme';

const createStyles = (theme: Theme) => ({
  container: {
    padding: Platform.select({
      ios: spacing.lg,     // ✅ Design tokens
      android: spacing.lg,
      web: spacing.xl,
    }),
  },
});
```

---

## Migration Checklist

When refactoring a component:

- [ ] Replace hardcoded numbers with `spacing.*` tokens
- [ ] Replace hardcoded border radius with `borderRadius.*` tokens
- [ ] Replace font sizes with `fontSize.*` tokens
- [ ] Replace font weights with `fontWeight.*` tokens
- [ ] Replace shadow definitions with `shadows.*` presets
- [ ] Use `theme.typography.*` for common text styles
- [ ] Consider using theme utilities (`createCardStyle`, etc.) for common patterns
- [ ] Check if component sizes should use `componentSizes.*`
- [ ] Import design tokens from `@/types/theme` or `@/types/theme/design-tokens`

---

## Common Patterns

### Spacing

```typescript
// Before
marginTop: 4,
padding: 8,
gap: 16,

// After
import { spacing } from '@/types/theme';
marginTop: spacing.xs,    // 4
padding: spacing.sm,      // 8
gap: spacing.lg,          // 16
```

### Border Radius

```typescript
// Before
borderRadius: 8,
borderRadius: 12,
borderRadius: 20,

// After
import { borderRadius } from '@/types/theme';
borderRadius: borderRadius.md,   // 8
borderRadius: borderRadius.xl,   // 12
borderRadius: borderRadius['3xl'], // 20
```

### Shadows

```typescript
// Before
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 3,

// After
import { shadows } from '@/types/theme';
...shadows.base,
```

### Typography

```typescript
// Before
fontSize: 17,
fontWeight: '600',

// After
import { fontSize, fontWeight } from '@/types/theme';
fontSize: fontSize.lg,
fontWeight: fontWeight.semiBold,

// Or use theme typography
...theme.typography.title,
```

