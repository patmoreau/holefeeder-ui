import 'dart:convert';

import 'package:holefeeder/core/enums/enums.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:holefeeder/core/utils/utils.dart';

abstract class ApiService {
  // Accounts
  Future<List<Account>> getAccounts();

  Future<Account> getAccount(String id);

  // Cashflows
  Future<Cashflow> getCashflow(String id);

  Future<List<Cashflow>> getCashflows();

  Future<void> deleteCashflow(String id);

  Future<void> modifyCashflow(ModifyCashflow item);

  Future<List<Upcoming>> getUpcomingCashflows(
    DateTime from,
    DateTime to,
    String? accountId,
  );

  // Categories
  Future<List<Category>> getCategories();

  Future<Category> getCategory(String id);

  Future<DateInterval> computePeriod(DateTime asOfDate, int iteration);

  // User Settings
  Future<UserSettings> getUserSettings();

  Future<void> saveUserSettings(UserSettings settings);

  Future<void> deleteUserSettings();

  // Tags
  Future<List<Tag>> getTags();

  // Transactions
  Future<List<Transaction>> getTransactionsForAccount(
    int offset,
    int limit,
    String accountId,
  );

  Future<void> deleteTransaction(String id);

  Future<String?> makePurchase(MakePurchase item);

  Future<void> modifyTransaction(ModifyTransaction item);

  Future<String?> transfer(Transfer item);

  Future<String> payCashflow(PayCashflow item);
}

class ApiServiceImpl implements ApiService {
  final RestClient _restClient;

  const ApiServiceImpl(this._restClient);

  // Accounts
  @override
  Future<List<Account>> getAccounts() async {
    try {
      final result = await _restClient.getAccounts(
        ['-favorite', 'name'],
        ['inactive:eq:false'],
      );
      if (result.response.statusCode == 200) {
        return result.data;
      }
      throw Exception('Could not get the Accounts');
    } catch (e) {
      throw Exception('Could not get the Accounts');
    }
  }

  @override
  Future<Account> getAccount(String id) async {
    try {
      final result = await _restClient.getAccount(id);
      if (result.response.statusCode == 200) {
        return result.data;
      }
      if (result.response.statusCode == 404) {
        throw Exception('Account not found');
      }
      throw Exception('Could not get the account');
    } catch (e) {
      throw Exception('Could not get the account');
    }
  }

  // Cashflows

  @override
  Future<Cashflow> getCashflow(String id) async {
    try {
      final result = await _restClient.getCashflow(id);
      if (result.response.statusCode == 200) {
        return result.data;
      }
      if (result.response.statusCode == 404) {
        throw Exception('Cashflow not found');
      }
      throw Exception('Could not get the cashflow');
    } catch (e) {
      throw Exception('Could not get the cashflow - $e');
    }
  }

  @override
  Future<List<Cashflow>> getCashflows() async {
    try {
      final result = await _restClient.getCashflows(0, 1000, [], []);
      if (result.response.statusCode == 200) {
        return result.data;
      }
      throw Exception('Could not get the cashflows');
    } catch (e) {
      throw Exception('Could not get the cashflows');
    }
  }

  @override
  Future<void> deleteCashflow(String id) async {
    try {
      final result = await _restClient.deleteCashflow(id);
      if (result.response.statusCode != 204) {
        throw Exception('Could not delete cashflow with id: $id');
      }
    } catch (e) {
      throw Exception('Could not delete cashflow with id: $id - $e');
    }
  }

  @override
  Future<void> modifyCashflow(ModifyCashflow item) async {
    try {
      final result = await _restClient.modifyCashflow(item);
      if (result.response.statusCode == 204) {
        return;
      }
      throw Exception('Could not modify cashflow');
    } catch (e) {
      throw Exception('Could not modify cashflow - $e');
    }
  }

  @override
  Future<List<Upcoming>> getUpcomingCashflows(
    DateTime from,
    DateTime to,
    String? accountId,
  ) async {
    try {
      final result = await _restClient.getUpcomingCashflows(
        from,
        to,
        accountId,
      );
      if (result.response.statusCode == 200) {
        return result.data;
      }
      throw Exception('Could not get the upcoming cashflows');
    } catch (e) {
      throw Exception('Could not get the upcoming cashflows');
    }
  }

  // Categories
  @override
  Future<List<Category>> getCategories() async {
    try {
      final result = await _restClient.getCategories();
      if (result.response.statusCode == 200) {
        return result.data;
      }
      throw Exception('Could not get the categories');
    } catch (e) {
      throw Exception('Could not get the categories');
    }
  }

  @override
  Future<Category> getCategory(String id) async {
    try {
      final result = await _restClient.getCategory(id);
      if (result.response.statusCode == 200) {
        return result.data;
      }
      if (result.response.statusCode == 404) {
        throw Exception('Category not found');
      }
      throw Exception('Could not get the category');
    } catch (e) {
      throw Exception('Could not get the category');
    }
  }

  @override
  Future<DateInterval> computePeriod(DateTime asOfDate, int iteration) async {
    try {
      final result = await _restClient.computePeriod(asOfDate, iteration);
      if (result.response.statusCode == 200) {
        return result.data;
      }
      throw Exception('Could not compute the period');
    } catch (e) {
      throw Exception('Could not compute the period');
    }
  }

  // Store Items
  @override
  Future<UserSettings> getUserSettings() async {
    try {
      final result = await _restClient.getStoreItems(['code:eq:settings']);
      if (result.response.statusCode == 200) {
        return result.data.isNotEmpty
            ? UserSettings.fromJson(jsonDecode(result.data[0].data))
            : UserSettings(
              effectiveDate: DateTime.now(),
              intervalType: DateIntervalType.monthly,
              frequency: 1,
            );
      }
      throw Exception('Could not retrieve user settings');
    } catch (e) {
      throw Exception('Could not retrieve user settings');
    }
  }

  @override
  Future<void> saveUserSettings(UserSettings settings) async {
    try {
      final storeItems = await _restClient.getStoreItems(['code:eq:settings']);
      String storeItemId = "";

      if (storeItems.data.isNotEmpty) {
        storeItemId = storeItems.data[0].id;
      }

      final updatedStoreItem = StoreItem(
        id: storeItemId,
        code: 'settings',
        data: jsonEncode(settings.toJson()),
      );

      final result = await _restClient.saveStoreItem(updatedStoreItem);
      if (result.response.statusCode != 200 &&
          result.response.statusCode != 201) {
        throw Exception('Could not save user settings');
      }
    } catch (e) {
      throw Exception('Could not save user settings: $e');
    }
  }

  @override
  Future<void> deleteUserSettings() async {
    try {
      final storeItems = await _restClient.getStoreItems(['code:eq:settings']);
      if (storeItems.data.isNotEmpty) {
        final result = await _restClient.deleteStoreItem(storeItems.data[0].id);
        if (result.response.statusCode != 200 &&
            result.response.statusCode != 204) {
          throw Exception('Could not delete user settings');
        }
      }
    } catch (e) {
      throw Exception('Could not delete user settings: $e');
    }
  }

  // Tags
  @override
  Future<List<Tag>> getTags() async {
    try {
      final result = await _restClient.getTags();
      if (result.response.statusCode == 200) {
        return result.data;
      }
      throw Exception('Could not get tags');
    } catch (e) {
      throw Exception('Could not get tags');
    }
  }

  // Transactions
  @override
  Future<List<Transaction>> getTransactionsForAccount(
    int offset,
    int limit,
    String accountId,
  ) async {
    try {
      final result = await _restClient.getTransactions(
        offset,
        limit,
        ["-date"],
        ["AccountId:eq:$accountId"],
      );
      if (result.response.statusCode == 200) {
        return result.data;
      }
      throw Exception('Could not get the transactions for the account');
    } catch (e) {
      throw Exception('Could not get the transactions for the account');
    }
  }

  @override
  Future<void> deleteTransaction(String id) async {
    try {
      final result = await _restClient.deleteTransaction(id);
      if (result.response.statusCode != 204) {
        throw Exception('Could not delete transaction with id: $id');
      }
    } catch (e) {
      throw Exception('Could not delete transaction with id: $id - $e');
    }
  }

  @override
  Future<String?> makePurchase(MakePurchase item) async {
    try {
      final result = await _restClient.makePurchase(item);
      if (result.response.statusCode == 201) {
        return result.data;
      }
      throw Exception('Could not make the purchase');
    } catch (e) {
      throw Exception('Could not make the purchase');
    }
  }

  @override
  Future<void> modifyTransaction(ModifyTransaction item) async {
    try {
      final result = await _restClient.modifyTransaction(item);
      if (result.response.statusCode == 204) {
        return;
      }
      throw Exception('Could not modify transaction');
    } catch (e) {
      throw Exception('Could not modify transaction - $e');
    }
  }

  @override
  Future<String?> transfer(Transfer item) async {
    try {
      final result = await _restClient.transfer(item);
      if (result.response.statusCode == 201) {
        return result.data;
      }
      throw Exception('Could not make the transfer');
    } catch (e) {
      throw Exception('Could not make the transfer');
    }
  }

  @override
  Future<String> payCashflow(PayCashflow item) async {
    try {
      final result = await _restClient.payCashflow(item);
      if (result.response.statusCode == 201) {
        return result.data;
      }
      throw Exception('Could not pay the cashflow');
    } catch (e) {
      throw Exception('Could not pay the cashflow');
    }
  }
}
