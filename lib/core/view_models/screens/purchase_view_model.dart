import 'package:decimal/decimal.dart';
import 'package:holefeeder/core/enums/date_interval_type_enum.dart';
import 'package:holefeeder/core/models/account.dart';
import 'package:holefeeder/core/models/category.dart';
import 'package:holefeeder/core/models/make_purchase.dart';
import 'package:holefeeder/core/providers/data_provider.dart';
import 'package:holefeeder/core/services/notification_service.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';
import 'package:holefeeder/core/view_models/base_view_model.dart';

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

class PurchaseViewModel extends BaseViewModel<PurchaseFormState> {
  final DataProvider _dataProvider;

  List<Account> get accounts => formState.accounts;
  List<Category> get categories => formState.categories;
  List<String> get tags => formState.availableTags;

  PurchaseViewModel({
    required DataProvider dataProvider,
    NotificationService? notificationService,
  }) : _dataProvider = dataProvider,
       super(PurchaseFormState(), notificationService) {
    loadInitialData();
  }

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
          selectedAccount: accounts.firstOrNull,
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

      await showNotification('Purchase completed successfully');
    });
  }
}
