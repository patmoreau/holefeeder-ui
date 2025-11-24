import { Platform } from 'react-native';
import { Theme } from '@/types/theme/theme';

const iosTypography = {
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 16,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  body: {
    fontSize: 17,
    fontWeight: 'normal',
    lineHeight: 24,
  },
  secondary: {
    fontSize: 15,
    fontWeight: 'normal',
  },
  chip: {
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 16,
  },
  link: {
    backgroundColor: 'transparent',
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
} as const;

const tintColorLight = '#0a7ea4';

export const lightTheme: Theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#FF5733',
    background: '#FFFFFF',
    secondaryBackground: '#F2F2F7',
    text: '#000000',
    primaryText: '#FFFFFF',
    secondaryText: '#3C3C43', // 60% opacity
    destructive: '#FF3B30',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,

    separator: '#3C3C4349', // 22% opacity
    opaqueSeparator: '#C6C6C8',
    link: '#007AFF',
  },
  typography: iosTypography,
  styles: {
    view: {
      center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    text: {
      link: {
        color: '#007AFF',
        textDecorationLine: 'underline',
      },
    },
    buttons: {
      primary: {
        minHeight: 44,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        minHeight: 44,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      destructive: {
        minHeight: 44,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
      },
      link: {
        minHeight: 44,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
      },
    },
    components: {
      picker: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: Platform.select({ web: 4, default: 8 }),
        minHeight: 40,
        width: '100%',
        ...(Platform.OS === 'web' && {
          appearance: 'none',
          backgroundImage:
            // eslint-disable-next-line max-len
            'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.7rem top 50%',
          backgroundSize: '0.65rem auto',
        }),
      },
      pickerItem: {},
      chip: {},
    },
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
        flexGrow: 1,
        gap: 4,
        marginHorizontal: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
        borderRadius: 24,
      },
      host: {
        // alignItems: 'center',
        // justifyContent: 'center',
        // flexGrow: 1,
        // width: '100%',
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
