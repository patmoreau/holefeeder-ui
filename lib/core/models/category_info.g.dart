// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'category_info.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class CategoryInfoAdapter extends TypeAdapter<CategoryInfo> {
  @override
  final int typeId = 6;

  @override
  CategoryInfo read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return CategoryInfo(
      id: fields[0] as String,
      name: fields[1] as String,
      type: fields[2] as CategoryType,
      color: fields[3] as String,
    );
  }

  @override
  void write(BinaryWriter writer, CategoryInfo obj) {
    writer
      ..writeByte(4)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.type)
      ..writeByte(3)
      ..write(obj.color);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CategoryInfoAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
