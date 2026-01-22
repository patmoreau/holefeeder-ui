import { act, renderHook, waitFor } from '@testing-library/react-native';
import { AuthContextForTest } from '@/__tests__/AuthContextForTest';
import { anAccount } from '@/__tests__/builders/account-for-test';
import { anId } from '@/__tests__/mocks/string-builder';
import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { PowerSyncProviderForTest } from '@/__tests__/PowerSyncProviderForTest';
import { useAccounts } from '@/features/purchase/core/use-accounts';

describe('useAccounts', () => {
  let db: DatabaseForTest;
  const firstAccount = anAccount({ name: 'Account 1', favorite: false });
  const secondAccount = anAccount({ name: 'Account 2', favorite: false });
  const thirdAccount = anAccount({ name: 'Account 3', favorite: true });

  beforeEach(async () => {
    db = await setupDatabaseForTest();

    await firstAccount.store(db);
    await secondAccount.store(db);
    await thirdAccount.store(db);
  });

  afterEach(async () => {
    await act(async () => {
      await db.cleanupTestDb();
    });
  });

  it('should fetch accounts from PowerSync database', async () => {
    const { result } = await waitFor(() =>
      renderHook(() => useAccounts(), {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <AuthContextForTest
            overrides={{
              user: { sub: anId(), email: 'test@example.com' },
              isLoading: true,
              getCredentials: jest.fn().mockResolvedValue({ accessToken: 'mock-token' }),
            }}
          >
            <PowerSyncProviderForTest db={db}>{children}</PowerSyncProviderForTest>
          </AuthContextForTest>
        ),
      })
    );

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);

    // Wait for data to load
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual([
      { id: thirdAccount.id, name: 'Account 3' },
      { id: firstAccount.id, name: 'Account 1' },
      { id: secondAccount.id, name: 'Account 2' },
    ]);
  });
});
