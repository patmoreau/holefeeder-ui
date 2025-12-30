# Theme System Documentation

## Overview

The theme system has been streamlined to reduce repetition and make it easier to maintain consistent styling across iOS,
Android, and Web platforms.

## Key Files

### 1. Design Tokens (`design-tokens.ts`)

Central place for all design constants:

- **spacing**: 4px-based grid system (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl)
- **borderRadius**: Consistent border radius values
- **fontSize**: Platform-specific font sizes
- **fontWeight**: Typography weights
- **shadows**: Shadow presets
- **componentSizes**: Standard component dimensions (buttons, inputs, icons)
- **opacity**: Common opacity levels
- **zIndex**: Layer management

### 2. Base Styles (`base-styles.ts`)

Reusable style factory that creates common patterns:

- **containers**: page, center, section, card
- **buttons**: primary, secondary, destructive, link
- **inputs**: base, picker
- **text**: link styles
- **layout**: row, column, center

### 3. Theme Utilities (`theme-utils.ts`)

Helper functions to create common styles:

- `createCardStyle()` - Consistent card styling
- `createSectionStyle()` - Section containers
- `createButtonStyle()` - Button variants
- `createInputStyle()` - Input/picker styling
- `platformPadding()` - Platform-specific spacing
- `platformSpacing` - Pre-configured platform spacing

## Usage Examples

### Using Design Tokens Directly

```typescript
import { spacing, borderRadius, fontSize, fontWeight } from '@/types/theme/design-tokens';

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  text: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
  },
});
```

### Using Base Styles from Theme

```typescript
import { useTheme } from '@/shared/hooks/theme/use-theme';

const MyComponent = () => {
  const { theme } = useTheme();
  
  // Use pre-built base styles
  return (
    <View style={theme.styles.containers.card}>
      <Text style={theme.typography.title}>Hello</Text>
    </View>
  );
};
```

### Using Theme Utilities

```typescript
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { createCardStyle, createButtonStyle } from '@/types/theme/theme-utils';
import { spacing } from '@/types/theme/design-tokens';

const createStyles = (theme: Theme) => ({
  card: createCardStyle(theme, { padding: 'xl', radius: '2xl' }),
  button: createButtonStyle('primary', theme, 'lg'),
  customStyle: {
    marginTop: spacing['2xl'],
  },
});

const MyComponent = () => {
  const styles = useStyles(createStyles);
  return <View style={styles.card}>...</View>;
};
```

### Platform-Specific Styling

```typescript
import { Platform } from 'react-native';
import { spacing, componentSizes } from '@/types/theme/design-tokens';

const createStyles = (theme: Theme) => ({
  input: {
    padding: Platform.select({
      ios: spacing.sm,
      android: spacing.md,
      web: spacing.xs,
    }),
    minHeight: componentSizes.button.md, // Already platform-aware!
  },
});
```

## Migration Guide

### Before (Repetitive)

```typescript
const createStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  card: {
    backgroundColor: theme.colors.secondaryBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### After (Streamlined)

```typescript
import { spacing, borderRadius } from '@/types/theme/design-tokens';
import { createCardStyle, createButtonStyle } from '@/types/theme/theme-utils';

const createStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  card: createCardStyle(theme),
  button: createButtonStyle('primary', theme),
});
```

## Best Practices

1. **Always use design tokens** for spacing, sizing, and typography values
2. **Use theme utilities** for common patterns (cards, buttons, inputs)
3. **Use base styles** from `theme.styles.*` when available
4. **Platform-specific values** are already handled in tokens (componentSizes, fontSize)
5. **Custom values** should still use design tokens as building blocks

## Benefits

- ✅ Single source of truth for all design values
- ✅ Platform-specific defaults built-in
- ✅ Reduced code duplication
- ✅ Easier to maintain consistency
- ✅ Better TypeScript autocomplete
- ✅ Simpler refactoring

