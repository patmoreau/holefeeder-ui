import 'package:decimal/decimal.dart';
import 'package:hive_ce/hive.dart';
import 'package:holefeeder/core.dart';

class DecimalAdapter extends TypeAdapter<Decimal> {
  @override
  final int typeId = HiveConstants.decimalTypeId;

  @override
  Decimal read(BinaryReader reader) {
    final value = reader.readString();
    return Decimal.parse(value);
  }

  @override
  void write(BinaryWriter writer, Decimal obj) {
    writer.writeString(obj.toString());
  }
}
