// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'upcoming.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class UpcomingAdapter extends TypeAdapter<Upcoming> {
  @override
  final int typeId = 8;

  @override
  Upcoming read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Upcoming(
      id: fields[0] as String,
      date: fields[1] as DateTime,
      amount: fields[2] as Decimal,
      description: fields[3] as String,
      tags: (fields[4] as List).cast<String>(),
      category: fields[5] as CategoryInfo,
      account: fields[6] as AccountInfo,
    );
  }

  @override
  void write(BinaryWriter writer, Upcoming obj) {
    writer
      ..writeByte(7)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.date)
      ..writeByte(2)
      ..write(obj.amount)
      ..writeByte(3)
      ..write(obj.description)
      ..writeByte(4)
      ..write(obj.tags)
      ..writeByte(5)
      ..write(obj.category)
      ..writeByte(6)
      ..write(obj.account);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UpcomingAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
