import 'dart:async';

import 'package:decimal/decimal.dart';
import 'package:holefeeder/core/models.dart';
import 'package:holefeeder/core/repositories.dart';
import 'package:holefeeder/core/view_models/base_form_state.dart';
import 'package:holefeeder/core/view_models/base_view_model.dart';

import 'transaction_form_state.dart';

class TransactionViewModel extends BaseViewModel<TransactionFormState> {
  final TransactionRepository _repository;

  TransactionViewModel({
    required Transaction transaction,
    required TransactionRepository repository,
    required super.notificationService,
  }) : _repository = repository,
       super(formState: TransactionFormState(transaction: transaction)) {
    loadData();
  }

  String get id => formState.transaction.id;

  String get description =>
      formState.transaction.description.isNotEmpty
          ? formState.transaction.description
          : formState.transaction.category.name;

  DateTime get date => formState.transaction.date;

  Decimal get amount => formState.transaction.amount;

  Future<void> loadData() async {
    await handleAsync(() async {
      final transaction = await _repository.get(formState.transaction.id);
      updateState(
        (s) => s.copyWith(transaction: transaction, state: ViewFormState.ready),
      );
    });
  }

  Future<void> delete() async {
    await handleAsync(() async {
      await _repository.delete(formState.transaction);
      updateState((s) => s.copyWith(state: ViewFormState.ready));
    });
  }
}
