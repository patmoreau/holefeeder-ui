import { faker } from '@faker-js/faker';
import { anId } from '@/__tests__/mocks/string-builder';
import { StoreItem } from '@/use-cases/core/store-items/store-item';

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
