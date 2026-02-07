import { act, renderHook, waitFor } from '@testing-library/react-native';
import { aTag } from '@/__tests__/builders/tag-for-test';
import { aTransaction } from '@/__tests__/builders/transaction-for-test';
import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { PowerSyncProviderForTest } from '@/__tests__/PowerSyncProviderForTest';
import { Tag } from '@/use-cases/core/flows/tag';
import { useTags } from './use-tags';

describe('useTags', () => {
  let db: DatabaseForTest;
  const firstTransaction = aTransaction({ tags: ['groceries', 'food'] });
  const secondTransaction = aTransaction({ tags: ['groceries', 'shopping'] });
  const thirdTransaction = aTransaction({ tags: ['food'] });
  const validTags: Tag[] = [aTag({ tag: 'food', count: 2 }), aTag({ tag: 'groceries', count: 2 }), aTag({ tag: 'shopping', count: 1 })];

  const createHook = async () =>
    await waitFor(() =>
      renderHook(() => useTags(), {
        wrapper: ({ children }: { children: React.ReactNode }) => <PowerSyncProviderForTest db={db}>{children}</PowerSyncProviderForTest>,
      })
    );

  beforeEach(async () => {
    db = await setupDatabaseForTest();

    await firstTransaction.store(db);
    await secondTransaction.store(db);
    await thirdTransaction.store(db);
  });

  afterEach(async () => {
    await act(async () => {
      await db.cleanupTestDb();
    });
  });

  it('should fetch tags from PowerSync database', async () => {
    const { result } = await createHook();

    expect(result.current).toBeLoading();

    await waitFor(() => expect(result.current).not.toBeLoading());

    expect(result.current).toBeSuccessWithValue(validTags);
  });
});
