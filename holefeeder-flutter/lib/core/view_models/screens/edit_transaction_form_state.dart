import 'package:decimal/decimal.dart';
import 'package:holefeeder/core/models.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';

class EditTransactionFormState extends BaseFormState {
  final String id;
  final Decimal amount;
  final DateTime date;
  final String note;
  final Account? selectedAccount;
  final Category? selectedCategory;
  final List<String> tags;
  final List<Account> accounts;
  final List<Category> categories;
  final List<String> availableTags;

  EditTransactionFormState({
    this.id = '',
    Decimal? amount,
    DateTime? date,
    this.note = '',
    this.selectedAccount,
    this.selectedCategory,
    this.tags = const [],
    this.accounts = const [],
    this.categories = const [],
    this.availableTags = const [],
    super.state = ViewFormState.initial,
    super.errorMessage,
  }) : amount = amount ?? Decimal.zero,
       date = date ?? DateTime.now();

  @override
  EditTransactionFormState copyWith({
    String? id,
    Decimal? amount,
    DateTime? date,
    String? note,
    Account? selectedAccount,
    Category? selectedCategory,
    List<String>? tags,
    List<Account>? accounts,
    List<Category>? categories,
    List<String>? availableTags,
    ViewFormState? state,
    String? errorMessage,
  }) {
    return EditTransactionFormState(
      id: id ?? this.id,
      amount: amount ?? this.amount,
      date: date ?? this.date,
      note: note ?? this.note,
      selectedAccount: selectedAccount ?? this.selectedAccount,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      tags: tags ?? this.tags,
      accounts: accounts ?? this.accounts,
      categories: categories ?? this.categories,
      availableTags: availableTags ?? this.availableTags,
      state: state ?? this.state,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}
