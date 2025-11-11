import { Form, Host } from '@expo/ui/swift-ui';
import React from 'react';
import { Account } from '@/features/purchase/core/account';
import { Category } from '@/features/purchase/core/category';
import { Tag } from '@/features/purchase/core/tag';
import { usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { BasicSection } from '@/features/purchase/ui/BasicSection';
import { CashflowSection } from '@/features/purchase/ui/CashflowSection';
import { PurchaseTransferSection } from '@/features/purchase/ui/PurchaseTransferSection';
import { TransferSection } from '@/features/purchase/ui/TransferSection';

type PurchaseFormProps = {
  accounts: Account[];
  categories: Category[];
  tags: Tag[];
};

export const PurchaseFormContent = ({ accounts, categories, tags }: PurchaseFormProps) => {
  const { formData } = usePurchaseForm();

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <PurchaseTransferSection />
        {!formData.transfer && (
          <>
            <BasicSection accounts={accounts} categories={categories} tags={tags} />
            <CashflowSection />
          </>
        )}
        {formData.transfer && <TransferSection accounts={accounts} />}
      </Form>
    </Host>
  );
};
