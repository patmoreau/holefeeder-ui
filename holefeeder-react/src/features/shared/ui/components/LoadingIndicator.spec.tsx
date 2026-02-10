/* eslint-disable import/first */
jest.mock('@/shared/hooks/theme/use-theme', () => ({
  useTheme: jest.fn(),
}));
jest.mock('@/shared/hooks/use-language', () => ({
  useLanguage: jest.fn(),
}));

import { render, screen } from '@testing-library/react-native';
import { aLanguageState } from '@/__tests__/mocks/language-state-builder';
import { aLightThemeState } from '@/__tests__/mocks/theme-state-builder';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { useLanguage } from '@/shared/hooks/use-language';

const mockUseTheme = jest.mocked(useTheme);
const mockUseLanguage = jest.mocked(useLanguage);

describe('<LoadingIndicator />', () => {
  const mockTheme = aLightThemeState();
  beforeEach(() => {
    mockUseTheme.mockReturnValue(mockTheme);
    mockUseLanguage.mockReturnValue(aLanguageState());
  });

  it('should render with default props', () => {
    render(<LoadingIndicator />);
    const activityIndicator = screen.queryByLabelText('common.loading');

    expect(activityIndicator.props.size).toBe('large');
    expect(activityIndicator.props.color).toBe(mockTheme.theme.colors.primary);
  });

  describe('with variant', () => {
    it('should render with primary color', () => {
      render(<LoadingIndicator variant="primary" />);
      const activityIndicator = screen.queryByLabelText('common.loading');

      expect(activityIndicator.props.color).toBe(mockTheme.theme.colors.primary);
    });

    it('should render with secondary color', () => {
      render(<LoadingIndicator variant="secondary" />);
      const activityIndicator = screen.queryByLabelText('common.loading');

      expect(activityIndicator.props.color).toBe(mockTheme.theme.colors.secondary);
    });
  });

  describe('with size', () => {
    it('should render small', () => {
      render(<LoadingIndicator size="small" />);
      const activityIndicator = screen.queryByLabelText('common.loading');

      expect(activityIndicator.props.size).toBe('small');
    });

    it('should render large', () => {
      render(<LoadingIndicator size="large" />);
      const activityIndicator = screen.queryByLabelText('common.loading');

      expect(activityIndicator.props.size).toBe('large');
    });
  });
});
