import { lightTheme } from '@/types/theme/light';
import { Theme } from '@/types/theme/theme';

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    primary: '#007AFF',
    secondary: '#FF5733',
    background: '#000000',
    text: '#FFFFFF',
    secondaryText: '#EBEBF5', // 60% opacity
    destructive: '#FF3B30',
    separator: '#54545899', // 33% opacity
    opaqueSeparator: '#38383A',
    link: '#0A84FF',
  },
};
