import { PurchaseFormData } from '@/features/purchase/core/purchase-form-data';
import { createFormDataContext, ValidationFunction } from '@/features/shared/core/use-form-context';

export const PurchaseFormError = {
  sameAccount: 'sameAccount',
  amountRequired: 'amountRequired',
  accountRequired: 'accountRequired',
  categoryRequired: 'categoryRequired',
} as const;

export type PurchaseFormError = (typeof PurchaseFormError)[keyof typeof PurchaseFormError];

export const validatePurchaseForm: ValidationFunction<PurchaseFormData, PurchaseFormError> = (formData) => {
  const errors: Partial<Record<keyof PurchaseFormData, PurchaseFormError>> = {};

  if (formData.transfer && formData.sourceAccount && formData.targetAccount) {
    if (formData.sourceAccount.id === formData.targetAccount.id) {
      errors.targetAccount = PurchaseFormError.sameAccount;
    }
  }

  if (formData.amount <= 0) {
    errors.amount = PurchaseFormError.amountRequired;
  }

  if (!formData.sourceAccount) {
    errors.sourceAccount = PurchaseFormError.accountRequired;
  }

  if (!formData.transfer && !formData.category) {
    errors.category = PurchaseFormError.categoryRequired;
  }

  return errors;
};

export const { FormDataProvider: PurchaseFormProvider, useFormDataContext: usePurchaseForm } = createFormDataContext<
  PurchaseFormData,
  PurchaseFormError
>('Purchase');
