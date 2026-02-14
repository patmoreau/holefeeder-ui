import { faker } from '@faker-js/faker';
import { Money } from '@/domain/core/money';
import { Variation } from '@/domain/core/variation';

export const anAmount = () => Money.valid(faker.number.float({ min: 1, max: 10000, fractionDigits: 2 }));

export const aVariation = () => Variation.valid(faker.number.float({ min: -1000, max: 10000, fractionDigits: 2 }));

export const aCount = () => faker.number.int({ min: 0, max: 100 });
