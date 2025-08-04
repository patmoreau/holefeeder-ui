import 'package:flutter/cupertino.dart';

const holefeederCupertinoThemeData = CupertinoThemeData(
  brightness: Brightness.light,
  primaryColor: CupertinoColors.activeOrange,
  scaffoldBackgroundColor: CupertinoColors.systemGroupedBackground,
  barBackgroundColor: CupertinoColors.systemBackground,
  textTheme: CupertinoTextThemeData(
    textStyle: TextStyle(
      fontFamily: '.SF Pro Text',
      fontSize: 16,
      color: CupertinoColors.label,
    ),
    actionTextStyle: TextStyle(
      fontFamily: '.SF Pro Text',
      fontSize: 17,
      color: CupertinoColors.activeOrange,
    ),
  ),
);
