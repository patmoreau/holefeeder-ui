import 'package:decimal/decimal.dart';
import 'package:holefeeder/core/enums/date_interval_type_enum.dart';
import 'package:holefeeder/core/events/events.dart';
import 'package:holefeeder/core/models/account.dart';
import 'package:holefeeder/core/models/category.dart';
import 'package:holefeeder/core/models/make_purchase.dart';
import 'package:holefeeder/core/providers/data_provider.dart';

import '../base_form_state.dart';
import '../base_view_model.dart';
import 'purchase_form_state.dart';

class PurchaseViewModel extends BaseViewModel<PurchaseFormState> {
  final Account? _account;
  final DataProvider _dataProvider;

  PurchaseViewModel({
    Account? account,
    required DataProvider dataProvider,
    required super.notificationService,
  }) : _account = account,
       _dataProvider = dataProvider,
       super(formState: PurchaseFormState()) {
    loadInitialData();
  }

  List<Account> get accounts => formState.accounts;

  List<Category> get categories => formState.categories;

  List<String> get tags => formState.availableTags;

  Future<void> loadInitialData() async {
    await handleAsync(() async {
      final accounts = await _dataProvider.getAccounts();
      final categories = await _dataProvider.getCategories();
      final availableTags =
          (await _dataProvider.getTags()).map((t) => t.tag).toList();

      updateState(
        (s) => s.copyWith(
          accounts: accounts,
          categories: categories,
          availableTags: availableTags,
          selectedAccount: _account ?? accounts.firstOrNull,
          selectedCategory: categories.firstOrNull,
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

  bool validate() {
    if (formState.amount <= Decimal.zero) {
      setFormError('Amount must be greater than zero');
      return false;
    }
    if (formState.selectedAccount == null) {
      setFormError('Please select an account');
      return false;
    }
    if (formState.selectedCategory == null) {
      setFormError('Please select a category');
      return false;
    }
    return true;
  }

  Future<void> makePurchase() async {
    if (!validate()) {
      return;
    }

    await handleAsync(() async {
      final state = formState;
      await _dataProvider.makePurchase(
        MakePurchase(
          amount: state.amount,
          description: state.note,
          accountId: state.selectedAccount!.id,
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
      EventBus().fire(TransactionAddedEvent(state.selectedAccount!.id));
    });
  }
}
