export interface TokenInfo {
  accessToken: string | null;
  expiresAt: string | null;
  issuedAt: string | null;
  refreshToken: boolean;
}
