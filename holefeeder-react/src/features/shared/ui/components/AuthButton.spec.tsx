/* eslint-disable import/first */
jest.mock('@/shared/hooks/theme/use-theme', () => ({
  useTheme: jest.fn(),
}));
jest.mock('@/shared/hooks/use-auth', () => ({
  useAuth: jest.fn(),
}));
jest.mock('@/shared/hooks/use-language', () => ({
  useLanguage: jest.fn(),
}));

import { fireEvent, render, screen } from '@testing-library/react-native';
import { aLightThemeState, anId } from '@/__tests__';
import { aAuthState } from '@/__tests__/mocks/auth-state-builder';
import { aLanguageState } from '@/__tests__/mocks/language-state-builder';
import { AuthButton } from '@/features/shared/ui/components/AuthButton';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { useAuth } from '@/shared/hooks/use-auth';
import { useLanguage } from '@/shared/hooks/use-language';

const mockUseTheme = jest.mocked(useTheme);
const mockUseAuth = jest.mocked(useAuth);
const mockUseLanguage = jest.mocked(useLanguage);

describe('<AuthButton />', () => {
  const mockTheme = aLightThemeState();

  beforeEach(() => {
    mockUseTheme.mockReturnValue(mockTheme);
    mockUseLanguage.mockReturnValue(aLanguageState());
  });

  describe('when user is logged', () => {
    const mockLogout = jest.fn();

    beforeEach(() => {
      mockUseAuth.mockReturnValue(aAuthState({ isLoading: false, user: { sub: anId() }, logout: mockLogout }));
    });

    it('shows logout button', () => {
      render(<AuthButton />);

      expect(screen.queryByRole('button', { name: /auth.logoutButton/i })).toBeOnTheScreen();
    });

    it('invokes logout method when clicked', () => {
      render(<AuthButton />);

      fireEvent.press(screen.queryByRole('button', { name: /auth.logoutButton/i }));

      expect(mockLogout).toHaveBeenCalled();
    });
  });

  describe('when user not user is logged', () => {
    const mockLogin = jest.fn();

    beforeEach(() => {
      mockUseAuth.mockReturnValue(aAuthState({ isLoading: false, user: null, login: mockLogin }));
    });

    it('shows login button', async () => {
      render(<AuthButton />);

      expect(screen.queryByRole('button', { name: /auth.loginButton/i })).toBeOnTheScreen();
    });

    it('invokes login method when clicked', () => {
      render(<AuthButton />);

      fireEvent.press(screen.queryByRole('button', { name: /auth.loginButton/i }));

      expect(mockLogin).toHaveBeenCalled();
    });
  });
});
