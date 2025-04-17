import 'package:holefeeder/core/models/account.dart';
import 'package:holefeeder/core/models/category.dart';
import 'package:holefeeder/core/models/make_purchase.dart';
import 'package:holefeeder/core/models/tag.dart';
import 'package:holefeeder/core/utils/rest_client.dart';

abstract class DataProvider {
  Future<List<Account>> getAccounts();

  Future<Account> getAccount(String id);

  Future<List<Category>> getCategories();

  Future<Category> getCategory(String id);

  Future<List<Tag>> getTags();

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
