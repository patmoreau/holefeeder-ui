import React, { useEffect, useRef } from 'react';
import { Account } from '@/features/purchase/core/account';
import { Category } from '@/features/purchase/core/category';
import { PurchaseType } from '@/features/purchase/core/purchase-form-data';
import { Tag } from '@/features/purchase/core/tag';
import { usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { BasicSection } from '@/features/purchase/ui/BasicSection';
import { CashflowSection } from '@/features/purchase/ui/CashflowSection';
import { AmountField, AmountFieldRef } from '@/features/purchase/ui/components/fields/AmountField';
import { PurchaseTransferSection } from '@/features/purchase/ui/PurchaseTransferSection';
import { TransferSection } from '@/features/purchase/ui/TransferSection';
import { AppForm } from '@/features/shared/ui/AppForm';

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
