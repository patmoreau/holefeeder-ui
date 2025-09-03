import 'package:decimal/decimal.dart';
import 'package:intl/intl.dart';

class ModifyCashflow {
  final String id;
  final DateTime effectiveDate;
  final Decimal amount;
  final String description;
  final List<String> tags;

  const ModifyCashflow({
    required this.id,
    required this.effectiveDate,
    required this.amount,
    required this.description,
    required this.tags,
  });

  factory ModifyCashflow.fromJson(Map<String, dynamic> json) {
    return ModifyCashflow(
      id: json['id'] as String,
      effectiveDate: DateTime.parse(json['effectiveDate'] as String),
      amount: Decimal.parse(json['amount'] as String),
      description: json['description'] as String,
      tags: List<String>.from(json['tags'] as List),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'effectiveDate': DateFormat('yyyy-MM-dd').format(effectiveDate),
      'amount': double.parse(amount.toString()),
      'description': description,
      'tags': tags,
    };
  }
}
