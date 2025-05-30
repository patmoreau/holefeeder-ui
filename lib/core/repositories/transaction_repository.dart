import 'dart:developer' as developer;

import 'package:holefeeder/core/constants/constants.dart';
import 'package:holefeeder/core/events/events.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/providers/providers.dart';
import 'package:holefeeder/core/repositories/repositories.dart';

class TransactionRepository
    with RepositoryInitializer
    implements BaseRepository<Transaction> {
  final String boxName = HiveConstants.transactionsBoxName;
  final HiveStorageProvider _hiveService;
  final DataProvider _dataProvider;

  TransactionRepository({
    required HiveStorageProvider hiveService,
    required DataProvider dataProvider,
  }) : _hiveService = hiveService,
       _dataProvider = dataProvider;

  @override
  Future<void> initialize() async {}

  @override
  Future<Transaction> get(String key) async {
    try {
      await ensureInitialized();
      return await _hiveService.get<Transaction>(boxName, key) ??
          Transaction.empty;
    } catch (e) {
      developer.log('Error getting transaction cashflow: $e');
      return Transaction.empty;
    }
  }

  @override
  Future<void> save(String key, Transaction value) async {
    throw Exception('Not implemented');
  }

  @override
  Future<void> delete(String key) async {
    throw Exception('Not implemented');
  }

  @override
  Future<bool> exists(String key) async {
    throw Exception('Not implemented');
  }

  @override
  Future<Transaction> refresh(String key) async {
    throw Exception('Not implemented');
  }

  @override
  Future<void> dispose() async {
    await _hiveService.closeBox<Transaction>(HiveConstants.transactionsBoxName);
  }

  Future<void> makePurchase(String key, MakePurchase value) async {
    try {
      await _dataProvider.makePurchase(value);
      await _getAllFromApi(value.accountId);
      developer.log(
        'TransactionRepository: Firing TransactionAddedEvent for accountId: ${value.accountId}',
      );
      EventBus().fire(TransactionAddedEvent(value.accountId));
    } catch (e) {
      developer.log('Error saving transaction: $e');
      throw Exception('Failed to save transaction');
    }
  }

  Future<List<Transaction>> getForAccount(String accountId) async {
    try {
      await ensureInitialized();
      final transactions =
          (await _hiveService.getAll<Transaction>(boxName))
              .where((transaction) => transaction.account.id == accountId)
              .toList();

      if (transactions.isEmpty) {
        return _getAllFromApi(accountId);
      }

      return transactions.cast<Transaction>().toList();
    } catch (e) {
      developer.log('Error fetching transactions: $e');
      return [];
    }
  }

  Future<List<Transaction>> _getAllFromApi(String accountId) async {
    try {
      final items = await _dataProvider.getTransactionsForAccount(
        0,
        100,
        accountId,
      );

      await _hiveService.clearall<Transaction>(boxName);

      for (var item in items) {
        await _hiveService.save<Transaction>(boxName, item.id, item);
      }

      return items;
    } catch (e) {
      developer.log('Error refreshing transactions from API: $e');
      return [];
    }
  }
}
