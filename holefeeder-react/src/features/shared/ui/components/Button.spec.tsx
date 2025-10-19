import { render, fireEvent } from '@testing-library/react-native';
import { aLightThemeState } from '@/__tests__';
import { Button } from '@/features/shared/ui/components/Button';
import { useTheme } from '@/shared/hooks/theme/use-theme';

jest.mock('@/shared/hooks/theme/use-theme');
const mockUseTheme = jest.mocked(useTheme);

const testId = 'button';

describe('Button', () => {
  const mockTheme = aLightThemeState();
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockUseTheme.mockReturnValue(mockTheme);
    mockOnPress.mockClear();
  });

  it('should render', () => {
    const result = render(<Button />);

    expect(result).toBeTruthy();
  });

  it('should call onPress when clicked', () => {
    const result = render(
      <Button testID={testId} onPress={mockOnPress}>
        text
      </Button>
    );
    const button = result.getByTestId(testId);
    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalled();
  });

  describe('with variant', () => {
    it('should render primary', () => {
      const result = render(<Button testID={testId} variant="primary" />);
      const button = result.getByTestId(testId);
      expect(button.props.style.backgroundColor).toBe(mockTheme.theme.colors.primary);
    });

    it('should render secondary', () => {
      const result = render(<Button testID={testId} variant="secondary" />);
      const button = result.getByTestId(testId);
      expect(button.props.style.backgroundColor).toBe(mockTheme.theme.colors.secondary);
    });

    it('should render destructive', () => {
      const result = render(<Button testID={testId} variant="destructive" />);
      const button = result.getByTestId(testId);
      expect(button.props.style.backgroundColor).toBe(mockTheme.theme.colors.destructive);
    });
  });
});
