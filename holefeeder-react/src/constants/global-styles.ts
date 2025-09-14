import { StyleSheet } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  // Common layouts
  flex1: { flex: 1 },
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
  center: { alignItems: 'center', justifyContent: 'center' },
  spaceBetween: { justifyContent: 'space-between' },
  spaceAround: { justifyContent: 'space-around' },
  alignStart: { alignItems: 'flex-start' },
  alignEnd: { alignItems: 'flex-end' },

  // Common margins/padding
  p0: { padding: 0 },
  p8: { padding: 8 },
  p16: { padding: 16 },
  p24: { padding: 24 },
  m0: { margin: 0 },
  m8: { margin: 8 },
  m16: { margin: 16 },
  m24: { margin: 24 },

  // Text alignment
  textCenter: { textAlign: 'center' },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },

  // Common borders
  roundedSm: { borderRadius: 6 },
  roundedMd: { borderRadius: 10 },
  roundedLg: { borderRadius: 14 },
  roundedFull: { borderRadius: 9999 },

  // Shadows
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
