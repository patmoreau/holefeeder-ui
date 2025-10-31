import { View } from 'react-native';
import { Account } from '@/features/purchase/core/account';
import { Category } from '@/features/purchase/core/category';
import { Tag } from '@/features/purchase/core/tag';

interface PurchaseFormProps {
  accounts: Account[];
  categories: Category[];
  tags: Tag[];
}

export const PurchaseFormContent = ({ accounts, categories, tags }: PurchaseFormProps) => {
  return <View />;
};
