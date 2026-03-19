import { act, renderHook, waitFor } from '@testing-library/react-native';
import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { PowerSyncProviderForTest } from '@/__tests__/PowerSyncProviderForTest';
import { anAccount } from '@/domain/core/accounts/__tests__/account-for-test';
import { aCategory } from '@/domain/core/categories/__tests__/category-for-test';
import { aCashflow } from '@/domain/core/flows/__tests__/cashflow-for-test';
import { aTransaction } from '@/domain/core/flows/__tests__/transaction-for-test';
import { aStoreItem } from '@/domain/core/store-items/__tests__/store-item-for-test';
import { useSyncInfo } from '@/features/settings/core/use-sync-info';
import { useSyncStatus } from '@/shared/hooks/use-sync-status';

jest.mock('@/shared/hooks/use-sync-status');

describe('useSyncInfo', () => {
  let db: DatabaseForTest;

  const mockSyncStatus = {
    connected: true,
    lastSyncedAt: new Date('2023-01-01T12:00:00Z'),
    dataFlowStatus: {
      downloading: false,
      uploading: false,
    },
  };

  const createHook = async () =>
    await waitFor(() =>
      renderHook(() => useSyncInfo(), {
        wrapper: ({ children }: { children: React.ReactNode }) => <PowerSyncProviderForTest db={db}>{children}</PowerSyncProviderForTest>,
      })
    );

  beforeEach(async () => {
    db = await setupDatabaseForTest();
    await db.execute('CREATE TABLE ps_crud (id INTEGER PRIMARY KEY);');
    await anAccount().store(db);
    await aCategory().store(db);
    await aCashflow().store(db);
    await aStoreItem().store(db);
    await aTransaction().store(db);
    await db.execute('INSERT INTO ps_crud (id) VALUES (1);');

    (useSyncStatus as jest.Mock).mockReturnValue(mockSyncStatus);
  });

  afterEach(async () => {
    await act(async () => {
      await db.cleanupTestDb();
    });
  });

  it('should fetch sync info from PowerSync database', async () => {
    const { result } = await createHook();

    expect(result.current).toBeLoading();

    await waitFor(() => expect(result.current).not.toBeLoading());

    expect(result.current).toBeSuccessWithValue({
      connected: true,
      lastSyncedAt: new Date('2023-01-01T12:00:00Z'),
      dataFlowStatus: {
        downloading: false,
        uploading: false,
      },
      dataMetrics: {
        transactions: 1,
        cashflows: 1,
        categories: 1,
        accounts: 1,
        outstandingTransactions: 1,
        storeItems: 1,
      },
    });
  });
});
