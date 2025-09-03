import 'package:decimal/decimal.dart';
import 'package:intl/intl.dart';

class ModifyTransaction {
  final String id;
  final DateTime date;
  final Decimal amount;
  final String description;
  final String accountId;
  final String categoryId;
  final List<String> tags;

  const ModifyTransaction({
    required this.id,
    required this.date,
    required this.amount,
    required this.description,
    required this.accountId,
    required this.categoryId,
    required this.tags,
  });

  factory ModifyTransaction.fromJson(Map<String, dynamic> json) {
    return ModifyTransaction(
      id: json['id'] as String,
      date: DateTime.parse(json['date'] as String),
      amount: Decimal.parse(json['amount'] as String),
      description: json['description'] as String,
      accountId: json['accountId'] as String,
      categoryId: json['categoryId'] as String,
      tags: List<String>.from(json['tags'] as List),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'date': DateFormat('yyyy-MM-dd').format(date),
      'amount': double.parse(amount.toString()),
      'description': description,
      'accountId': accountId,
      'categoryId': categoryId,
      'tags': tags,
    };
  }
}
