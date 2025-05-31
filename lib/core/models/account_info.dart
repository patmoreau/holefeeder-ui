import 'package:hive/hive.dart';
import 'package:holefeeder/core/constants/hive_constants.dart';

part 'account_info.g.dart';

@HiveType(typeId: HiveConstants.accountInfoTypeId)
class AccountInfo {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String name;

  const AccountInfo({required this.id, required this.name});

  static final AccountInfo empty = AccountInfo(id: '', name: '');

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AccountInfo && id == other.id && name == other.name;

  @override
  int get hashCode => id.hashCode ^ name.hashCode;

  factory AccountInfo.fromJson(Map<String, dynamic> json) {
    return AccountInfo(id: json['id'] as String, name: json['name'] as String);
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name};
  }
}
