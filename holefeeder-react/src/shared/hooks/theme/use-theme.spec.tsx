/* eslint-disable import/first */
jest.mock('@/contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

import { renderHook } from '@testing-library/react-native';
import { anAppState } from '@/__tests__';
import { useAppContext } from '@/contexts/AppContext';
import { useTheme } from '@/shared/hooks/theme/use-theme';

const mockAppContext = jest.mocked(useAppContext);

describe('useTheme', () => {
  const mockAppState = anAppState();

  beforeEach(() => {
    jest.clearAllMocks();
    mockAppContext.mockReturnValue(mockAppState);
  });

  it('should return theme', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe(mockAppState.theme);
  });

  it('should return isDark', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDark).toBe(mockAppState.isDark);
  });

  it('should return changeThemeMode', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.changeThemeMode).toBe(mockAppState.changeThemeMode);
  });

  it('should return availableThemeModes', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.availableThemeModes).toBe(mockAppState.availableThemeModes);
  });

  it('should return themeMode', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.themeMode).toBe(mockAppState.themeMode);
  });
});
