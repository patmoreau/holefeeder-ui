import { Theme } from '@/types/theme/theme';

const iosTypography = {
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 17,
    fontWeight: 'normal',
    lineHeight: 24,
  },
} as const;

export const lightTheme: Theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#FF5733',
    background: '#FFFFFF',
    text: '#000000',
    secondaryText: '#3C3C43', // 60% opacity
    link: '#007AFF',
  },
  typography: iosTypography,
  styles: {
    containers: {
      page: {
        flex: 1,
        padding: 16,
      },
      center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      section: {
        marginBottom: 24,
        padding: 16,
        borderRadius: 12,
      },
    },
  },
};

/*
lineWeight:
 100 = Thin
 200 = Extra Light
 300 = Light
 400 = Normal/Regular
 500 = Medium
 600 = Semi Bold
 700 = Bold
 800 = Extra Bold
 900 = Black
 */
