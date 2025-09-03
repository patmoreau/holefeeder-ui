// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'hive_adapters.dart';

// **************************************************************************
// AdaptersGenerator
// **************************************************************************

class AccountAdapter extends TypeAdapter<Account> {
  @override
  final typeId = 0;

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
      transactionCount: (fields[5] as num).toInt(),
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

class AccountInfoAdapter extends TypeAdapter<AccountInfo> {
  @override
  final typeId = 1;

  @override
  AccountInfo read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return AccountInfo(id: fields[0] as String, name: fields[1] as String);
  }

  @override
  void write(BinaryWriter writer, AccountInfo obj) {
    writer
      ..writeByte(2)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AccountInfoAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class AccountTypeAdapter extends TypeAdapter<AccountType> {
  @override
  final typeId = 2;

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
      case AccountType.creditCard:
        writer.writeByte(1);
      case AccountType.creditLine:
        writer.writeByte(2);
      case AccountType.investment:
        writer.writeByte(3);
      case AccountType.loan:
        writer.writeByte(4);
      case AccountType.mortgage:
        writer.writeByte(5);
      case AccountType.savings:
        writer.writeByte(6);
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

class CategoryAdapter extends TypeAdapter<Category> {
  @override
  final typeId = 3;

  @override
  Category read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Category(
      id: fields[0] as String,
      name: fields[1] as String,
      color: fields[2] as String,
      budgetAmount: fields[3] as Decimal,
      favorite: fields[4] as bool,
    );
  }

  @override
  void write(BinaryWriter writer, Category obj) {
    writer
      ..writeByte(5)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.color)
      ..writeByte(3)
      ..write(obj.budgetAmount)
      ..writeByte(4)
      ..write(obj.favorite);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CategoryAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class CategoryInfoAdapter extends TypeAdapter<CategoryInfo> {
  @override
  final typeId = 4;

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

class CategoryTypeAdapter extends TypeAdapter<CategoryType> {
  @override
  final typeId = 5;

  @override
  CategoryType read(BinaryReader reader) {
    switch (reader.readByte()) {
      case 0:
        return CategoryType.expense;
      case 1:
        return CategoryType.gain;
      default:
        return CategoryType.expense;
    }
  }

  @override
  void write(BinaryWriter writer, CategoryType obj) {
    switch (obj) {
      case CategoryType.expense:
        writer.writeByte(0);
      case CategoryType.gain:
        writer.writeByte(1);
    }
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CategoryTypeAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class DateIntervalTypeAdapter extends TypeAdapter<DateIntervalType> {
  @override
  final typeId = 6;

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
      case DateIntervalType.monthly:
        writer.writeByte(1);
      case DateIntervalType.yearly:
        writer.writeByte(2);
      case DateIntervalType.oneTime:
        writer.writeByte(3);
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

class UpcomingAdapter extends TypeAdapter<Upcoming> {
  @override
  final typeId = 7;

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

class UserSettingsAdapter extends TypeAdapter<UserSettings> {
  @override
  final typeId = 8;

  @override
  UserSettings read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return UserSettings(
      effectiveDate: fields[0] as DateTime,
      intervalType: fields[1] as DateIntervalType,
      frequency: (fields[2] as num).toInt(),
    );
  }

  @override
  void write(BinaryWriter writer, UserSettings obj) {
    writer
      ..writeByte(3)
      ..writeByte(0)
      ..write(obj.effectiveDate)
      ..writeByte(1)
      ..write(obj.intervalType)
      ..writeByte(2)
      ..write(obj.frequency);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UserSettingsAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class TagAdapter extends TypeAdapter<Tag> {
  @override
  final typeId = 9;

  @override
  Tag read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Tag(tag: fields[0] as String, count: (fields[1] as num).toInt());
  }

  @override
  void write(BinaryWriter writer, Tag obj) {
    writer
      ..writeByte(2)
      ..writeByte(0)
      ..write(obj.tag)
      ..writeByte(1)
      ..write(obj.count);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TagAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class TransactionAdapter extends TypeAdapter<Transaction> {
  @override
  final typeId = 10;

  @override
  Transaction read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Transaction(
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
  void write(BinaryWriter writer, Transaction obj) {
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
      other is TransactionAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class CashflowAdapter extends TypeAdapter<Cashflow> {
  @override
  final typeId = 11;

  @override
  Cashflow read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Cashflow(
      id: fields[0] as String,
      effectiveDate: fields[1] as DateTime,
      amount: fields[2] as Decimal,
      intervalType: fields[3] as DateIntervalType,
      frequency: (fields[4] as num).toInt(),
      recurrence: (fields[5] as num).toInt(),
      description: fields[6] as String,
      inactive: fields[7] == null ? false : fields[7] as bool,
      tags: (fields[8] as List).cast<String>(),
      category: fields[9] as CategoryInfo,
      account: fields[10] as AccountInfo,
    );
  }

  @override
  void write(BinaryWriter writer, Cashflow obj) {
    writer
      ..writeByte(11)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.effectiveDate)
      ..writeByte(2)
      ..write(obj.amount)
      ..writeByte(3)
      ..write(obj.intervalType)
      ..writeByte(4)
      ..write(obj.frequency)
      ..writeByte(5)
      ..write(obj.recurrence)
      ..writeByte(6)
      ..write(obj.description)
      ..writeByte(7)
      ..write(obj.inactive)
      ..writeByte(8)
      ..write(obj.tags)
      ..writeByte(9)
      ..write(obj.category)
      ..writeByte(10)
      ..write(obj.account);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CashflowAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
