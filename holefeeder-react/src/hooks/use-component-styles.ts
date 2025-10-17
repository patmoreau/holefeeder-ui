import { useMemo } from 'react';
import { useTheme } from '@/hooks/theme/use-theme';
import { Theme } from '@/types/theme';

export const useComponentStyles = <T extends Record<string, any>>(createStyles: (theme: Theme) => T) => {
  const { theme } = useTheme();

  return useMemo(() => createStyles(theme), [theme, createStyles]);
};

// Usage in components:
// const styles = useComponentStyles((theme) => StyleSheet.create({
//   container: { backgroundColor: theme.colors.systemBackground }
// }));
