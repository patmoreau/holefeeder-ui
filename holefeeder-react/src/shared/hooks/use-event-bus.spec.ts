import { renderHook } from '@testing-library/react-native';
import { useEventBusEmitter, useEventBusListener } from '@/shared/hooks/use-event-bus';
import { eventBus } from '@/shared/services/event-bus';

const notification = 'test-notification';
describe('useEventBus', () => {
  describe('useEventBusEmitter', () => {
    let renderHookResult: any;

    beforeEach(() => {
      renderHookResult = renderHook(() => useEventBusEmitter());
    });

    afterEach(() => {
      renderHookResult.unmount();
    });

    it('should return event bus instance', () => {
      // Test that the methods exist and are functions
      expect(typeof renderHookResult.result.current.on).toBe('function');
      expect(typeof renderHookResult.result.current.off).toBe('function');
      expect(typeof renderHookResult.result.current.emit).toBe('function');
      expect(typeof renderHookResult.result.current.once).toBe('function');
    });

    describe('when eventBus methods are called', () => {
      const mockCallback = jest.fn();

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should delegate on to eventBus method', () => {
        const onSpy = jest.spyOn(eventBus, 'on');

        renderHookResult.result.current.on(notification, mockCallback);

        expect(onSpy).toHaveBeenCalledWith(notification, mockCallback);
      });

      it('should delegate off to eventBus method', () => {
        const offSpy = jest.spyOn(eventBus, 'off');

        renderHookResult.result.current.off(notification, mockCallback);

        expect(offSpy).toHaveBeenCalledWith(notification, mockCallback);
      });

      it('should delegate emit to eventBus method', () => {
        const emitSpy = jest.spyOn(eventBus, 'emit');

        renderHookResult.result.current.emit(notification, 'data');

        expect(emitSpy).toHaveBeenCalledWith(notification, 'data');
      });

      it('should delegate once to eventBus method', () => {
        const onceSpy = jest.spyOn(eventBus, 'once');

        renderHookResult.result.current.once(notification, mockCallback);

        expect(onceSpy).toHaveBeenCalledWith(notification, mockCallback);
      });
    });
  });

  describe('useEventBusListener', () => {
    const eventCallbackSpy = jest.fn();
    let renderHookResult: any;

    beforeEach(() => {
      jest.clearAllMocks();
      renderHookResult = renderHook(() => useEventBusListener(notification, eventCallbackSpy));
    });

    afterEach(() => {
      renderHookResult.unmount();
    });

    it('should register event listener on mount', () => {
      const onSpy = jest.spyOn(eventBus, 'on');

      renderHook(() => useEventBusListener(notification, eventCallbackSpy));

      expect(onSpy).toHaveBeenCalledWith(notification, expect.any(Function));
    });

    it('should unregister event listener on unmount', () => {
      const offSpy = jest.spyOn(eventBus, 'off');

      const { unmount } = renderHook(() => useEventBusListener(notification, eventCallbackSpy));

      unmount();

      expect(offSpy).toHaveBeenCalledWith(notification, expect.any(Function));
    });

    it('should call callback when event is emitted', () => {
      renderHook(() => useEventBusListener(notification, eventCallbackSpy));

      eventBus.emit(notification, notification);

      expect(eventCallbackSpy).toHaveBeenCalledWith(notification);
    });

    it('should update callback when it changes', () => {
      const initialCallback = jest.fn();
      const newCallback = jest.fn();

      const { rerender } = renderHook((props: { callback: jest.Mock }) => useEventBusListener(notification, props.callback), {
        initialProps: { callback: initialCallback },
      });

      rerender({ callback: newCallback });

      eventBus.emit(notification, notification);

      expect(initialCallback).not.toHaveBeenCalled();
      expect(newCallback).toHaveBeenCalledWith(notification);
    });
  });
});
