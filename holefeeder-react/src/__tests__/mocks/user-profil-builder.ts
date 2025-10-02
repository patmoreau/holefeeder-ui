import { UserProfile } from '@/types';

const defaultData = (): UserProfile => ({
  name: 'Mock User',
  username: 'mock-username',
  email: 'mock-email@example.com',
  avatar: 'mock-avatar-url',
});

export const aUserProfile = (overrides?: Partial<UserProfile>): UserProfile => ({
  ...defaultData(),
  ...overrides,
});
