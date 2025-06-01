import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:universal_platform/universal_platform.dart';

// ignore_for_file: non_constant_identifier_names

@staticIconProvider
abstract final class AdaptiveIcons {
  static IconData home =
      UniversalPlatform.isApple ? CupertinoIcons.home : Icons.home;

  static IconData home_outlined =
      UniversalPlatform.isApple ? CupertinoIcons.home : Icons.home_outlined;

  static IconData category =
      UniversalPlatform.isApple
          ? CupertinoIcons.archivebox
          : Icons.category_outlined;

  static IconData person =
      UniversalPlatform.isApple ? CupertinoIcons.person : Icons.person;

  static IconData purchase =
      UniversalPlatform.isApple
          ? CupertinoIcons.cart_badge_plus
          : Icons.shopping_cart_checkout_rounded;

  static IconData add_purchase =
      UniversalPlatform.isApple
          ? CupertinoIcons.add_circled
          : Icons.add_circle_outline;

  static IconData star =
      UniversalPlatform.isApple ? CupertinoIcons.star_fill : Icons.star;
}
