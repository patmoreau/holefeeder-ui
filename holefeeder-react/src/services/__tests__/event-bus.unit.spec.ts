import { eventBus } from '@/services';

describe('eventBus', () => {
  test('should emit and listen to events', () => {
    const callback = jest.fn();
    eventBus.on('notification', callback);
    eventBus.emit('notification', 'test data');
    expect(callback).toHaveBeenNthCalledWith(1, 'test data');
  });

  test('should no longer listen to events after off', () => {
    const callback = jest.fn();
    eventBus.on('notification', callback);
    eventBus.emit('notification', 'test data');
    eventBus.off('notification', callback);
    eventBus.emit('notification', 'more test data');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should listen only once', () => {
    const callback = jest.fn();
    eventBus.once('notification', callback);
    eventBus.emit('notification', 'test data');
    eventBus.emit('notification', 'more test data');
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
