import 'package:holefeeder/core/constants/hive_constants.dart';
import 'package:holefeeder/core/models/account.dart';
import 'package:holefeeder/core/providers/data_provider.dart';
import 'package:holefeeder/core/repositories/base_repository.dart';
import 'package:holefeeder/core/providers/hive_storage_provider.dart';

class AccountRepository
    with RepositoryInitializer
    implements BaseRepository<Account> {
  final String boxName = HiveConstants.accountsBoxName;
  final HiveStorageProvider _hiveService;
  final DataProvider _dataProvider;

  AccountRepository({
    required HiveStorageProvider hiveService,
    required DataProvider dataProvider,
  }) : _hiveService = hiveService,
       _dataProvider = dataProvider;

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
      print('Error getting individual account: $e');
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
      print('Error fetching accounts: $e');
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
    throw Exception('Not implemented');
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
      print('Error refreshing accounts from API: $e');
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
    await _hiveService.closeBox<Account>(HiveConstants.accountsBoxName);
  }
}
