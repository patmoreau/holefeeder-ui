abstract class EventPayload {
  const EventPayload();

  String get name;

  static EventPayload get empty =>
      throw UnimplementedError(
        'Subclasses must implement a static empty getter',
      );

  @override
  String toString() => '$runtimeType(name: $name)';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is EventPayload && runtimeType == other.runtimeType;

  @override
  int get hashCode => runtimeType.hashCode;
}
