import { MaterialIcons } from '@expo/vector-icons';
import type { SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;

export const AppIcons = {
  account: 'creditcard',
  accounts: 'wallet.bifold.fill',
  add: 'plus',
  back: 'chevron.backward',
  calendar: 'calendar',
  cashflow: 'chart.bar.xaxis',
  category: 'cart',
  dashboard: 'rectangle.3.group.fill',
  description: 'pencil.and.list.clipboard',
  expand: 'chevron.right',
  expiresAt: 'arrow.trianglehead.2.clockwise',
  frequency: 'clock.badge.exclamationmark',
  language: 'globe',
  purchase: 'cart',
  save: 'plus.circle.fill',
  settings: 'gearshape.fill',
  tag: 'tag',
  theme: 'pencil.and.scribble',
  token: 'key.horizontal',
  warning: 'exclamationmark.triangle',
} as const;

export type AppIcons = (typeof AppIcons)[keyof typeof AppIcons];

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
export const AppIconsMapping = {
  'arrow.trianglehead.2.clockwise': 'refresh',
  calendar: 'calendar-today',
  cart: 'shopping-cart',
  'chart.bar.xaxis': 'bar-chart',
  'chevron.backward': 'chevron-left',
  'chevron.right': 'chevron-right',
  'clock.badge.exclamationmark': 'lock-clock',
  creditcard: 'credit-card',
  'exclamationmark.triangle': 'warning',
  'gearshape.fill': 'settings',
  globe: 'language',
  'key.horizontal': 'key',
  'pencil.and.list.clipboard': 'edit-note',
  'pencil.and.scribble': 'edit',
  plus: 'add',
  'plus.circle.fill': 'save',
  'rectangle.3.group.fill': 'dashboard',
  tag: 'label',
  'wallet.bifold.fill': 'wallet',
} as const satisfies Partial<IconMapping>;
