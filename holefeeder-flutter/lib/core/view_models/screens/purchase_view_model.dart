import 'dart:developer' as developer;

import 'package:decimal/decimal.dart';
import 'package:holefeeder/core/enums/date_interval_type_enum.dart';
import 'package:holefeeder/core/events.dart';
import 'package:holefeeder/core/models.dart';
import 'package:holefeeder/core/repositories.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';
import 'package:holefeeder/core/view_models/base_view_model.dart';

import 'purchase_form_state.dart';

class PurchaseViewModel extends BaseViewModel<PurchaseFormState> {
  final Account? _account;
  final TransactionRepository _transactionRepository;
  final AccountRepository _accountRepository;
  final CategoryRepository _categoryRepository;
  final TagRepository _tagRepository;

  PurchaseViewModel({
    Account? account,
    required TransactionRepository transactionRepository,
    required AccountRepository accountRepository,
    required CategoryRepository categoryRepository,
    required TagRepository tagRepository,
    required super.notificationService,
  }) : _account = account,
       _transactionRepository = transactionRepository,
       _accountRepository = accountRepository,
       _categoryRepository = categoryRepository,
       _tagRepository = tagRepository,
       super(formState: PurchaseFormState()) {
    loadInitialData();
  }

  List<Account> get accounts => formState.accounts;

  List<Category> get categories => formState.categories;

  List<String> get tags => formState.availableTags;

  Future<void> loadInitialData() async {
    await handleAsync(() async {
      // Load data with proper error handling and timeouts
      List<Account> accounts = [];
      List<Category> categories = [];
      List<String> availableTags = [];

      try {
        // Try to load accounts with timeout
        accounts = await _accountRepository.getActiveAccounts().timeout(
          const Duration(seconds: 10),
          onTimeout: () {
            developer.log('PurchaseViewModel: Account loading timed out');
            return _account != null ? [_account] : <Account>[];
          },
        );
        developer.log(
          'Loaded ${accounts.length} accounts',
          name: 'PurchaseViewModel',
        );
      } catch (e) {
        developer.log(
          'Failed to load accounts',
          name: 'PurchaseViewModel',
          error: e,
        );
        accounts = _account != null ? [_account] : <Account>[];
      }

      try {
        // Try to load categories with timeout
        categories = await _categoryRepository.getAll().timeout(
          const Duration(seconds: 10),
          onTimeout: () {
            developer.log(
              'Category loading timed out',
              name: 'PurchaseViewModel',
            );
            return <Category>[];
          },
        );
        developer.log(
          'Loaded ${categories.length} categories',
          name: 'PurchaseViewModel',
        );
      } catch (e) {
        developer.log(
          'Failed to load categories',
          name: 'PurchaseViewModel',
          error: e,
        );
        categories = <Category>[];
      }

      try {
        // Try to load tags with timeout
        final tags = await _tagRepository.getAll().timeout(
          const Duration(seconds: 10),
          onTimeout: () {
            developer.log('Tag loading timed out', name: 'PurchaseViewModel');
            return <Tag>[];
          },
        );
        availableTags = tags.map((t) => t.tag).toList();
        developer.log(
          'Loaded ${availableTags.length} tags',
          name: 'PurchaseViewModel',
        );
      } catch (e) {
        developer.log(
          'Failed to load tags',
          name: 'PurchaseViewModel',
          error: e,
        );
        availableTags = <String>[];
      }

      // Always update state, even with partial data
      updateState(
        (s) => s.copyWith(
          accounts: accounts,
          categories: categories,
          availableTags: availableTags,
          selectedFromAccount: _account ?? accounts.firstOrNull,
          selectedToAccount: _account ?? accounts.firstOrNull,
          selectedCategory: categories.firstOrNull,
          state: ViewFormState.ready,
        ),
      );
      developer.log('State updated successfully', name: 'PurchaseViewModel');
    });
  }

  void updateAmount(Decimal value) =>
      updateState((s) => s.copyWith(amount: value));

  void updateDate(DateTime value) =>
      updateState((s) => s.copyWith(date: value));

  void updateNote(String value) => updateState((s) => s.copyWith(note: value));

  void setSelectedFromAccount(Account? account) =>
      updateState((s) => s.copyWith(selectedFromAccount: account));

  void setSelectedToAccount(Account? account) =>
      updateState((s) => s.copyWith(selectedToAccount: account));

  void setSelectedCategory(Category? category) =>
      updateState((s) => s.copyWith(selectedCategory: category));

  void updateTags(List<String> tags) =>
      updateState((s) => s.copyWith(tags: tags));

  void updateIsCashflow(bool value) =>
      updateState((s) => s.copyWith(isCashflow: value));

  void updateEffectiveDate(DateTime value) =>
      updateState((s) => s.copyWith(effectiveDate: value));

  void updateIntervalType(DateIntervalType? value) {
    if (value != null) {
      updateState((s) => s.copyWith(intervalType: value));
    }
  }

  void updateFrequency(int value) =>
      updateState((s) => s.copyWith(frequency: value));

  void updateRecurrence(int value) =>
      updateState((s) => s.copyWith(recurrence: value));

  bool validatePurchase() {
    if (formState.amount <= Decimal.zero) {
      setFormError('Amount must be greater than zero');
      return false;
    }
    if (formState.selectedFromAccount == null) {
      setFormError('Please select an account');
      return false;
    }
    if (formState.selectedCategory == null) {
      setFormError('Please select a category');
      return false;
    }
    return true;
  }

  bool validateTransfer() {
    if (formState.amount <= Decimal.zero) {
      setFormError('Amount must be greater than zero');
      return false;
    }
    if (formState.selectedFromAccount == null) {
      setFormError('Please select an account from');
      return false;
    }
    if (formState.selectedToAccount == null) {
      setFormError('Please select an account to');
      return false;
    }
    if (formState.selectedFromAccount == formState.selectedToAccount) {
      setFormError('From and To accounts cannot be the same');
      return false;
    }
    return true;
  }

  Future<void> makePurchase() async {
    if (!validatePurchase()) {
      return;
    }

    await handleAsync(() async {
      final state = formState;
      await _transactionRepository.makePurchase(
        MakePurchase(
          amount: state.amount,
          description: state.note,
          accountId: state.selectedFromAccount!.id,
          categoryId: state.selectedCategory!.id,
          tags: state.tags.toList(),
          date: state.date,
          cashflow:
              state.isCashflow
                  ? CashflowRequest(
                    effectiveDate: state.effectiveDate,
                    intervalType: state.intervalType,
                    frequency: state.frequency,
                    recurrence: state.recurrence,
                  )
                  : null,
        ),
      );
      EventBus().fire(TransactionAddedEvent(state.selectedFromAccount!.id));
    });
  }

  Future<void> makeTransfer() async {
    if (!validateTransfer()) {
      return;
    }

    await handleAsync(() async {
      final state = formState;
      await _transactionRepository.transfer(
        Transfer(
          date: state.date,
          amount: state.amount,
          description: state.note,
          fromAccountId: state.selectedFromAccount!.id,
          toAccountId: state.selectedToAccount!.id,
        ),
      );
      EventBus().fire(TransactionAddedEvent(state.selectedFromAccount!.id));
    });
  }
}
