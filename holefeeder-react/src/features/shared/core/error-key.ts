export const ErrorKey = {
  noInternetConnection: 'noInternetConnection',
  cannotReachServer: 'cannotReachServer',
} as const;

export type ErrorKey = (typeof ErrorKey)[keyof typeof ErrorKey];
