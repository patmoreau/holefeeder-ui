import 'package:holefeeder/core/enums/date_interval_type_enum.dart';
import 'package:holefeeder/core/models/account.dart';
import 'package:holefeeder/core/models/category.dart';
import 'package:holefeeder/core/models/make_purchase.dart';
import 'package:holefeeder/core/models/tag.dart';
import 'package:holefeeder/core/models/user_settings.dart';
import 'package:holefeeder/core/utils/rest_client.dart';
import 'dart:convert';

import '../models/upcoming.dart';

abstract class DataProvider {
  // Accounts
  Future<List<Account>> getAccounts();

  Future<Account> getAccount(String id);

  // Cashflows
  Future<List<Upcoming>> getUpcomingCashflows(
    DateTime from,
    DateTime to,
    String? accountId,
  );

  // Categories
  Future<List<Category>> getCategories();

  Future<Category> getCategory(String id);

  // User Settings
  Future<UserSettings> getUserSettings();

  // Tags
  Future<List<Tag>> getTags();

  // Transactions
  Future<String?> makePurchase(MakePurchase item);
}

class DataProviderImpl implements DataProvider {
  final RestClient _restClient;

  const DataProviderImpl(this._restClient);

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
      throw Exception('Could not get the store item');
    } catch (e) {
      throw Exception('Could not get the store item');
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
}
