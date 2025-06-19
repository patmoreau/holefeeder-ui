import 'dart:async';
import 'dart:developer' as developer;

import 'event_payload.dart';

class EventBus {
  static final EventBus _instance = EventBus._internal();

  final _controller = StreamController<EventPayload>.broadcast();

  factory EventBus() => _instance;

  EventBus._internal();

  Stream<EventPayload> get stream => _controller.stream;

  Stream<T> on<T extends EventPayload>() =>
      _controller.stream.where((payload) => payload is T).cast<T>();

  void fire<T extends EventPayload>(T event) {
    developer.log(
      "Firing ${event.name} with payload: $event",
      name: 'EventBus',
    );
    _controller.add(event);
  }

  void dispose() => _controller.close();
}
