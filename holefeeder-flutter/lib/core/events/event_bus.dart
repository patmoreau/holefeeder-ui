import 'dart:async';
import 'dart:developer' as developer;

import 'event_payload.dart';

class EventBus {
  static final EventBus _instance = EventBus._();

  final _controller = StreamController<EventPayload>.broadcast();
  final _lastEvents = <Type, EventPayload>{};
  final _activeControllers = <StreamController<dynamic>>{};

  factory EventBus() => _instance;

  EventBus._();

  /// Stream of all events (like RxJS Subject)
  Stream<EventPayload> get stream => _controller.stream;

  /// Fire an event to all listeners
  void fire<T extends EventPayload>(T event) {
    developer.log(
      "Firing ${event.runtimeType} with payload: $event",
      name: 'EventBus',
    );

    // Store last event for BehaviorSubject-like functionality
    _lastEvents[T] = event;
    _controller.add(event);
  }

  /// Listen to events of type T (like RxJS Subject)
  Stream<T> on<T extends EventPayload>() =>
      _controller.stream.where((event) => event is T).cast<T>();

  /// Listen to events with immediate emission of last value (like RxJS BehaviorSubject)
  Stream<T> onWithLastValue<T extends EventPayload>(T? defaultValue) {
    final controller = StreamController<T>.broadcast();
    _activeControllers.add(controller);

    // Emit last value immediately if it exists
    final lastEvent = _lastEvents[T];
    final eventToEmit =
        (lastEvent != null && lastEvent is T) ? lastEvent : defaultValue;

    if (eventToEmit != null) {
      // Schedule emission for next tick to avoid sync emission issues
      scheduleMicrotask(() {
        if (!controller.isClosed) {
          controller.add(eventToEmit);
        }
      });
    }

    // Subscribe to new events
    late StreamSubscription<T> subscription;
    subscription = _controller.stream
        .where((event) => event is T)
        .cast<T>()
        .listen(
          (event) {
            if (!controller.isClosed) {
              controller.add(event);
            }
          },
          onError: (error) {
            if (!controller.isClosed) {
              controller.addError(error);
            }
          },
          onDone: () {
            if (!controller.isClosed) {
              controller.close();
            }
          },
        );

    // Cleanup when controller is closed
    controller.onCancel = () {
      subscription.cancel();
      _activeControllers.remove(controller);
      if (!controller.isClosed) {
        controller.close();
      }
    };

    return controller.stream;
  }

  /// Get the last emitted value for a specific event type
  T? getLastValue<T extends EventPayload>() {
    final lastEvent = _lastEvents[T];
    return lastEvent is T ? lastEvent : null;
  }

  /// Check if there's a cached value for the event type
  bool hasValue<T extends EventPayload>() {
    return _lastEvents.containsKey(T) && _lastEvents[T] is T;
  }

  /// Clear the last value for a specific event type
  void clearLastValue<T extends EventPayload>() {
    _lastEvents.remove(T);
  }

  /// Clear all cached values
  void clearAllLastValues() {
    _lastEvents.clear();
  }

  /// Create a filtered stream (useful for complex event filtering)
  Stream<T> where<T extends EventPayload>(bool Function(T) test) {
    return on<T>().where(test);
  }

  /// Create a filtered stream with last value
  Stream<T> whereWithLastValue<T extends EventPayload>(bool Function(T) test) {
    final controller = StreamController<T>.broadcast();
    _activeControllers.add(controller);

    // Check and emit last value if it passes the test
    final lastEvent = _lastEvents[T];
    if (lastEvent != null && lastEvent is T && test(lastEvent)) {
      scheduleMicrotask(() {
        if (!controller.isClosed) {
          controller.add(lastEvent);
        }
      });
    }

    // Subscribe to filtered events
    late StreamSubscription<T> subscription;
    subscription = on<T>()
        .where(test)
        .listen(
          (event) {
            if (!controller.isClosed) {
              controller.add(event);
            }
          },
          onError: (error) {
            if (!controller.isClosed) {
              controller.addError(error);
            }
          },
          onDone: () {
            if (!controller.isClosed) {
              controller.close();
            }
          },
        );

    controller.onCancel = () {
      subscription.cancel();
      _activeControllers.remove(controller);
      if (!controller.isClosed) {
        controller.close();
      }
    };

    return controller.stream;
  }

  /// Get current number of active controllers (for debugging)
  int get activeControllersCount => _activeControllers.length;

  /// Dispose of the event bus and clean up all resources
  void dispose() {
    // Close all active controllers
    final controllers = List<StreamController<dynamic>>.from(
      _activeControllers,
    );
    for (final controller in controllers) {
      if (!controller.isClosed) {
        controller.close();
      }
    }
    _activeControllers.clear();

    // Clear cached events
    _lastEvents.clear();

    // Close main controller
    if (!_controller.isClosed) {
      _controller.close();
    }
  }
}

// Extension for convenience methods
extension EventBusExtensions on EventBus {
  /// Shorthand for firing events
  void emit<T extends EventPayload>(T event) => fire(event);

  /// Listen to multiple event types
  Stream<EventPayload>
  onAny<T1 extends EventPayload, T2 extends EventPayload>() {
    return stream.where((event) => event is T1 || event is T2);
  }

  /// Listen to multiple event types with last values
  Stream<EventPayload>
  onAnyWithLastValue<T1 extends EventPayload, T2 extends EventPayload>() {
    final controller = StreamController<EventPayload>.broadcast();
    _activeControllers.add(controller);

    // Emit any existing last values
    scheduleMicrotask(() {
      if (!controller.isClosed) {
        final lastT1 = _lastEvents[T1];
        final lastT2 = _lastEvents[T2];

        if (lastT1 != null) controller.add(lastT1);
        if (lastT2 != null) controller.add(lastT2);
      }
    });

    // Subscribe to new events
    late StreamSubscription<EventPayload> subscription;
    subscription = onAny<T1, T2>().listen(
      (event) {
        if (!controller.isClosed) {
          controller.add(event);
        }
      },
      onError: (error) {
        if (!controller.isClosed) {
          controller.addError(error);
        }
      },
      onDone: () {
        if (!controller.isClosed) {
          controller.close();
        }
      },
    );

    controller.onCancel = () {
      subscription.cancel();
      _activeControllers.remove(controller);
      if (!controller.isClosed) {
        controller.close();
      }
    };

    return controller.stream;
  }
}
