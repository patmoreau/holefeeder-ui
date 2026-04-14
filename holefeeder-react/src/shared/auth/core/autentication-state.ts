import { TokenInfo } from '@/shared/auth/core/token-info';
import { User } from '@/shared/auth/core/user';

export type AuthenticationState = {
  user: User | undefined;
  isLoading: boolean;
  getToken: () => Promise<TokenInfo | undefined>;
  login: () => void;
  logout: () => void;
};
