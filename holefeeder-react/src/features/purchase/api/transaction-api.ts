import { type AxiosResponse } from 'axios';
import { DateIntervalType } from '@/features/purchase/core/date-interval-type';
import { PurchaseFormData, PurchaseType } from '@/features/purchase/core/purchase-form-data';
import { apiService } from '@/shared/services/api-service';

type PurchaseApi = {
  date: string;
  amount: number;
  description: string;
  accountId: string;
  categoryId: string;
  tags: string[];
  cashflow?: { effectiveDate: string; intervalType: DateIntervalType; frequency: number; recurrence: number };
};

type TransferApi = {
  date: string;
  amount: number;
  description: string;
  fromAccountId: string;
  toAccountId: string;
};

export const transactionApi = (token: string | null) => {
  const api = apiService(token);

  const makeTransfer = (formData: PurchaseFormData): Promise<AxiosResponse> => {
    const transferApi: TransferApi = {
      date: formData.date,
      amount: formData.amount,
      description: formData.description,
      fromAccountId: formData.sourceAccount!.id,
      toAccountId: formData.targetAccount!.id,
    };
    return api.postWithAuth<TransferApi>('/api/v2/transactions/transfer', transferApi);
  };

  const makePurchase = (formData: PurchaseFormData): Promise<AxiosResponse> => {
    const purchaseApi: PurchaseApi = {
      date: formData.date,
      amount: formData.amount,
      description: formData.description,
      accountId: formData.sourceAccount!.id,
      categoryId: formData.category!.id,
      tags: formData.tags.map((tag) => tag.id),
      cashflow: formData.hasCashflow
        ? {
            effectiveDate: formData.cashflowEffectiveDate,
            intervalType: formData.cashflowIntervalType,
            frequency: formData.cashflowFrequency,
            recurrence: 0,
          }
        : undefined,
    };
    return api.postWithAuth<PurchaseApi>('/api/v2/transactions/make-purchase', purchaseApi);
  };

  const createTransaction = (formData: PurchaseFormData): Promise<AxiosResponse> => {
    if (formData.purchaseType === PurchaseType.transfer) {
      return makeTransfer(formData);
    } else {
      return makePurchase(formData);
    }
  };

  return {
    createTransaction: createTransaction,
  };
};
