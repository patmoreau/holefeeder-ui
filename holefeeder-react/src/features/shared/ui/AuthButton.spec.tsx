import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { AppContextForTest } from '@/__tests__/AppContextForTest';
import { AuthContextForTest } from '@/__tests__/AuthContextForTest';
import { anId } from '@/__tests__/mocks/string-builder';
import { AuthButton } from '@/features/shared/ui/AuthButton';

describe('<AuthButton />', () => {
  beforeEach(() => {});

  describe('when user is logged', () => {
    const mockLogout = jest.fn();

    beforeEach(async () => {
      await waitFor(() =>
        render(
          <AppContextForTest>
            <AuthContextForTest
              overrides={{
                user: { sub: anId() },
                isLoading: false,
                clearSession: mockLogout,
              }}
            >
              <AuthButton />
            </AuthContextForTest>
          </AppContextForTest>
        )
      );
    });

    it('shows logout button', () => {
      expect(screen.queryByRole('button', { name: /auth.logoutButton/i })).toBeOnTheScreen();
    });

    it('invokes logout method when clicked', () => {
      act(() => fireEvent.press(screen.queryByRole('button', { name: /auth.logoutButton/i })));

      expect(mockLogout).toHaveBeenCalled();
    });
  });

  describe('when user not user is logged', () => {
    const mockLogin = jest.fn();

    beforeEach(async () => {
      await waitFor(() =>
        render(
          <AppContextForTest>
            <AuthContextForTest
              overrides={{
                authorize: mockLogin,
              }}
            >
              <AuthButton />
            </AuthContextForTest>
          </AppContextForTest>
        )
      );
    });

    it('shows login button', async () => {
      expect(screen.queryByRole('button', { name: /auth.loginButton/i })).toBeOnTheScreen();
    });

    it('invokes login method when clicked', () => {
      act(() => fireEvent.press(screen.queryByRole('button', { name: /auth.loginButton/i })));

      expect(mockLogin).toHaveBeenCalled();
    });
  });
});
