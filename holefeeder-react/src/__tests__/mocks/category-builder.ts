import { Category } from '@/types';

const defaultData = (): Category => ({
  id: '1',
  name: 'Test',
  color: '#000000',
  budgetAmount: 0,
  favorite: false,
});

export const aCategory = (data: Partial<Category> = {}): Category => ({ ...defaultData(), ...data });
