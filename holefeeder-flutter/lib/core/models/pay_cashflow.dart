import 'package:decimal/decimal.dart';
import 'package:intl/intl.dart';

class PayCashflow {
  final DateTime date;
  final Decimal amount;
  final String cashflowId;
  final DateTime cashflowDate;

  const PayCashflow({
    required this.date,
    required this.amount,
    required this.cashflowId,
    required this.cashflowDate,
  });

  factory PayCashflow.fromJson(Map<String, dynamic> json) {
    return PayCashflow(
      date: DateTime.parse(json['date'] as String),
      amount: Decimal.parse(json['amount'] as String),
      cashflowId: json['cashflowId'] as String,
      cashflowDate: DateTime.parse(json['cashflowDate'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'date': DateFormat('yyyy-MM-dd').format(date),
      'amount': double.parse(amount.toString()),
      'cashflowId': cashflowId,
      'cashflowDate': DateFormat('yyyy-MM-dd').format(cashflowDate),
    };
  }
}
