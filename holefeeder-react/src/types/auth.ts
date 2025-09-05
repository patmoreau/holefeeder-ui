export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  accessToken: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

export interface User {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
  [key: string]: any;
}
