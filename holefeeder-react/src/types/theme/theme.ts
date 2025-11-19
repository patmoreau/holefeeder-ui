import { Platform, TextStyle, ViewStyle } from 'react-native';

export const ThemeMode = {
  light: 'light',
  dark: 'dark',
  system: 'system',
} as const;

export type ThemeMode = (typeof ThemeMode)[keyof typeof ThemeMode];

export type Typography = 'default' | 'title';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    secondaryBackground: string;
    text: string;
    secondaryText: string;
    destructive: string;

    tint: string;
    icon: string;
    tabIconDefault: string;
    tabIconSelected: string;

    // separators
    separator: string;
    opaqueSeparator: string;

    // others
    link: string;
  };
  typography: {
    title: TextStyle;
    subtitle: TextStyle;
    body: TextStyle;
    secondary: TextStyle;
    chip: TextStyle;
  };
  styles: {
    view: {
      center: ViewStyle;
    };
    text: {
      link: TextStyle;
    };
    buttons: {
      primary: ViewStyle;
      secondary: ViewStyle;
      destructive: ViewStyle;
    };
    components: {
      picker: TextStyle;
      pickerItem: TextStyle;
      chip: ViewStyle;
    };
    containers: {
      page: ViewStyle;
      center: ViewStyle;
      section: ViewStyle;
    };
  };
}

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
