import { useTheme } from '@/hooks';
import { darkTheme, lightTheme } from '@/types';

export const useThemeColor = (
  props: { light?: string; dark?: string },
  colorName: keyof typeof lightTheme.colors & keyof typeof darkTheme.colors
): string => {
  const { theme, isDark } = useTheme();
  const colorFromProps = isDark ? props['dark'] : props['light'];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return theme.colors[colorName];
  }
};
