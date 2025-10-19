import { render, screen } from '@testing-library/react-native';
import { TagList } from '@/features/purchase/ui/components/TagList';

describe('TagList', () => {
  const mockOnChange = jest.fn();

  it('shows tags', () => {
    render(<TagList tags={[]} selected={[]} onChange={mockOnChange} />);

    screen.debug();

    expect('').toBe('');
  });
});
