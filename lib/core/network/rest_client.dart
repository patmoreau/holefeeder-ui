import 'package:dio/dio.dart';
import 'package:holefeeder/core/models/models.dart';
import 'package:retrofit/retrofit.dart';

part 'rest_client.g.dart';

@RestApi()
abstract class RestClient {
  factory RestClient(Dio dio, {String baseUrl, ParseErrorLogger? errorLogger}) =
      _RestClient;

  @GET('api/v2/accounts')
  Future<HttpResponse<List<Account>>> getAccounts(
    @Query('sort') List<String> sort,
    @Query('filter') List<String> filter,
  );

  @GET('api/v2/accounts/{id}')
  Future<HttpResponse<Account>> getAccount(@Path('id') String id);

  @GET('api/v2/cashflows/{id}')
  Future<HttpResponse<Cashflow>> getCashflow(@Path('id') String id);

  @GET('api/v2/cashflows')
  Future<HttpResponse<List<Cashflow>>> getCashflows(
    @Query('offset') int offset,
    @Query('limit') int limit,
    @Query('sort') List<String> sort,
    @Query('filter') List<String> filter,
  );

  @DELETE('api/v2/cashflows/{id}')
  Future<HttpResponse<void>> deleteCashflow(@Path('id') String id);

  @POST('api/v2/cashflows/modify')
  Future<HttpResponse<void>> modifyCashflow(@Body() ModifyCashflow command);

  @GET('api/v2/cashflows/get-upcoming')
  Future<HttpResponse<List<Upcoming>>> getUpcomingCashflows(
    @Query('from') DateTime from,
    @Query('to') DateTime to,
    @Query('accountId') String? accountId,
  );

  @GET('api/v2/categories')
  Future<HttpResponse<List<Category>>> getCategories();

  @GET('api/v2/categories/{id}')
  Future<HttpResponse<Category>> getCategory(@Path('id') String id);

  @GET('api/v2/store-items')
  Future<HttpResponse<List<StoreItem>>> getStoreItems(
    @Query('filter') List<String> filter,
  );

  @POST('api/v2/store-items')
  Future<HttpResponse<String>> saveStoreItem(@Body() StoreItem item);

  @DELETE('api/v2/store-items/{id}')
  Future<HttpResponse<void>> deleteStoreItem(@Path('id') String id);

  @GET('api/v2/tags')
  Future<HttpResponse<List<Tag>>> getTags();

  @GET('api/v2/transactions')
  Future<HttpResponse<List<Transaction>>> getTransactions(
    @Query('offset') int offset,
    @Query('limit') int limit,
    @Query('sort') List<String> sort,
    @Query('filter') List<String> filter,
  );

  @DELETE('api/v2/transactions/{id}')
  Future<HttpResponse<void>> deleteTransaction(@Path('id') String id);

  @POST('api/v2/transactions/make-purchase')
  Future<HttpResponse<String>> makePurchase(@Body() MakePurchase command);

  @POST('api/v2/transactions/modify')
  Future<HttpResponse<void>> modifyTransaction(
    @Body() ModifyTransaction command,
  );

  @POST('api/v2/transactions/transfer')
  Future<HttpResponse<String>> transfer(@Body() Transfer command);

  @POST('api/v2/transactions/pay-cashflow')
  Future<HttpResponse<String>> payCashflow(@Body() PayCashflow command);
}
