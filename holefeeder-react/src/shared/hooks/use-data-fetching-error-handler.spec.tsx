import { act, render } from '@testing-library/react-native';
import React, { useEffect } from 'react';
import { anAppState } from '@/__tests__/mocks/app-state-builder';
import { useAppContext } from '@/contexts/AppContext';
import { ErrorKey } from '@/shared/core/error-key';
import { useDataFetchingErrorHandler } from './use-data-fetching-error-handler';

jest.mock('@/contexts/AppContext');
const mockUseAppContext = jest.mocked(useAppContext);
mockUseAppContext.mockReturnValue(anAppState());

// Minimal shape to mimic UseQueryResult needed by the hook
type CreateQueryParams = {
  isLoading?: boolean;
  isError?: boolean;
  data?: unknown;
  error?: unknown;
  refetch?: () => Promise<unknown>;
};

function createQuery({
  isLoading = false,
  isError = false,
  data = undefined,
  error = undefined,
  refetch = jest.fn().mockResolvedValue(undefined),
}: CreateQueryParams = {}) {
  return { isLoading, isError, data, error, refetch } as any;
}

function Harness({ queries, onResult }: { queries: any[]; onResult: (res: ReturnType<typeof useDataFetchingErrorHandler>) => void }) {
  const result = useDataFetchingErrorHandler(...(queries as any));
  useEffect(() => {
    onResult(result as any);
  }, [result, onResult]);
  return null;
}

describe('useDataFetchingErrorHandler', () => {
  it('returns isLoading=true and data=null when any query is loading', () => {
    const q1 = createQuery({ isLoading: true });
    const q2 = createQuery({ isLoading: false, data: 2 });

    const received: any[] = [];
    render(<Harness queries={[q1, q2]} onResult={(r) => received.push(r)} />);

    const last = received.at(-1);
    expect(last.isLoading).toBe(true);
    expect(last.data).toBeNull();
  });

  it('aggregates data when not loading and no error', () => {
    const q1 = createQuery({ data: 1 });
    const q2 = createQuery({ data: 2 });

    const received: any[] = [];
    render(<Harness queries={[q1, q2]} onResult={(r) => received.push(r)} />);

    const last = received.at(-1);
    expect(last.isLoading).toBe(false);
    expect(last.data).toEqual([1, 2]);
    expect(last.errorSheetProps.showError).toBe(false);
  });

  it('sets showError true when any query errors and provides non-network title/message', async () => {
    const error = new Error('Server exploded');
    const q1 = createQuery({ isError: true, error });
    const q2 = createQuery({});

    const received: any[] = [];
    render(<Harness queries={[q1, q2]} onResult={(r) => received.push(r)} />);

    await act(async () => {}); // flush effect

    const last = received.at(-1);
    expect(last.data).toBeNull();
    expect(last.errorSheetProps.showError).toBe(true);
    expect(last.errorSheetProps.error).toBe(ErrorKey.cannotReachServer);
  });

  it('shows network-specific title/message when a network-like error is present', async () => {
    const err = new Error('Network Error: failed to fetch'); // matches isNetworkError fallback
    const q = createQuery({ isError: true, error: err });

    const received: any[] = [];
    render(<Harness queries={[q]} onResult={(r) => received.push(r)} />);

    await act(async () => {});

    const last = received.at(-1);
    expect(last.errorSheetProps.showError).toBe(true);
    expect(last.errorSheetProps.error).toBe(ErrorKey.noInternetConnection);
  });

  it('onRetry hides error and refetches all queries', async () => {
    const refetch1 = jest.fn().mockResolvedValue(undefined);
    const refetch2 = jest.fn().mockResolvedValue(undefined);

    const q1 = createQuery({ isError: true, error: new Error('boom'), refetch: refetch1 });
    const q2 = createQuery({ data: 42, refetch: refetch2 });

    let current: any;
    render(
      <Harness
        queries={[q1, q2]}
        onResult={(r) => {
          current = r;
        }}
      />
    );

    await act(async () => {});

    expect(current.errorSheetProps.showError).toBe(true);

    await act(async () => {
      await current.errorSheetProps.onRetry();
    });

    expect(refetch1).toHaveBeenCalledTimes(1);
    expect(refetch2).toHaveBeenCalledTimes(1);
    expect(current.errorSheetProps.showError).toBe(false);
  });

  it('returns unwrapped data for a single query', () => {
    const q = createQuery({ data: { id: 1, name: 'test' } });

    const received: any[] = [];
    render(<Harness queries={[q]} onResult={(r) => received.push(r)} />);

    const last = received.at(-1);
    expect(last.isLoading).toBe(false);
    expect(last.data).toEqual({ id: 1, name: 'test' });
    expect(last.errorSheetProps.showError).toBe(false);
  });

  it('returns array of data for multiple queries', () => {
    const q1 = createQuery({ data: 'first' });
    const q2 = createQuery({ data: 'second' });

    const received: any[] = [];
    render(<Harness queries={[q1, q2]} onResult={(r) => received.push(r)} />);

    const last = received.at(-1);
    expect(last.isLoading).toBe(false);
    expect(last.data).toEqual(['first', 'second']);
    expect(last.errorSheetProps.showError).toBe(false);
  });
});
