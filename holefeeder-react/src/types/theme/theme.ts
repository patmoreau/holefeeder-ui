import { Platform, TextStyle, ViewStyle } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export type Typography = 'default' | 'title';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    secondaryText: string;

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
  };
  styles: {
    containers: {
      page: ViewStyle;
      center: ViewStyle;
      section: ViewStyle;
    };
    components: {
      picker: TextStyle;
      pickerItem: TextStyle;
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
