import 'package:hive_ce/hive.dart';

class AccountInfo extends HiveObject {
  final String id;

  final String name;

  AccountInfo({required this.id, required this.name});

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
