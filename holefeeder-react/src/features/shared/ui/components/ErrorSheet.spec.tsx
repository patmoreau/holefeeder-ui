import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { anAppState } from '@/__tests__';
import { useAppContext } from '@/contexts/AppContext';
import { ErrorKey } from '@/features/shared/core/error-key';
import { ErrorSheet } from '@/features/shared/ui/components/ErrorSheet';

jest.mock('@/contexts/AppContext');
const mockUseAppContext = jest.mocked(useAppContext);
mockUseAppContext.mockReturnValue(anAppState());

describe('ErrorSheet', () => {
  it('renders nothing when showError is false', () => {
    render(<ErrorSheet showError={false} setShowError={jest.fn()} error={ErrorKey.noInternetConnection} />);

    expect(screen.queryByText('errors.noInternetConnection.title')).not.toBeOnTheScreen();
  });

  it('renders the bottom sheet when showError is true', () => {
    render(<ErrorSheet showError={true} setShowError={jest.fn()} error={ErrorKey.noInternetConnection} />);

    expect(screen.queryByText('errors.noInternetConnection.title')).toBeDefined();
  });

  it('displays the error title and message', () => {
    render(<ErrorSheet showError={true} setShowError={jest.fn()} error={ErrorKey.noInternetConnection} />);

    expect(screen.getByText('errors.noInternetConnection.title')).toBeTruthy();
    expect(screen.getByText('errors.noInternetConnection.message')).toBeTruthy();
  });

  it('calls setShowError when dismiss button is pressed', () => {
    const setShowError = jest.fn();
    render(<ErrorSheet showError={true} setShowError={setShowError} error={ErrorKey.noInternetConnection} />);

    fireEvent.press(screen.getByRole('button', { name: 'errorSheet.dismiss' }));
    expect(setShowError).toHaveBeenCalledWith(false);
  });

  it('shows retry button when onRetry is provided', () => {
    const onRetry = jest.fn();
    render(<ErrorSheet showError={true} setShowError={jest.fn()} error={ErrorKey.noInternetConnection} onRetry={onRetry} />);

    expect(screen.getByRole('button', { name: 'errorSheet.retry' })).toBeTruthy();
  });

  it('calls onRetry when retry button is pressed', () => {
    const onRetry = jest.fn();
    render(<ErrorSheet showError={true} setShowError={jest.fn()} error={ErrorKey.noInternetConnection} onRetry={onRetry} />);

    fireEvent.press(screen.getByRole('button', { name: 'errorSheet.retry' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('does not show retry button when onRetry is not provided', () => {
    render(<ErrorSheet showError={true} setShowError={jest.fn()} error={ErrorKey.noInternetConnection} />);

    expect(screen.queryByText('errorSheet.retry')).toBeNull();
  });
});
