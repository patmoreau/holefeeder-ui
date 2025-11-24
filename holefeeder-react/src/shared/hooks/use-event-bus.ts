import { useEffect, useRef } from 'react';
import { eventBus } from '@/shared/services/event-bus';
import { Event, EventCallback } from '@/types/event';

export const useEventBusListener = (event: Event, callback: EventCallback) => {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  useEffect(() => {
    const handler = (...args: any[]) => callbackRef.current(...args);
    eventBus.on(event, handler);

    return () => eventBus.off(event, handler);
  }, [event]);
};

export const useEventBusEmitter = (): {
  emit: (event: Event, ...args: unknown[]) => void;
  on: (event: Event, callback: (...args: unknown[]) => void) => void;
  off: (event: Event, callback: (...args: unknown[]) => void) => void;
  once: (event: Event, callback: (...args: unknown[]) => void) => void;
} => {
  return {
    emit: (event, ...args) => eventBus.emit(event, ...args),
    on: (event, callback) => eventBus.on(event, callback),
    off: (event, callback) => eventBus.off(event, callback),
    once: (event, callback) => eventBus.once(event, callback),
  };
};
//
// // Usage
// const MyComponent = () => {
//   const { emit } = useEventEmitter();
//
//   useEventListener('notification', (message) => {
//     Alert.alert('Notification', message);
//   });
//
//   return (
//     <AppButton
//       title="Send Notification"
//   onPress={() => emit('notification', 'Hello World!')}
//   />
// );
// };
