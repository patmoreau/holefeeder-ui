import 'package:dio/dio.dart';
import 'package:holefeeder/app.dart';
import 'package:holefeeder/core/authentication.dart';
import 'package:holefeeder/core/enums.dart';
import 'package:intl/intl.dart';

class DioClient {
  static Dio? _instance;

  static Dio getInstance(AuthenticationClient authenticationClient) =>
      _instance ??= _createDio(authenticationClient);

  static Dio _createDio(AuthenticationClient authenticationClient) {
    final dio = Dio();
    final df = DateFormat('yyyy-MM-dd');

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          if (await authenticationClient.isTokenExpired()) {
            await authenticationClient.refreshToken();
            if (authenticationClient.currentStatus ==
                AuthenticationStatus.unauthenticated) {
              router.go('/login');
              return handler.reject(
                DioException(
                  requestOptions: options,
                  error: 'Authentication required',
                ),
              );
            }
          }
          if (authenticationClient.currentStatus ==
              AuthenticationStatus.authenticated) {
            final token = authenticationClient.credentials.accessToken;
            options.headers['Authorization'] = 'Bearer $token';
          }

          return handler.next(options);
        },
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          options.queryParameters = {
            for (var e in options.queryParameters.entries)
              e.key:
                  DateTime.tryParse(e.value.toString()) != null
                      ? df.format(DateTime.parse(e.value.toString()))
                      : e.value,
          };
          return handler.next(options);
        },
      ),
    );

    return dio;
  }
}
