import { render } from '@testing-library/react-native';
import { aLightThemeState } from '@/__tests__';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { useTheme } from '@/hooks/theme/use-theme';

jest.mock('@/hooks/theme/use-theme');
const mockUseTheme = jest.mocked(useTheme);

const testId = 'loading-indicator';

describe('LoadingIndicator', () => {
  const mockTheme = aLightThemeState();
  beforeEach(() => {
    mockUseTheme.mockReturnValue(mockTheme);
  });

  it('should render', () => {
    const result = render(<LoadingIndicator />);

    expect(result).toBeTruthy();
  });

  describe('with variant', () => {
    it('should render with primary color', () => {
      const result = render(<LoadingIndicator testID={testId} variant="primary" />);
      const indicator = result.getByTestId(testId);
      expect(indicator.props.color).toBe(mockTheme.theme.colors.primary);
    });

    it('should render with secondary color', () => {
      const result = render(<LoadingIndicator testID={testId} variant="secondary" />);
      const indicator = result.getByTestId(testId);
      expect(indicator.props.color).toBe(mockTheme.theme.colors.secondary);
    });
  });

  describe('with size', () => {
    it('should render small', () => {
      const result = render(<LoadingIndicator testID={testId} size="small" />);
      const indicator = result.getByTestId(testId);
      expect(indicator.props.size).toBe('small');
    });

    it('should render large', () => {
      const result = render(<LoadingIndicator testID={testId} size="large" />);
      const indicator = result.getByTestId(testId);
      expect(indicator.props.size).toBe('large');
    });
  });
});
