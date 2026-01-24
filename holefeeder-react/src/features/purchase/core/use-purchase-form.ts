import { AbstractPowerSyncDatabase } from '@powersync/react-native';
import { PurchaseFormData, PurchaseType } from '@/features/purchase/core/purchase-form-data';
import { createFormDataContext, ValidationFunction } from '@/features/shared/core/use-form-context';
import { Money } from '@/shared/core/money';
import { Result } from '@/shared/core/result';
import { CreateFlowForm } from '@/use-cases/forms/flows/create-flow/create-flow-form';

export const PurchaseFormError = {
  sameAccount: 'sameAccount',
  amountRequired: 'amountRequired',
  accountRequired: 'accountRequired',
  categoryRequired: 'categoryRequired',
} as const;

export type PurchaseFormError = (typeof PurchaseFormError)[keyof typeof PurchaseFormError];

export const validatePurchaseForm: ValidationFunction<PurchaseFormData, PurchaseFormError> = (formData) => {
  const errors: Partial<Record<keyof PurchaseFormData, PurchaseFormError>> = {};

  const transfer = formData.purchaseType === 'transfer';

  if (transfer && formData.sourceAccount && formData.targetAccount) {
    if (formData.sourceAccount.id === formData.targetAccount.id) {
      errors.targetAccount = PurchaseFormError.sameAccount;
    }
  }

  if (Money.create(formData.amount).isFailure) {
    errors.amount = PurchaseFormError.amountRequired;
  }

  if (!formData.sourceAccount) {
    errors.sourceAccount = PurchaseFormError.accountRequired;
  }

  if (!transfer && !formData.category) {
    errors.category = PurchaseFormError.categoryRequired;
  }

  return errors;
};

const savePurchase = async (db: AbstractPowerSyncDatabase, formData: PurchaseFormData): Promise<Result<unknown>> => {
  const purchase = async (formData: PurchaseFormData): Promise<Result<unknown>> => {
    const useCase = CreateFlowForm(db);
    return useCase.createFlow({
      date: formData.date,
      amount: formData.amount,
      description: formData.description,
      accountId: formData.sourceAccount.id,
      categoryId: formData.category.id,
      tags: formData.tags.map((tag) => tag.tag),
    });
  };

  const transfer = async (formData: PurchaseFormData): Promise<Result<unknown>> => {
    return Promise.resolve(Result.failure(['not-implemented']));
  };

  if (formData.purchaseType === PurchaseType.transfer) return transfer(formData);
  return purchase(formData);
};

export const { FormDataProvider: PurchaseFormProvider, useFormDataContext: usePurchaseForm } = createFormDataContext<
  PurchaseFormData,
  PurchaseFormError
>('Purchase', savePurchase);
