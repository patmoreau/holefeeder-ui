import 'package:decimal/decimal.dart';
import 'package:holefeeder/core/models/account_info.dart';
import 'package:holefeeder/core/models/category_info.dart';
import 'package:intl/intl.dart';

class Upcoming {
  final String id;
  final DateTime date;
  final Decimal amount;
  final String description;
  final List<String> tags;
  final CategoryInfo category;
  final AccountInfo account;

  const Upcoming({
    required this.id,
    required this.date,
    required this.amount,
    required this.description,
    required this.tags,
    required this.category,
    required this.account,
  });

  factory Upcoming.fromJson(Map<String, dynamic> json) {
    return Upcoming(
      id: json['id'] as String,
      date: DateTime.parse(json['date'] as String),
      amount: Decimal.parse(json['amount'].toString()),
      description: json['description'] as String,
      tags:
          (json['tags'] as List<dynamic>).map((tag) => tag as String).toList(),
      category: CategoryInfo.fromJson(json['category'] as Map<String, dynamic>),
      account: AccountInfo.fromJson(json['account'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'date': DateFormat('yyyy-MM-dd').format(date),
      'amount': double.parse(amount.toString()),
      'description': description,
      'tags': tags,
      'category': category.toJson(),
      'account': account.toJson(),
    };
  }
}
