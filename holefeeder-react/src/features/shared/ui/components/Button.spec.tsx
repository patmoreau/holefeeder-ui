import { render, fireEvent, screen } from '@testing-library/react-native';
import { aLightThemeState } from '@/__tests__';
import { Button } from '@/features/shared/ui/components/Button';
import { useTheme } from '@/shared/hooks/theme/use-theme';

jest.mock('@/shared/hooks/theme/use-theme');
const mockUseTheme = jest.mocked(useTheme);

describe('<Button />', () => {
  const mockTheme = aLightThemeState();
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockUseTheme.mockReturnValue(mockTheme);
    mockOnPress.mockClear();
  });

  it('should render', () => {
    render(<Button accessibilityLabel="text">text</Button>);

    const button = screen.getByLabelText('text');

    expect(button).toBeOnTheScreen();
    expect(button).toHaveTextContent('text');
  });

  it('should call onPress when clicked', () => {
    render(
      <Button accessibilityLabel="text" onPress={mockOnPress}>
        text
      </Button>
    );
    const button = screen.getByLabelText('text');
    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalled();
  });

  describe('with variant', () => {
    it('should render primary', () => {
      render(
        <Button accessibilityLabel="text" variant="primary">
          text
        </Button>
      );
      const button = screen.getByLabelText('text');
      expect(button.props.style.backgroundColor).toBe(mockTheme.theme.colors.primary);
    });

    it('should render secondary', () => {
      render(
        <Button accessibilityLabel="text" variant="secondary">
          text
        </Button>
      );
      const button = screen.getByLabelText('text');
      expect(button.props.style.backgroundColor).toBe(mockTheme.theme.colors.secondary);
    });

    it('should render destructive', () => {
      render(
        <Button accessibilityLabel="text" variant="destructive">
          text
        </Button>
      );
      const button = screen.getByLabelText('text');
      expect(button.props.style.backgroundColor).toBe(mockTheme.theme.colors.destructive);
    });
  });
});
