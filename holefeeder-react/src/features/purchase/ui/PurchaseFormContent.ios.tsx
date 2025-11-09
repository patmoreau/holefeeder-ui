import { Form, Host } from '@expo/ui/swift-ui';
import React from 'react';
import { Account } from '@/features/purchase/core/account';
import { Category } from '@/features/purchase/core/category';
import { Tag } from '@/features/purchase/core/tag';
import { BasicSection } from '@/features/purchase/ui/BasicSection';
import { CashflowSection } from '@/features/purchase/ui/CashflowSection';

interface PurchaseFormProps {
  accounts: Account[];
  categories: Category[];
  tags: Tag[];
}

export const PurchaseFormContent = ({ accounts, categories, tags }: PurchaseFormProps) => {
  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <BasicSection accounts={accounts} categories={categories} tags={tags} />
        <CashflowSection />
      </Form>
    </Host>
  );
};
