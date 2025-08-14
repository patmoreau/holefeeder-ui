import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/platform.dart';

// ignore_for_file: non_constant_identifier_names

@staticIconProvider
abstract final class AdaptiveIcons {
  static IconData home =
      Platform.isCupertino ? CupertinoIcons.home : Icons.home;

  static IconData home_outlined =
      Platform.isCupertino ? CupertinoIcons.home : Icons.home_outlined;

  static IconData cancel =
      Platform.isCupertino ? CupertinoIcons.xmark_circle : Icons.cancel;

  static IconData cashflow =
      Platform.isCupertino ? CupertinoIcons.money_dollar : Icons.money;

  static IconData category =
      Platform.isCupertino
          ? CupertinoIcons.archivebox
          : Icons.category_outlined;

  static IconData delete =
      Platform.isCupertino ? CupertinoIcons.delete : Icons.delete;

  static IconData person =
      Platform.isCupertino ? CupertinoIcons.person : Icons.person;

  static IconData purchase =
      Platform.isCupertino
          ? CupertinoIcons.cart_badge_plus
          : Icons.shopping_cart_checkout_rounded;

  static IconData add_purchase =
      Platform.isCupertino
          ? CupertinoIcons.add_circled
          : Icons.add_circle_outline;

  static IconData star =
      Platform.isCupertino ? CupertinoIcons.star_fill : Icons.star;

  static IconData weekly = Icons.calendar_view_week_outlined;

  static IconData monthly = Icons.calendar_view_month_outlined;

  static IconData yearly = Icons.calendar_today_outlined;

  static IconData one_time = Icons.calendar_view_day_outlined;
}
