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
    link: '#0A84FF',
  },
};
