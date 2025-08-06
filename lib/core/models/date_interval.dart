/// A class representing a date interval with a start and end date.
class DateInterval {
  final DateTime start;
  final DateTime end;

  const DateInterval(this.start, this.end);

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is DateInterval &&
        other.start.isAtSameMomentAs(start) &&
        other.end.isAtSameMomentAs(end);
  }

  @override
  int get hashCode => start.hashCode ^ end.hashCode;

  @override
  String toString() {
    return 'DateInterval(start: $start, end: $end)';
  }

  factory DateInterval.fromJson(Map<String, dynamic> json) => DateInterval(
    DateTime.parse(json['start'] as String),
    DateTime.parse(json['end'] as String),
  );

  Map<String, dynamic> toJson() {
    return {'start': start.toIso8601String(), 'end': end.toIso8601String()};
  }
}
