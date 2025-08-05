import 'dart:async';
import 'dart:developer' as developer;

import 'package:holefeeder/core/constants/hive_constants.dart';
import 'package:holefeeder/core/events/events.dart';
import 'package:holefeeder/core/models/account.dart';
import 'package:holefeeder/core/repositories/base_repository.dart';

import '../services/services.dart';

abstract class AccountRepository extends BaseRepository<Account> {
  Future<List<Account>> getActiveAccounts();

  Future<List<Account>> getFavoriteAccounts();
}

class AccountRepositoryImpl
    with RepositoryInitializer
    implements AccountRepository {
  final String boxName = HiveConstants.kAccountsBoxName;
  final HiveService _hiveService;
  final ApiService _dataProvider;
  late final StreamSubscription _transactionAddedSubscription;
  late final StreamSubscription _transactionDeletedSubscription;

  AccountRepositoryImpl({
    required HiveService hiveService,
    required ApiService dataProvider,
  }) : _hiveService = hiveService,
       _dataProvider = dataProvider {
    _transactionAddedSubscription = EventBus()
        .on<TransactionAddedEvent>()
        .listen((event) => unawaited(_handleTransactionAdded(event)));
    _transactionDeletedSubscription = EventBus()
        .on<TransactionDeletedEvent>()
        .listen((event) => unawaited(_handleTransactionDeleted(event)));
  }

  Future<void> _handleTransactionAdded(TransactionAddedEvent event) async {
    developer.log(
      'Handling transaction added event',
      name: 'AccountRepository',
    );
    final account = await refresh(event.accountId);
    EventBus().fire<AccountRefreshedEvent>(
      AccountRefreshedEvent(event.accountId, account),
    );
  }

  Future<void> _handleTransactionDeleted(TransactionDeletedEvent event) async {
    developer.log(
      'Handling transaction deleted event',
      name: 'AccountRepository',
    );
    final account = await refresh(event.accountId);
    EventBus().fire<AccountRefreshedEvent>(
      AccountRefreshedEvent(event.accountId, account),
    );
  }

  @override
  Future<void> initialize() async {
    await _getAllFromApi();
  }

  @override
  Future<Account> get(String key) async {
    try {
      await ensureInitialized();
      return await _hiveService.get<Account>(boxName, key) ?? Account.empty;
    } catch (e) {
      _logError('getting individual account', e);
      return Account.empty;
    }
  }

  @override
  Future<List<Account>> getAll() async {
    try {
      await ensureInitialized();
      final accounts = await _hiveService.getAll<Account>(boxName);

      if (accounts.isNotEmpty) {
        return _sort(accounts.cast<Account>().toList());
      }

      return await _getAllFromApi();
    } catch (e) {
      _logError('fetching accounts', e);
      return [];
    }
  }

  @override
  Future<void> save(Account value) async {
    try {
      await ensureInitialized();
      // Assuming _dataProvider has a method to save accounts
      // await _dataProvider.saveAccount(value);
      await _hiveService.save<Account>(boxName, value.key, value);
      EventBus().fire<AccountRefreshedEvent>(
        AccountRefreshedEvent(value.key, value),
      );
    } catch (e) {
      _logError('saving account', e);
      throw Exception('Failed to save account: $e');
    }
  }

  @override
  Future<void> delete(dynamic keyOrValue) async {
    try {
      await ensureInitialized();

      final String key = keyOrValue is String ? keyOrValue : keyOrValue.key;
      // final String apiId = keyOrValue is Account ? keyOrValue.id : key;

      // await _dataProvider.deleteAccount(apiId);

      await _hiveService.delete<Account>(boxName, key);

      // Fire event with the key that was deleted
      // EventBus().fire<AccountDeletedEvent>(AccountDeletedEvent(key));
    } catch (e) {
      _logError('deleting account', e);
      throw Exception('Failed to delete account: $e');
    }
  }

  @override
  Future<bool> exists(String key) async {
    try {
      await ensureInitialized();
      return await _hiveService.exists<Account>(boxName, key);
    } catch (e) {
      _logError('checking if account exists', e);
      throw Exception('Failed to check if account exists: $e');
    }
  }

  @override
  Future<Account> refresh(dynamic keyOrValue) async {
    try {
      final String key = keyOrValue is String ? keyOrValue : keyOrValue.key;
      final String apiId = keyOrValue is Account ? keyOrValue.id : key;

      final account = await _dataProvider.getAccount(apiId);

      await _hiveService.save<Account>(boxName, account.key, account);
      return account;
    } catch (e) {
      _logError('refreshing account from API', e);
      return Account.empty;
    }
  }

  @override
  Future<void> refreshAll() async {
    try {
      await _hiveService.clearall<Account>(boxName);
      await _getAllFromApi();
    } catch (e) {
      _logError('refreshing all accounts', e);
    }
  }

  @override
  Future<void> dispose() async {
    await _transactionAddedSubscription.cancel();
    await _transactionDeletedSubscription.cancel();
  }

  @override
  Future<void> clearData() async {
    try {
      await _hiveService.clearall(boxName);
      await initialize();
    } catch (e) {
      _logError('clearing account data', e);
      throw Exception('Failed to clear account data: $e');
    }
  }

  List<Account> _sort(List<Account> items) {
    items.sort((a, b) {
      if (a.favorite != b.favorite) {
        return b.favorite ? 1 : -1;
      }
      return a.name.compareTo(b.name);
    });
    return items;
  }

  Future<List<Account>> _getFilteredAccounts(
    bool Function(Account) predicate,
  ) async {
    final allAccounts = await getAll();
    return allAccounts.where(predicate).toList();
  }

  @override
  Future<List<Account>> getActiveAccounts() async {
    return _getFilteredAccounts((account) => !account.inactive);
  }

  @override
  Future<List<Account>> getFavoriteAccounts() async {
    return _getFilteredAccounts((account) => account.favorite);
  }

  Future<List<Account>> _getAllFromApi() async {
    try {
      final apiAccounts = await _dataProvider.getAccounts();

      for (var account in apiAccounts) {
        await _hiveService.save<Account>(boxName, account.key, account);
      }

      return _sort(apiAccounts);
    } catch (e) {
      _logError('refreshing accounts from API', e);
      return [];
    }
  }

  void _logError(String operation, dynamic error) {
    developer.log(
      'Error when $operation: $error',
      name: 'AccountRepository',
      error: error,
    );
  }
}
