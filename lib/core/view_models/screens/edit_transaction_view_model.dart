import 'package:decimal/decimal.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/repositories/repositories.dart';
import 'package:holefeeder/core/services/services.dart';

import '../base_form_state.dart';
import '../base_view_model.dart';
import 'edit_transaction_form_state.dart';

class EditTransactionViewModel extends BaseViewModel<EditTransactionFormState> {
  final TransactionRepository _transactionRepository;
  final AccountRepository _accountRepository;
  final CategoryRepository _categoryRepository;
  final TagRepository _tagRepository;

  EditTransactionViewModel({
    Transaction? transaction,
    required TransactionRepository transactionRepository,
    required AccountRepository accountRepository,
    required CategoryRepository categoryRepository,
    required TagRepository tagRepository,
    required super.notificationService,
  }) : _transactionRepository = transactionRepository,
       _accountRepository = accountRepository,
       _categoryRepository = categoryRepository,
       _tagRepository = tagRepository,
       super(
         formState: EditTransactionFormState(
           id: transaction?.id ?? '',
           amount: transaction?.amount ?? Decimal.zero,
           date: transaction?.date ?? DateTime.now(),
           note: transaction?.description ?? '',
           tags: transaction?.tags.toList() ?? [],
           state: ViewFormState.initial,
         ),
       ) {
    _loadInitialData(transaction);
  }

  String get id => formState.id;

  Decimal get amount => formState.amount;

  DateTime get date => formState.date;

  String get note => formState.note;

  Account? get selectedAccount => formState.selectedAccount;

  Category? get selectedCategory => formState.selectedCategory;

  List<String> get tags => formState.tags;

  List<Account> get accounts => formState.accounts;

  List<Category> get categories => formState.categories;

  List<String> get availableTags => formState.availableTags;

  Future<void> _loadInitialData(Transaction? transaction) async {
    await handleAsync(() async {
      final accounts = await _accountRepository.getActiveAccounts();
      final categories = await _categoryRepository.getAll();
      final availableTags =
          (await _tagRepository.getAll()).map((t) => t.tag).toList();

      final selectedAccount =
          accounts.where((a) => a.id == transaction?.account.id).firstOrNull ??
          accounts.firstOrNull;
      final selectedCategory =
          categories
              .where((a) => a.id == transaction?.category.id)
              .firstOrNull ??
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
      updateState((s) => s.copyWith(date: value));

  void updateNote(String value) => updateState((s) => s.copyWith(note: value));

  void setSelectedAccount(Account? account) =>
      updateState((s) => s.copyWith(selectedAccount: account));

  void setSelectedCategory(Category? category) =>
      updateState((s) => s.copyWith(selectedCategory: category));

  void updateTags(List<String> tags) =>
      updateState((s) => s.copyWith(tags: tags));

  bool validatePurchase() {
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
    if (!validatePurchase()) {
      return;
    }

    await handleAsync(() async {
      final state = formState;
      await _transactionRepository.modify(
        ModifyTransaction(
          id: state.id,
          amount: state.amount,
          description: state.note,
          accountId: state.selectedAccount!.id,
          categoryId: state.selectedCategory!.id,
          tags: state.tags.toList(),
          date: state.date,
        ),
      );
    });
  }
}
