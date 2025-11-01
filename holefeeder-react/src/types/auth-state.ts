import { User } from 'react-native-auth0';
import { TokenInfo } from '@/types/token-info';

export interface AuthState {
  tokenInfo: TokenInfo;
  isLoading: boolean;
  isReady: boolean;
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}
