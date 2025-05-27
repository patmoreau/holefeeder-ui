import 'package:flutter/cupertino.dart';

mixin CupertinoPageScaffoldMixin {
  Widget get body;
  Color? get backgroundColor;
  bool get showAppBar;
  Widget? get leading;
  List<Widget>? get actions;
  Text? get pageTitle;

  Widget buildCupertinoPageScaffold() => CupertinoPageScaffold(
    backgroundColor: backgroundColor,
    navigationBar:
        showAppBar
            ? CupertinoNavigationBar(
              middle: pageTitle,
              leading: leading,
              trailing:
                  actions != null && actions!.isNotEmpty
                      ? Row(mainAxisSize: MainAxisSize.min, children: actions!)
                      : null,
            )
            : null,
    child: SafeArea(child: body),
  );
}
