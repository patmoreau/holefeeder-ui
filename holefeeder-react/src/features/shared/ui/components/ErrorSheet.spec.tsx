import { act, fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { anAppState } from '@/__tests__/mocks/app-state-builder';
import { useAppContext } from '@/contexts/AppContext';
import { ErrorSheet } from '@/features/shared/ui/components/ErrorSheet';
import { ErrorKey } from '@/shared/core/error-key';

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

    expect(screen.queryByText('errors.noInternetConnection.title')).toBeOnTheScreen();
  });

  it('displays the error title and message', () => {
    render(<ErrorSheet showError={true} setShowError={jest.fn()} error={ErrorKey.noInternetConnection} />);

    expect(screen.queryByText('errors.noInternetConnection.title')).toBeOnTheScreen();
    expect(screen.queryByText('errors.noInternetConnection.message')).toBeOnTheScreen();
  });

  it('calls setShowError when dismiss button is pressed', () => {
    const setShowError = jest.fn();
    render(<ErrorSheet showError={true} setShowError={setShowError} error={ErrorKey.noInternetConnection} />);

    const button = screen.queryByRole('button', { name: 'errorSheet.dismiss' });

    act(() => fireEvent.press(button));
    expect(setShowError).toHaveBeenCalledWith(false);
  });

  it('shows retry button when onRetry is provided', () => {
    const onRetry = jest.fn();
    render(<ErrorSheet showError={true} setShowError={jest.fn()} error={ErrorKey.noInternetConnection} onRetry={onRetry} />);

    const button = screen.queryByRole('button', { name: 'errorSheet.retry' });

    expect(button).toBeOnTheScreen();
  });

  it('calls onRetry when retry button is pressed', () => {
    const onRetry = jest.fn();
    render(<ErrorSheet showError={true} setShowError={jest.fn()} error={ErrorKey.noInternetConnection} onRetry={onRetry} />);

    const button = screen.getByRole('button', { name: 'errorSheet.retry' });

    act(() => fireEvent.press(button));
    expect(onRetry).toHaveBeenCalled();
  });

  it('does not show retry button when onRetry is not provided', () => {
    render(<ErrorSheet showError={true} setShowError={jest.fn()} error={ErrorKey.noInternetConnection} />);

    const button = screen.queryByRole('button', { name: 'errorSheet.retry' });

    expect(button).not.toBeOnTheScreen();
  });
});
