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
  Future<void> initialize() async {
    // No-op initialization - transactions are loaded on-demand per account
  }

  @override
  Future<Transaction> get(String key) async {
    try {
      await ensureInitialized();
      return await _hiveService.get<Transaction>(boxName, key) ??
          Transaction.empty;
    } catch (e) {
      _logError('getting individual transaction', e);
      return Transaction.empty;
    }
  }

  @override
  Future<List<Transaction>> getAll() async {
    try {
      await ensureInitialized();
      final transactions = await _hiveService.getAll<Transaction>(boxName);

      if (transactions.isNotEmpty) {
        return _sortByDate(transactions.cast<Transaction>().toList());
      }

      // Since transactions are per-account, we might not want to load all transactions
      // from all accounts here. Return empty list instead.
      return [];
    } catch (e) {
      _logError('fetching all transactions', e);
      return [];
    }
  }

  @override
  Future<void> save(Transaction value) async {
    try {
      await ensureInitialized();

      // Assuming _dataProvider has a method to save transactions
      // await _dataProvider.saveTransaction(value);

      await _hiveService.save<Transaction>(boxName, value.id, value);

      EventBus().fire<TransactionAddedEvent>(
        TransactionAddedEvent(value.account.id),
      );
    } catch (e) {
      _logError('saving transaction', e);
      throw Exception('Failed to save transaction: $e');
    }
  }

  @override
  Future<void> delete(dynamic keyOrValue) async {
    try {
      await ensureInitialized();

      // Extract the key based on whether we received a string key or a Transaction object
      final String key = keyOrValue is String ? keyOrValue : keyOrValue.id;
      final String apiId = keyOrValue is Transaction ? keyOrValue.id : key;

      final transaction = await _hiveService.get<Transaction>(boxName, key);

      // For API operations, use the key as the transaction ID
      await _dataProvider.deleteTransaction(apiId);

      // For local storage operations, use the key
      await _hiveService.delete<Transaction>(boxName, key);

      // Fire event if we know the account ID
      if (transaction != null && transaction.account.id.isNotEmpty) {
        EventBus().fire<TransactionDeletedEvent>(
          TransactionDeletedEvent(transaction.account.id),
        );
      }
    } catch (e) {
      _logError('deleting transaction', e);
      throw Exception('Failed to delete transaction: $e');
    }
  }

  @override
  Future<bool> exists(String key) async {
    try {
      await ensureInitialized();
      return await _hiveService.exists<Transaction>(boxName, key);
    } catch (e) {
      _logError('checking if transaction exists', e);
      throw Exception('Failed to check if transaction exists: $e');
    }
  }

  @override
  Future<Transaction> refresh(dynamic keyOrValue) async {
    try {
      // final String key = keyOrValue is String ? keyOrValue : keyOrValue.id;

      // Get the transaction from the API
      // final transaction = await _dataProvider.getTransaction(key);

      // Save to local storage
      // await _hiveService.save<Transaction>(boxName, transaction.id, transaction);

      return Transaction.empty;
    } catch (e) {
      _logError('refreshing transaction from API', e);
      return Transaction.empty;
    }
  }

  @override
  Future<void> refreshAll() async {
    try {
      // Since transactions are normally fetched per account,
      // this method might not be very efficient for transactions
      // Consider implementing a more targeted approach if needed
      await _hiveService.clearall<Transaction>(boxName);
    } catch (e) {
      _logError('refreshing all transactions', e);
    }
  }

  @override
  Future<void> dispose() async {
    await _hiveService.closeBox<Transaction>(boxName);
  }

  @override
  Future<void> clearData() async {
    try {
      await _hiveService.resetBox<Transaction>(boxName);
      await initialize();
    } catch (e) {
      _logError('clearing transaction data', e);
      throw Exception('Failed to clear transaction data: $e');
    }
  }

  Future<void> makePurchase(MakePurchase value) async {
    try {
      await _dataProvider.makePurchase(value);
      await _getAllFromApi(value.accountId);
      developer.log(
        'TransactionRepository: Firing TransactionAddedEvent for accountId: ${value.accountId}',
      );
      EventBus().fire(TransactionAddedEvent(value.accountId));
    } catch (e) {
      _logError('saving transaction purchase', e);
      throw Exception('Failed to save transaction');
    }
  }

  Future<void> modify(ModifyTransaction value) async {
    try {
      await ensureInitialized();

      await _dataProvider.modifyTransaction(value);

      EventBus().fire<TransactionAddedEvent>(
        TransactionAddedEvent(value.accountId),
      );
    } catch (e) {
      _logError('saving transaction', e);
      throw Exception('Failed to save transaction: $e');
    }
  }

  Future<void> transfer(Transfer value) async {
    try {
      await _dataProvider.transfer(value);
      await _getAllFromApi(value.fromAccountId);
      developer.log(
        'TransactionRepository: Firing TransactionAddedEvent for accountId: ${value.fromAccountId}',
      );
      EventBus().fire(TransactionAddedEvent(value.fromAccountId));
      EventBus().fire(TransactionAddedEvent(value.toAccountId));
    } catch (e) {
      _logError('failed to make transfer', e);
      throw Exception('Failed to make transfer');
    }
  }

  Future<List<Transaction>> getForAccount(
    String accountId, {
    bool force = false,
  }) async {
    try {
      await ensureInitialized();
      if (force) {
        return _getAllFromApi(accountId);
      }
      final transactions =
          (await _hiveService.getAll<Transaction>(boxName))
              .where((transaction) => transaction.account.id == accountId)
              .toList();

      if (transactions.isEmpty) {
        return _getAllFromApi(accountId);
      }

      return _sortByDate(transactions.cast<Transaction>().toList());
    } catch (e) {
      _logError('fetching transactions for account', e);
      return [];
    }
  }

  List<Transaction> _sortByDate(List<Transaction> items) {
    items.sort((a, b) => b.date.compareTo(a.date));
    return items;
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
        await _hiveService.save<Transaction>(boxName, item.key, item);
      }

      return _sortByDate(items);
    } catch (e) {
      _logError('refreshing transactions from API', e);
      return [];
    }
  }

  void _logError(String operation, dynamic error) {
    developer.log('TransactionRepository error when $operation: $error');
  }
}
