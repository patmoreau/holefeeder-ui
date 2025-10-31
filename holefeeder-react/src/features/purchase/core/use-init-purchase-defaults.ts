import { Dispatch, SetStateAction, useEffect } from 'react';
import { Account } from '@/features/purchase/core/account';
import { Category } from '@/features/purchase/core/category';
import { Purchase } from '@/features/purchase/core/purchase';

export function useInitPurchaseDefaults(
  accounts: Account[] | undefined,
  categories: Category[] | undefined,
  formData: Purchase,
  setFormData: Dispatch<SetStateAction<Purchase>>
) {
  useEffect(() => {
    if (accounts && accounts.length > 0 && !formData.account) {
      setFormData((prev) => ({ ...prev, account: accounts[0] }));
    }
  }, [accounts, formData.account, setFormData]);

  useEffect(() => {
    if (categories && categories.length > 0 && !formData.category) {
      setFormData((prev) => ({ ...prev, category: categories[0] }));
    }
  }, [categories, formData.category, setFormData]);
}
