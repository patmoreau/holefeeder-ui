export type Event = 'new-transaction' | 'test-notification';

export type EventCallback = (...args: any[]) => void;
