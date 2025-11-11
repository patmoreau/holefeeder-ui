import { transactionApi } from '@/features/purchase/api/transaction-api';
import { PurchaseFormData } from '@/features/purchase/core/purchase-form-data';
import { createMutationHook } from '@/shared/hooks/queries/use-mutation';

const purchaseMutation = createMutationHook<PurchaseFormData>('transactions', (data, token) => {
  return transactionApi(token).createTransaction(data).then();
});

export const { useCommand: usePurchase } = purchaseMutation;
