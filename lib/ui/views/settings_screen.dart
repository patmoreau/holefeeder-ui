import 'dart:developer' as developer;

import 'package:cupertino_calendar_picker/cupertino_calendar_picker.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart' show Theme;
import 'package:go_router/go_router.dart';
import 'package:holefeeder/core/constants/themes.dart';
import 'package:holefeeder/core/services/l10n_service.dart';
import 'package:pull_down_button/pull_down_button.dart';

class CupertinoFormExample extends StatefulWidget {
  const CupertinoFormExample({super.key});

  @override
  State<CupertinoFormExample> createState() => _CupertinoFormExampleState();
}

class _CupertinoFormExampleState extends State<CupertinoFormExample> {
  String _section1DropdownValue = 'Option 1';
  String _section2DropdownValue = 'Choice A';
  final TextEditingController _section1TextController = TextEditingController();
  final TextEditingController _section2TextController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final formTheme = Theme.of(context).extension<FormThemeExtension>();
    return CupertinoPageScaffold(
      child: CustomScrollView(
        slivers: <Widget>[
          CupertinoSliverNavigationBar(
            padding: EdgeInsetsDirectional.zero,
            leading: CupertinoNavigationBarBackButton(
              previousPageTitle: L10nService.current.back,
              onPressed: () => GoRouter.of(context).go('/dashboard'),
            ),
            trailing: CupertinoButton(
              padding: EdgeInsets.symmetric(horizontal: 16),
              onPressed: () {},
              child: const Text('Save'),
            ),
            largeTitle: const Text('Form Example'),
          ),
          SliverSafeArea(
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                Form(
                  child: Column(
                    children: <Widget>[
                      CupertinoFormSection.insetGrouped(
                        header: const Text('Section 1'),
                        children: <Widget>[
                          CupertinoTextFormFieldRow(
                            controller: _section1TextController,
                            placeholder: 'Enter text',
                            prefix: const Text('Text:'),
                            padding: formTheme?.rowPadding,
                          ),
                          CupertinoFormRow(
                            prefix: const Text('Date'),
                            padding: formTheme?.rowPadding,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                CupertinoCalendarPickerButton(
                                  minimumDateTime: DateTime(2024, 7, 10),
                                  maximumDateTime: DateTime(2025, 7, 10),
                                  initialDateTime: DateTime.now(),
                                  mode: CupertinoCalendarMode.date,
                                  onDateTimeChanged: (DateTime dateTime) {
                                    developer.log(
                                      'Selected date: $dateTime',
                                      name: 'SettingsScreen',
                                    );
                                  },
                                ),
                              ],
                            ),
                          ),
                          CupertinoFormRow(
                            prefix: const Text('Menu'),
                            padding: formTheme?.rowPadding,
                            child: PullDownButton(
                              itemBuilder:
                                  (context) => [
                                    PullDownMenuItem(
                                      title: 'Menu item',
                                      onTap: () {},
                                    ),
                                    PullDownMenuItem(
                                      title: 'Menu item 2',
                                      onTap: () {},
                                    ),
                                  ],
                              buttonBuilder:
                                  (context, showMenu) => CupertinoButton(
                                    onPressed: showMenu,
                                    padding: EdgeInsets.zero,
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: const [
                                        Text('Select'),
                                        Icon(
                                          CupertinoIcons
                                              .chevron_up_chevron_down,
                                        ),
                                      ],
                                    ),
                                  ),
                            ),
                          ),
                          CupertinoPickerRow(
                            selectedValue: _section1DropdownValue,
                            onChanged: (value) {
                              setState(() {
                                _section1DropdownValue =
                                    ['Option 1', 'Option 2', 'Option 3'][value];
                              });
                            },
                            prefix: const Text('Select:'),
                            padding: formTheme?.rowPadding,
                            children: const <Widget>[
                              Text('Option 1'),
                              Text('Option 2'),
                              Text('Option 3'),
                            ],
                          ),
                        ],
                      ),
                      SizedBox(height: formTheme?.sectionSpacing ?? 24.0),
                      CupertinoFormSection.insetGrouped(
                        header: const Text('Section 2'),
                        children: <Widget>[
                          CupertinoTextFormFieldRow(
                            controller: _section2TextController,
                            placeholder: 'Enter more text',
                            prefix: const Text('Text:'),
                            padding: formTheme?.rowPadding,
                          ),
                          CupertinoPickerRow(
                            selectedValue: _section2DropdownValue,
                            onChanged: (value) {
                              setState(() {
                                _section2DropdownValue =
                                    ['Choice A', 'Choice B', 'Choice C'][value];
                              });
                            },
                            prefix: const Text('Select:'),
                            padding: formTheme?.rowPadding,
                            children: const <Widget>[
                              Text('Choice A'),
                              Text('Choice B'),
                              Text('Choice C'),
                            ],
                          ),
                        ],
                      ),
                      SizedBox(height: formTheme?.sectionSpacing ?? 24.0),
                      Padding(
                        padding:
                            formTheme?.rowPadding ??
                            const EdgeInsets.symmetric(horizontal: 16),
                        child: CupertinoButton.filled(
                          child: const Text('Submit'),
                          onPressed: () {
                            developer.log(
                              'Section 1 Text: ${_section1TextController.text}',
                              name: 'SettingsScreen',
                            );
                            developer.log(
                              'Section 1 Dropdown: $_section1DropdownValue',
                              name: 'SettingsScreen',
                            );
                            developer.log(
                              'Section 2 Text: ${_section2TextController.text}',
                              name: 'SettingsScreen',
                            );
                            developer.log(
                              'Section 2 Dropdown: $_section2DropdownValue',
                              name: 'SettingsScreen',
                            );
                            GoRouter.of(context).go('/dashboard');
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class CupertinoPickerRow extends StatelessWidget {
  final List<Widget> children;
  final String selectedValue;
  final ValueChanged<int> onChanged;
  final Widget prefix;
  final EdgeInsetsGeometry? padding;

  const CupertinoPickerRow({
    super.key,
    required this.children,
    required this.selectedValue,
    required this.onChanged,
    required this.prefix,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    final formTheme = Theme.of(context).extension<FormThemeExtension>();
    return CupertinoFormRow(
      prefix: prefix,
      padding: padding ?? formTheme?.rowPadding,
      child: GestureDetector(
        onTap: () {
          showCupertinoModalPopup(
            context: context,
            builder: (BuildContext context) {
              return Container(
                height: 216,
                color: CupertinoColors.systemBackground.resolveFrom(context),
                child: SafeArea(
                  top: false,
                  child: CupertinoPicker(
                    magnification: 1.22,
                    squeeze: 1.45,
                    useMagnifier: true,
                    itemExtent: 32.0,
                    onSelectedItemChanged: onChanged,
                    scrollController: FixedExtentScrollController(
                      initialItem: children.indexOf(
                        children.firstWhere(
                          (element) => (element as Text).data == selectedValue,
                        ),
                      ),
                    ),
                    children: children,
                  ),
                ),
              );
            },
          );
        },
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            Text(selectedValue),
            Icon(CupertinoIcons.chevron_down),
          ],
        ),
      ),
    );
  }
}
