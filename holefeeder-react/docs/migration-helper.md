# Common Hardcoded Values → Design Tokens Mapping

Use this guide to quickly find and replace hardcoded values with design tokens.

## Spacing Values

| Hardcoded | Replace With     | Value |
|-----------|------------------|-------|
| `4`       | `spacing.xs`     | 4px   |
| `8`       | `spacing.sm`     | 8px   |
| `12`      | `spacing.md`     | 12px  |
| `16`      | `spacing.lg`     | 16px  |
| `20`      | `spacing.xl`     | 20px  |
| `24`      | `spacing['2xl']` | 24px  |
| `32`      | `spacing['3xl']` | 32px  |
| `40`      | `spacing['4xl']` | 40px  |
| `48`      | `spacing['5xl']` | 48px  |

## Border Radius

| Hardcoded | Replace With          | Value |
|-----------|-----------------------|-------|
| `0`       | `borderRadius.none`   | 0     |
| `2`       | `borderRadius.xs`     | 2     |
| `6`       | `borderRadius.sm`     | 6     |
| `8`       | `borderRadius.md`     | 8     |
| `10`      | `borderRadius.lg`     | 10    |
| `12`      | `borderRadius.xl`     | 12    |
| `16`      | `borderRadius['2xl']` | 16    |
| `20`      | `borderRadius['3xl']` | 20    |
| `24`      | `borderRadius['4xl']` | 24    |
| `9999`    | `borderRadius.full`   | 9999  |

## Font Sizes (iOS values shown)

| Hardcoded | Replace With      | Value (iOS) |
|-----------|-------------------|-------------|
| `11`      | `fontSize.xs`     | 11          |
| `12`      | `fontSize.sm`     | 12          |
| `14`      | `fontSize.base`   | 14          |
| `15`      | `fontSize.md`     | 15          |
| `17`      | `fontSize.lg`     | 17          |
| `20`      | `fontSize.xl`     | 20          |
| `28`      | `fontSize['2xl']` | 28          |
| `34`      | `fontSize['3xl']` | 34          |

## Font Weights

| Hardcoded             | Replace With            | Value |
|-----------------------|-------------------------|-------|
| `'100'`               | `fontWeight.thin`       | '100' |
| `'200'`               | `fontWeight.extraLight` | '200' |
| `'300'`               | `fontWeight.light`      | '300' |
| `'400'` or `'normal'` | `fontWeight.normal`     | '400' |
| `'500'`               | `fontWeight.medium`     | '500' |
| `'600'`               | `fontWeight.semiBold`   | '600' |
| `'700'` or `'bold'`   | `fontWeight.bold`       | '700' |
| `'800'`               | `fontWeight.extraBold`  | '800' |
| `'900'`               | `fontWeight.black`      | '900' |

## Shadow Patterns

### Small Shadow

**Before:**

```typescript
shadowOffset: {
  width: 0, height
:
  1
}
,
shadowOpacity: 0.05,
  shadowRadius
:
2,
  elevation
:
1,
```

**After:**

```typescript
...
shadows.sm,
```

### Base Shadow

**Before:**

```typescript
shadowOffset: {
  width: 0, height
:
  2
}
,
shadowOpacity: 0.1,
  shadowRadius
:
4,
  elevation
:
3,
```

**After:**

```typescript
...
shadows.base,
```

### Medium Shadow

**Before:**

```typescript
shadowOffset: {
  width: 0, height
:
  4
}
,
shadowOpacity: 0.15,
  shadowRadius
:
6,
  elevation
:
6,
```

**After:**

```typescript
...
shadows.md,
```

### Large Shadow

**Before:**

```typescript
shadowOffset: {
  width: 0, height
:
  8
}
,
shadowOpacity: 0.2,
  shadowRadius
:
12,
  elevation
:
12,
```

**After:**

```typescript
...
shadows.lg,
```

## Common Component Patterns

### Card

**Before:**

```typescript
backgroundColor: theme.colors.secondaryBackground,
  borderRadius
:
16,
  padding
:
16,
  shadowColor
:
theme.colors.text,
  shadowOffset
:
{
  width: 0, height
:
  2
}
,
shadowOpacity: 0.1,
  shadowRadius
:
4,
  elevation
:
3,
```

**After (Option 1):**

```typescript
...
theme.styles.containers.card,
```

**After (Option 2):**

```typescript
import { createCardStyle } from '@/types/theme';

...
createCardStyle(theme),
```

**After (Option 3):**

```typescript
import { borderRadius, spacing, shadows } from '@/types/theme';

backgroundColor: theme.colors.secondaryBackground,
  borderRadius
:
borderRadius.xl,
  padding
:
spacing.lg,
  shadowColor
:
theme.colors.text,
...
shadows.base,
```

### Button

**Before:**

```typescript
minHeight: 44,
  paddingHorizontal
:
16,
  paddingVertical
:
12,
  borderRadius
:
10,
  alignItems
:
'center',
  justifyContent
:
'center',
  backgroundColor
:
theme.colors.primary,
```

**After (Option 1):**

```typescript
...
theme.styles.buttons.primary,
```

**After (Option 2):**

```typescript
import { createButtonStyle } from '@/types/theme';

...
createButtonStyle('primary', theme),
```

### Input

**Before:**

```typescript
borderWidth: 1,
  borderColor
:
theme.colors.separator,
  borderRadius
:
8,
  paddingHorizontal
:
Platform.select({ web: 4, default: 8 }),
  minHeight
:
40,
  width
:
'100%',
```

**After (Option 1):**

```typescript
...
theme.styles.inputs.base,
```

**After (Option 2):**

```typescript
import { createInputStyle } from '@/types/theme';

...
createInputStyle(theme),
```

## Search & Replace Suggestions

You can use your IDE's find & replace (use regex) to quickly migrate:

### Spacing

1. Find: `padding: 16`  
   Replace: `padding: spacing.lg`  
   *(Add import: `import { spacing } from '@/types/theme';`)*

2. Find: `margin(?:Top|Bottom|Left|Right|Horizontal|Vertical)?: 16`  
   Replace: `margin$1: spacing.lg`

### Border Radius

1. Find: `borderRadius: 12`  
   Replace: `borderRadius: borderRadius.xl`  
   *(Add import: `import { borderRadius } from '@/types/theme';`)*

### Font Weight

1. Find: `fontWeight: '600'`  
   Replace: `fontWeight: fontWeight.semiBold`  
   *(Add import: `import { fontWeight } from '@/types/theme';`)*

2. Find: `fontWeight: 'bold'`  
   Replace: `fontWeight: fontWeight.bold`

## Import Statement

Add this to the top of files you're migrating:

```typescript
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '@/types/theme';
```

Or import individually as needed:

```typescript
import { spacing } from '@/types/theme/design-tokens';
```

## Pro Tips

1. **Don't migrate everything at once** - Do it gradually as you work on files
2. **Use theme typography** - `...theme.typography.title` is better than custom sizes
3. **Use utilities** - `createCardStyle()` is faster than manually defining cards
4. **Platform-specific?** - `fontSize` and `componentSizes` handle it automatically
5. **Shadows?** - Always use `shadows.*` presets instead of defining manually

