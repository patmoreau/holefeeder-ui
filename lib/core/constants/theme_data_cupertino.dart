import 'package:flutter/cupertino.dart';

CupertinoThemeData buildCupertinoThemeData(BuildContext context) =>
    CupertinoThemeData(
      brightness: MediaQuery.of(context).platformBrightness,
      primaryColor: CupertinoColors.activeOrange,
      primaryContrastingColor: CupertinoColors.white,
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
        navTitleTextStyle: TextStyle(
          fontFamily: '.SF Pro Display',
          fontSize: 17,
          fontWeight: FontWeight.w600,
          color: CupertinoColors.label,
        ),
        navLargeTitleTextStyle: TextStyle(
          fontFamily: '.SF Pro Display',
          fontSize: 34,
          fontWeight: FontWeight.w700,
          color: CupertinoColors.label,
        ),
        pickerTextStyle: TextStyle(
          fontFamily: '.SF Pro Text',
          fontSize: 21,
          color: CupertinoColors.label,
        ),
        dateTimePickerTextStyle: TextStyle(
          fontFamily: '.SF Pro Text',
          fontSize: 21,
          color: CupertinoColors.label,
        ),
        navActionTextStyle: TextStyle(
          fontFamily: '.SF Pro Text',
          fontSize: 17,
          color: CupertinoColors.activeOrange,
        ),
        tabLabelTextStyle: TextStyle(
          fontFamily: '.SF Pro Text',
          fontSize: 10,
          color: CupertinoColors.inactiveGray,
        ),
      ),
    );
