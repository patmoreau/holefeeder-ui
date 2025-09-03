extension DateTimeExtensions on DateTime {
  DateTime get empty => DateTime(1970, 1, 1);
  bool get isEmpty => this == empty;
}
