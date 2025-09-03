import 'package:decimal/decimal.dart';
import 'package:holefeeder/core/enums.dart';
import 'package:holefeeder/core/models.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';

class EditCashflowFormState extends BaseFormState {
  final String id;
  final Decimal amount;
  final DateTime effectiveDate;
  final String note;
  final Account? selectedAccount;
  final Category? selectedCategory;
  final DateIntervalType intervalType;
  final int frequency;
  final int recurrence;
  final List<String> tags;
  final List<Account> accounts;
  final List<Category> categories;
  final List<String> availableTags;

  EditCashflowFormState({
    this.id = '',
    Decimal? amount,
    DateTime? effectiveDate,
    this.note = '',
    this.selectedAccount,
    this.selectedCategory,
    this.intervalType = DateIntervalType.monthly,
    this.frequency = 1,
    this.recurrence = 0,
    this.tags = const [],
    this.accounts = const [],
    this.categories = const [],
    this.availableTags = const [],
    super.state = ViewFormState.initial,
    super.errorMessage,
  }) : amount = amount ?? Decimal.zero,
       effectiveDate = effectiveDate ?? DateTime.now();

  @override
  EditCashflowFormState copyWith({
    String? id,
    Decimal? amount,
    DateTime? effectiveDate,
    String? note,
    Account? selectedAccount,
    Category? selectedCategory,
    DateIntervalType? intervalType,
    int? frequency,
    int? recurrence,
    List<String>? tags,
    List<Account>? accounts,
    List<Category>? categories,
    List<String>? availableTags,
    ViewFormState? state,
    String? errorMessage,
  }) {
    return EditCashflowFormState(
      id: id ?? this.id,
      amount: amount ?? this.amount,
      effectiveDate: effectiveDate ?? this.effectiveDate,
      note: note ?? this.note,
      selectedAccount: selectedAccount ?? this.selectedAccount,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      intervalType: intervalType ?? this.intervalType,
      frequency: frequency ?? this.frequency,
      recurrence: recurrence ?? this.recurrence,
      tags: tags ?? this.tags,
      accounts: accounts ?? this.accounts,
      categories: categories ?? this.categories,
      availableTags: availableTags ?? this.availableTags,
      state: state ?? this.state,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}
