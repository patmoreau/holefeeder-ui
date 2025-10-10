import { EventCallback, Event } from '@/types';

const createEventBus = () => {
  const events: { [key: string]: EventCallback[] } = {};

  const emit = (event: Event, ...args: any[]) => {
    if (!events[event]) return;
    events[event].forEach((callback) => callback(...args));
  };

  const on = (event: Event, callback: EventCallback) => {
    if (!events[event]) {
      events[event] = [];
    }
    events[event].push(callback);
  };

  const off = (event: Event, callback: EventCallback) => {
    if (!events[event]) return;
    events[event] = events[event].filter((cb) => cb !== callback);
  };

  const once = (event: Event, callback: EventCallback) => {
    const onceWrapper = (...args: any[]) => {
      callback(...args);
      off(event, onceWrapper);
    };
    on(event, onceWrapper);
  };

  return {
    emit,
    on,
    off,
    once,
  };
};

export const eventBus = createEventBus();
