import { act, renderHook, waitFor } from '@testing-library/react-native';
import { usePowerSync } from '@/contexts/PowersyncProvider';
import { useSyncStatus } from '@/shared/hooks/use-sync-status';
import { useHelpScreen } from './use-help-screen';

// Mock the dependencies
jest.mock('@/contexts/PowersyncProvider');
jest.mock('@/shared/hooks/use-sync-status');

describe('useHelpScreen', () => {
  const mockDb = {
    getAll: jest.fn(),
  };

  const mockSyncStatus = {
    connected: true,
    lastSyncedAt: new Date('2023-01-01T12:00:00Z'),
    dataFlowStatus: {
      downloading: false,
      uploading: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    (usePowerSync as jest.Mock).mockReturnValue({ db: mockDb });
    (useSyncStatus as jest.Mock).mockReturnValue(mockSyncStatus);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with default counts', async () => {
    mockDb.getAll.mockResolvedValue([]);

    const { result } = renderHook(() => useHelpScreen());

    expect(result.current.counts).toEqual({
      accounts: 0,
      cashflows: 0,
      categories: 0,
      storeItems: 0,
      transactions: 0,
    });

    // Wait for the async effect to complete effectively
    await waitFor(() => expect(mockDb.getAll).toHaveBeenCalled());
  });

  it('should return sync status from useSyncStatus', () => {
    mockDb.getAll.mockResolvedValue([]);

    const { result } = renderHook(() => useHelpScreen());

    expect(result.current.connected).toBe(true);
    expect(result.current.lastSyncedAt).toEqual(mockSyncStatus.lastSyncedAt);
    expect(result.current.dataFlowStatus).toEqual(mockSyncStatus.dataFlowStatus);
  });

  it('should fetch and update counts on mount', async () => {
    mockDb.getAll
      .mockResolvedValueOnce([{ count: 10 }]) // accounts
      .mockResolvedValueOnce([{ count: 20 }]) // cashflows
      .mockResolvedValueOnce([{ count: 30 }]) // categories
      .mockResolvedValueOnce([{ count: 40 }]) // store_items
      .mockResolvedValueOnce([{ count: 50 }]); // transactions

    const { result } = renderHook(() => useHelpScreen());

    await waitFor(() => {
      expect(result.current.counts).toEqual({
        accounts: 10,
        cashflows: 20,
        categories: 30,
        storeItems: 40,
        transactions: 50,
      });
    });

    expect(mockDb.getAll).toHaveBeenCalledTimes(5);
    expect(mockDb.getAll).toHaveBeenCalledWith('SELECT count(*) as count FROM accounts');
    expect(mockDb.getAll).toHaveBeenCalledWith('SELECT count(*) as count FROM transactions');
  });

  it('should handle fetch errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockDb.getAll.mockRejectedValue(new Error('DB Error'));

    const { result } = renderHook(() => useHelpScreen());

    await waitFor(() => {
      expect(mockDb.getAll).toHaveBeenCalled();
    });

    // Counts should remain default on error
    expect(result.current.counts).toEqual({
      accounts: 0,
      cashflows: 0,
      categories: 0,
      storeItems: 0,
      transactions: 0,
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch counts', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should refresh counts every 5 seconds', async () => {
    mockDb.getAll.mockResolvedValue([{ count: 1 }]);

    renderHook(() => useHelpScreen());

    // Initial fetch
    await waitFor(() => {
      expect(mockDb.getAll).toHaveBeenCalledTimes(5);
    });

    // Fast-forward 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Second fetch
    await waitFor(() => {
      expect(mockDb.getAll).toHaveBeenCalledTimes(10);
    });
  });
});
