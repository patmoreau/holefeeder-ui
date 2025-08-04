import 'package:decimal/decimal.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/services/services.dart';

import '../base_form_state.dart';
import '../base_view_model.dart';
import 'edit_cashflow_form_state.dart';

class EditCashflowViewModel extends BaseViewModel<EditCashflowFormState> {
  final CashflowRepository _cashflowRepository;
  final AccountRepository _accountRepository;
  final CategoryRepository _categoryRepository;
  final TagRepository _tagRepository;

  EditCashflowViewModel({
    Cashflow? cashflow,
    required CashflowRepository cashflowRepository,
    required AccountRepository accountRepository,
    required CategoryRepository categoryRepository,
    required TagRepository tagRepository,
    required super.notificationService,
  }) : _cashflowRepository = cashflowRepository,
       _accountRepository = accountRepository,
       _categoryRepository = categoryRepository,
       _tagRepository = tagRepository,
       super(
         formState: EditCashflowFormState(
           id: cashflow?.id ?? '',
           amount: cashflow?.amount ?? Decimal.zero,
           effectiveDate: cashflow?.effectiveDate ?? DateTime.now(),
           note: cashflow?.description ?? '',
           tags: cashflow?.tags.toList() ?? [],
           state: ViewFormState.initial,
         ),
       ) {
    _loadInitialData(cashflow);
  }

  String get id => formState.id;

  Decimal get amount => formState.amount;

  DateTime get date => formState.effectiveDate;

  String get note => formState.note;

  Account? get selectedAccount => formState.selectedAccount;

  Category? get selectedCategory => formState.selectedCategory;

  List<String> get tags => formState.tags;

  List<Account> get accounts => formState.accounts;

  List<Category> get categories => formState.categories;

  List<String> get availableTags => formState.availableTags;

  Future<void> _loadInitialData(Cashflow? cashflow) async {
    await handleAsync(() async {
      final accounts = await _accountRepository.getActiveAccounts();
      final categories = await _categoryRepository.getAll();
      final availableTags =
          (await _tagRepository.getAll()).map((t) => t.tag).toList();

      final selectedAccount =
          accounts.where((a) => a.id == cashflow?.account.id).firstOrNull ??
          accounts.firstOrNull;
      final selectedCategory =
          categories.where((a) => a.id == cashflow?.category.id).firstOrNull ??
          categories.firstOrNull;
      updateState(
        (s) => s.copyWith(
          accounts: accounts,
          categories: categories,
          availableTags: availableTags,
          selectedAccount: selectedAccount,
          selectedCategory: selectedCategory,
          state: ViewFormState.ready,
        ),
      );
    });
  }

  void updateAmount(Decimal value) =>
      updateState((s) => s.copyWith(amount: value));

  void updateDate(DateTime value) =>
      updateState((s) => s.copyWith(effectiveDate: value));

  void updateNote(String value) => updateState((s) => s.copyWith(note: value));

  void setSelectedAccount(Account? account) =>
      updateState((s) => s.copyWith(selectedAccount: account));

  void setSelectedCategory(Category? category) =>
      updateState((s) => s.copyWith(selectedCategory: category));

  void updateTags(List<String> tags) =>
      updateState((s) => s.copyWith(tags: tags));

  bool validateCashflow() {
    if (formState.amount <= Decimal.zero) {
      setFormError(L10nService.current.validationNumberGreaterThanZero);
      return false;
    }
    if (formState.selectedAccount == null) {
      setFormError(L10nService.current.selectAccountError);
      return false;
    }
    if (formState.selectedCategory == null) {
      setFormError(L10nService.current.selectCategoryError);
      return false;
    }
    return true;
  }

  Future<void> save() async {
    if (!validateCashflow()) {
      return;
    }

    await handleAsync(() async {
      final state = formState;
      await _cashflowRepository.modify(
        ModifyCashflow(
          id: state.id,
          amount: state.amount,
          description: state.note,
          tags: state.tags.toList(),
          effectiveDate: state.effectiveDate,
        ),
      );
    });
  }
}
