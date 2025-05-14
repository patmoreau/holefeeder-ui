import 'package:decimal/decimal.dart';
import 'package:holefeeder/core/enums/date_interval_type_enum.dart';
import 'package:holefeeder/core/models/account.dart';
import 'package:holefeeder/core/models/category.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';

class PurchaseFormState extends BaseFormState {
  final Decimal amount;
  final DateTime date;
  final String note;
  final Account? selectedAccount;
  final Category? selectedCategory;
  final List<String> tags;
  final bool isCashflow;
  final DateTime effectiveDate;
  final DateIntervalType intervalType;
  final int frequency;
  final int recurrence;
  final List<Account> accounts;
  final List<Category> categories;
  final List<String> availableTags;

  PurchaseFormState({
    Decimal? amount,
    DateTime? date,
    this.note = '',
    this.selectedAccount,
    this.selectedCategory,
    this.tags = const [],
    this.isCashflow = false,
    DateTime? effectiveDate,
    this.intervalType = DateIntervalType.monthly,
    this.frequency = 1,
    this.recurrence = 0,
    this.accounts = const [],
    this.categories = const [],
    this.availableTags = const [],
    super.state = ViewFormState.initial,
    super.errorMessage,
  }) : amount = amount ?? Decimal.zero,
       date = date ?? DateTime.now(),
       effectiveDate = effectiveDate ?? DateTime.now();

  @override
  PurchaseFormState copyWith({
    Decimal? amount,
    DateTime? date,
    String? note,
    Account? selectedAccount,
    Category? selectedCategory,
    List<String>? tags,
    bool? isCashflow,
    DateTime? effectiveDate,
    DateIntervalType? intervalType,
    int? frequency,
    int? recurrence,
    List<Account>? accounts,
    List<Category>? categories,
    List<String>? availableTags,
    ViewFormState? state,
    String? errorMessage,
  }) {
    return PurchaseFormState(
      amount: amount ?? this.amount,
      date: date ?? this.date,
      note: note ?? this.note,
      selectedAccount: selectedAccount ?? this.selectedAccount,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      tags: tags ?? this.tags,
      isCashflow: isCashflow ?? this.isCashflow,
      effectiveDate: effectiveDate ?? this.effectiveDate,
      intervalType: intervalType ?? this.intervalType,
      frequency: frequency ?? this.frequency,
      recurrence: recurrence ?? this.recurrence,
      accounts: accounts ?? this.accounts,
      categories: categories ?? this.categories,
      availableTags: availableTags ?? this.availableTags,
      state: state ?? this.state,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}
