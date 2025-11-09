import { type AxiosResponse } from 'axios';
import { DateIntervalType } from '@/features/purchase/core/date-interval-type';
import { Purchase } from '@/features/purchase/core/purchase';
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
export const transactionApi = (token: string | null) => {
  const api = apiService(token);

  const makePurchase = (purchase: Purchase): Promise<AxiosResponse> => {
    const purchaseApi: PurchaseApi = {
      date: purchase.date,
      amount: purchase.amount,
      description: purchase.description,
      accountId: purchase.account!.id,
      categoryId: purchase.category!.id,
      tags: purchase.tags.map((tag) => tag.id),
      cashflow: purchase.hasCashflow
        ? {
            effectiveDate: purchase.cashflowEffectiveDate,
            intervalType: purchase.cashflowIntervalType,
            frequency: purchase.cashflowFrequency,
            recurrence: 0,
          }
        : undefined,
    };
    return api.postWithAuth<PurchaseApi>('/api/v2/transactions/make-purchase', purchaseApi);
  };

  return {
    makePurchase,
  };
};
