// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'date_interval_type_enum.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class DateIntervalTypeAdapter extends TypeAdapter<DateIntervalType> {
  @override
  final int typeId = 0;

  @override
  DateIntervalType read(BinaryReader reader) {
    switch (reader.readByte()) {
      case 0:
        return DateIntervalType.weekly;
      case 1:
        return DateIntervalType.monthly;
      case 2:
        return DateIntervalType.yearly;
      case 3:
        return DateIntervalType.oneTime;
      default:
        return DateIntervalType.weekly;
    }
  }

  @override
  void write(BinaryWriter writer, DateIntervalType obj) {
    switch (obj) {
      case DateIntervalType.weekly:
        writer.writeByte(0);
        break;
      case DateIntervalType.monthly:
        writer.writeByte(1);
        break;
      case DateIntervalType.yearly:
        writer.writeByte(2);
        break;
      case DateIntervalType.oneTime:
        writer.writeByte(3);
        break;
    }
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DateIntervalTypeAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
