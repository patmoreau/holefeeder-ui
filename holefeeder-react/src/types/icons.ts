import { MaterialIcons } from '@expo/vector-icons';
import type { SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;

export type AppIcons = keyof typeof AppIconsMapping;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
export const AppIconsMapping = {
  calendar: 'calendar-today',
  cart: 'shopping-cart',
  'chevron.backward': 'chevron-left',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  creditcard: 'credit-card',
  'exclamationmark.triangle': 'warning',
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'pencil.and.list.clipboard': 'edit-note',
  plus: 'add',
} as const satisfies Partial<IconMapping>;
