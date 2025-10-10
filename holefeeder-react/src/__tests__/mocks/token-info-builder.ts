import { faker } from '@faker-js/faker';
import { TokenInfo } from '../../types';

const defaultData = (): TokenInfo => ({
  accessToken: faker.internet.jwt(),
  expiresAt: faker.date.future().toISOString(),
  issuedAt: faker.date.past().toISOString(),
  refreshToken: faker.datatype.boolean(),
});

const emptyData = {
  accessToken: null,
  expiresAt: null,
  issuedAt: null,
  refreshToken: false,
};

export const aTokenInfo = (overrides?: Partial<TokenInfo>): TokenInfo => ({
  ...defaultData(),
  ...overrides,
});

export const anEmptyTokenInfo = (overrides?: Partial<TokenInfo>): TokenInfo => ({ ...emptyData, ...overrides });
