import 'package:decimal/decimal.dart';
import 'package:intl/intl.dart';

class Transfer {
  final DateTime date;
  final Decimal amount;
  final String description;
  final String fromAccountId;
  final String toAccountId;

  const Transfer({
    required this.date,
    required this.amount,
    required this.description,
    required this.fromAccountId,
    required this.toAccountId,
  });

  factory Transfer.fromJson(Map<String, dynamic> json) => Transfer(
    date: DateTime.parse(json['date'] as String),
    amount: Decimal.parse(json['amount'] as String),
    description: json['description'] as String,
    fromAccountId: json['fromAccountId'] as String,
    toAccountId: json['toAccountId'] as String,
  );

  Map<String, dynamic> toJson() => {
    'date': DateFormat('yyyy-MM-dd').format(date),
    'amount': double.parse(amount.toString()),
    'description': description,
    'fromAccountId': fromAccountId,
    'toAccountId': toAccountId,
  };
}
