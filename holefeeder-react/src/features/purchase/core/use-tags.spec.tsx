import { act, renderHook, waitFor } from '@testing-library/react-native';
import { DatabaseForTest, setupDatabaseForTest } from '@/__tests__/persistence/database-for-test';
import { PowerSyncProviderForTest } from '@/__tests__/PowerSyncProviderForTest';
import { aTag } from '@/domain/core/flows/__tests__/tag-for-test';
import { aTransaction } from '@/domain/core/flows/__tests__/transaction-for-test';
import { Tag } from '@/domain/core/flows/tag';
import { TagList } from '@/domain/core/flows/tag-list';
import { useTags } from './use-tags';

describe('useTags', () => {
  let db: DatabaseForTest;
  const firstTransaction = aTransaction({ tags: TagList.valid(['groceries', 'food']) });
  const secondTransaction = aTransaction({ tags: TagList.valid(['groceries', 'shopping']) });
  const thirdTransaction = aTransaction({ tags: TagList.valid(['food']) });
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
