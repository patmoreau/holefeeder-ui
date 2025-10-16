import { faker } from '@faker-js/faker';

export const anAmount = () => faker.number.float({ min: 1, max: 10000, fractionDigits: 2 });

export const aCount = () => faker.number.int({ min: 0, max: 100 });
