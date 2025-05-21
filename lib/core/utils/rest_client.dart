import 'package:dio/dio.dart';
import 'package:holefeeder/core/models/account.dart';
import 'package:holefeeder/core/models/category.dart';
import 'package:holefeeder/core/models/make_purchase.dart';
import 'package:holefeeder/core/models/store_item.dart';
import 'package:holefeeder/core/models/tag.dart';
import 'package:holefeeder/core/models/upcoming.dart';
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

  @POST('api/v2/transactions/make-purchase')
  Future<HttpResponse<String>> makePurchase(@Body() MakePurchase command);
}
