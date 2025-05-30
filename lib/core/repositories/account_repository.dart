import 'dart:async';
import 'dart:developer' as developer;

import 'package:holefeeder/core/constants/hive_constants.dart';
import 'package:holefeeder/core/events/events.dart';
import 'package:holefeeder/core/models/account.dart';
import 'package:holefeeder/core/providers/data_provider.dart';
import 'package:holefeeder/core/providers/hive_storage_provider.dart';
import 'package:holefeeder/core/repositories/base_repository.dart';

class AccountRepository
    with RepositoryInitializer
    implements BaseRepository<Account> {
  final String boxName = HiveConstants.accountsBoxName;
  final HiveStorageProvider _hiveService;
  final DataProvider _dataProvider;
  late final StreamSubscription _transactionAddedSubscription;

  AccountRepository({
    required HiveStorageProvider hiveService,
    required DataProvider dataProvider,
  }) : _hiveService = hiveService,
       _dataProvider = dataProvider {
    _transactionAddedSubscription = EventBus()
        .on<TransactionAddedEvent>()
        .listen(_handleTransactionAdded);
  }

  Future<void> _handleTransactionAdded(TransactionAddedEvent event) async {
    developer.log('AccountRepository: Handling transaction added event');
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
      developer.log('Error getting individual account: $e');
      return Account.empty;
    }
  }

  Future<List<Account>> getAll() async {
    try {
      await ensureInitialized();
      final accounts = await _hiveService.getAll<Account>(boxName);

      if (accounts.isNotEmpty) {
        final sortedAccounts = accounts.cast<Account>().toList();
        sortedAccounts.sort((a, b) {
          if (a.favorite != b.favorite) {
            return b.favorite ? 1 : -1;
          }
          return a.name.compareTo(b.name);
        });
        return sortedAccounts;
      }

      return await _getAllFromApi();
    } catch (e) {
      developer.log('Error fetching accounts: $e');
      return [];
    }
  }

  @override
  Future<void> save(String key, Account value) async {
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
  Future<Account> refresh(String key) async {
    try {
      final account = await _dataProvider.getAccount(key);
      await _hiveService.save<Account>(boxName, key, account);
      return account;
    } catch (e) {
      developer.log('Error refreshing account from API: $e');
      return Account.empty;
    }
  }

  Future<List<Account>> _getAllFromApi() async {
    try {
      final apiAccounts = await _dataProvider.getAccounts();

      await _hiveService.clearall<Account>(boxName);

      for (var account in apiAccounts) {
        await _hiveService.save<Account>(boxName, account.id, account);
      }

      return apiAccounts;
    } catch (e) {
      developer.log('Error refreshing accounts from API: $e');
      return [];
    }
  }

  // Helper methods for fetching specific account types
  Future<List<Account>> getActiveAccounts() async {
    final allAccounts = await getAll();
    return allAccounts.where((account) => !account.inactive).toList();
  }

  Future<List<Account>> getFavoriteAccounts() async {
    final allAccounts = await getAll();
    return allAccounts.where((account) => account.favorite).toList();
  }

  @override
  Future<void> dispose() async {
    _transactionAddedSubscription.cancel();
    await _hiveService.closeBox<Account>(HiveConstants.accountsBoxName);
  }
}
