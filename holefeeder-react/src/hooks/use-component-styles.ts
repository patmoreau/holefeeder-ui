import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts';
import { Theme } from '@/types/theme';

export const useComponentStyles = <T extends Record<string, any>>(
  createStyles: (theme: Theme) => T
) => {
  const { theme } = useTheme();

  return useMemo(() => createStyles(theme), [theme, createStyles]);
};

// Usage in components:
// const styles = useComponentStyles((theme) => StyleSheet.create({
//   container: { backgroundColor: theme.colors.systemBackground }
// }));
