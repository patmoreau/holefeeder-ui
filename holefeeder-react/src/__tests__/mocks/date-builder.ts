import { faker } from '@faker-js/faker';

export const aPastDate = () => faker.date.past().toISOString().split('T')[0];

export const aRecentDate = () => faker.date.recent().toISOString().split('T')[0];
