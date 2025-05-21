// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'account_type_enum.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class AccountTypeAdapter extends TypeAdapter<AccountType> {
  @override
  final int typeId = 3;

  @override
  AccountType read(BinaryReader reader) {
    switch (reader.readByte()) {
      case 0:
        return AccountType.checking;
      case 1:
        return AccountType.creditCard;
      case 2:
        return AccountType.creditLine;
      case 3:
        return AccountType.investment;
      case 4:
        return AccountType.loan;
      case 5:
        return AccountType.mortgage;
      case 6:
        return AccountType.savings;
      default:
        return AccountType.checking;
    }
  }

  @override
  void write(BinaryWriter writer, AccountType obj) {
    switch (obj) {
      case AccountType.checking:
        writer.writeByte(0);
        break;
      case AccountType.creditCard:
        writer.writeByte(1);
        break;
      case AccountType.creditLine:
        writer.writeByte(2);
        break;
      case AccountType.investment:
        writer.writeByte(3);
        break;
      case AccountType.loan:
        writer.writeByte(4);
        break;
      case AccountType.mortgage:
        writer.writeByte(5);
        break;
      case AccountType.savings:
        writer.writeByte(6);
        break;
    }
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AccountTypeAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
