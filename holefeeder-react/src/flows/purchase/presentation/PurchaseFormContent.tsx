import React, { useEffect, useRef } from 'react';
import { AppForm } from '@/features/shared/ui/AppForm';
import { Account } from '@/flows/core/accounts/account';
import { Category } from '@/flows/core/categories/category';
import { Tag } from '@/flows/core/flows/tag';
import { BasicSection } from '@/flows/purchase/presentation/BasicSection';
import { CashflowSection } from '@/flows/purchase/presentation/CashflowSection';
import { AmountField, AmountFieldRef } from '@/flows/purchase/presentation/components/fields/AmountField';
import { PurchaseType } from '@/flows/purchase/presentation/core/purchase-form-data';
import { usePurchaseForm } from '@/flows/purchase/presentation/core/use-purchase-form';
import { PurchaseTransferSection } from '@/flows/purchase/presentation/PurchaseTransferSection';
import { TransferSection } from '@/flows/purchase/presentation/TransferSection';

type PurchaseFormProps = {
  accounts: Account[];
  categories: Category[];
  tags: Tag[];
};

export const PurchaseFormContent = ({ accounts, categories, tags }: PurchaseFormProps) => {
  const { formData, updateFormField } = usePurchaseForm();
  const amountFieldRef = useRef<AmountFieldRef>(null);

  useEffect(() => {
    // Auto-focus the amount field when the component mounts
    amountFieldRef.current?.focus();
  }, []);

  return (
    <AppForm>
      <PurchaseTransferSection
        selectedPurchaseType={formData.purchaseType}
        onSelectPurchaseType={(type) => updateFormField('purchaseType', type)}
      />
      <AmountField ref={amountFieldRef} amount={formData.amount} onAmountChange={(amount) => updateFormField('amount', amount)} />
      {formData.purchaseType !== PurchaseType.transfer && (
        <>
          <BasicSection accounts={accounts} categories={categories} tags={tags} />
          <CashflowSection />
        </>
      )}
      {formData.purchaseType === PurchaseType.transfer && <TransferSection accounts={accounts} />}
    </AppForm>
  );
};
