import { faker } from '@faker-js/faker';
import { anId } from '@/__tests__';
import { StoreItem } from '@/features/dashboard/core/store-item';

const defaultStoreItem = () => ({
  id: anId(),
  code: faker.lorem.word(),
  data: JSON.stringify({
    description: faker.lorem.sentence(),
    value: faker.number.int(),
    active: faker.datatype.boolean(),
  }),
});

export const aStoreItem = (overrides?: Partial<StoreItem>) => ({
  ...defaultStoreItem(),
  ...overrides,
});
