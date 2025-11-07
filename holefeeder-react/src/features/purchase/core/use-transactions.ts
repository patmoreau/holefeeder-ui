import { transactionApi } from '@/features/purchase/api/transaction-api';
import { Purchase } from '@/features/purchase/core/purchase';
import { createMutationHook } from '@/shared/hooks/queries/use-mutation';

const purchaseMutation = createMutationHook<Purchase>('transactions', (data, token) => {
  return transactionApi(token).makePurchase(data).then();
});

export const { useCommand: usePurchase } = purchaseMutation;
