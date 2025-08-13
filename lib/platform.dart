import 'package:universal_platform/universal_platform.dart';

class Platform {
  Platform._();

  static bool get isCupertino => UniversalPlatform.isApple;

  static bool get isMobile => UniversalPlatform.isMobile;
}
