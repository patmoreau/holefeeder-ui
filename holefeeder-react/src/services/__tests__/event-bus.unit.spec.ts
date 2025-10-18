import { eventBus } from '@/services/event-bus';

describe('eventBus', () => {
  test('should emit and listen to events', () => {
    const callback = jest.fn();
    eventBus.on('test-notification', callback);
    eventBus.emit('test-notification', 'test data');
    expect(callback).toHaveBeenNthCalledWith(1, 'test data');
  });

  test('should no longer listen to events after off', () => {
    const callback = jest.fn();
    eventBus.on('test-notification', callback);
    eventBus.emit('test-notification', 'test data');
    eventBus.off('test-notification', callback);
    eventBus.emit('test-notification', 'more test data');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should listen only once', () => {
    const callback = jest.fn();
    eventBus.once('test-notification', callback);
    eventBus.emit('test-notification', 'test data');
    eventBus.emit('test-notification', 'more test data');
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
