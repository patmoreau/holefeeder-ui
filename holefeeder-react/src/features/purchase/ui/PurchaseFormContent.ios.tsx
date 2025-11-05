import { Form, Host, List } from '@expo/ui/swift-ui';
import React from 'react';
import { Account } from '@/features/purchase/core/account';
import { Category } from '@/features/purchase/core/category';
import { Tag } from '@/features/purchase/core/tag';
import { AdditionalDetailsSection } from '@/features/purchase/ui/AdditionalDetailsSection';
import { BasicSection } from '@/features/purchase/ui/BasicSection';

interface PurchaseFormProps {
  accounts: Account[];
  categories: Category[];
  tags: Tag[];
}

export const PurchaseFormContent = ({ accounts, categories, tags }: PurchaseFormProps) => {
  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <BasicSection accounts={accounts} categories={categories} />
        <AdditionalDetailsSection tags={tags} />
      </Form>
    </Host>
  );
};
