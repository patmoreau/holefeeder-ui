// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'account.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class AccountAdapter extends TypeAdapter<Account> {
  @override
  final int typeId = 2;

  @override
  Account read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Account(
      id: fields[0] as String,
      name: fields[1] as String,
      type: fields[2] as AccountType,
      openBalance: fields[3] as Decimal,
      openDate: fields[4] as DateTime,
      transactionCount: fields[5] as int,
      balance: fields[6] as Decimal,
      updated: fields[7] as DateTime,
      description: fields[8] as String,
      favorite: fields[9] as bool,
      inactive: fields[10] as bool,
    );
  }

  @override
  void write(BinaryWriter writer, Account obj) {
    writer
      ..writeByte(11)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.type)
      ..writeByte(3)
      ..write(obj.openBalance)
      ..writeByte(4)
      ..write(obj.openDate)
      ..writeByte(5)
      ..write(obj.transactionCount)
      ..writeByte(6)
      ..write(obj.balance)
      ..writeByte(7)
      ..write(obj.updated)
      ..writeByte(8)
      ..write(obj.description)
      ..writeByte(9)
      ..write(obj.favorite)
      ..writeByte(10)
      ..write(obj.inactive);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AccountAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
