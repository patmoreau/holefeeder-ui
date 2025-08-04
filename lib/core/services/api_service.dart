import '../models/models.dart';

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
