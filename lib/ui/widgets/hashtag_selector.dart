import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:universal_platform/universal_platform.dart';
// Import for TextOverflow

class HashtagSelector extends StatefulWidget {
  final List<String> initialHashtags;
  final List<String>? availableHashtags;
  final ValueChanged<List<String>> onHashtagsChanged;
  final String hashtagPrefix; // Added hashtag prefix
  final String inputFieldHint;
  final TextStyle? selectedHashtagStyle;
  final TextStyle? availableHashtagStyle;
  final Color? selectedHashtagColor;
  final Color? availableHashtagColor;
  final Color? inputFieldBackgroundColor;
  final Color? inputFieldTextColor;
  final double? borderRadius;
  final EdgeInsets? padding;
  final EdgeInsets? chipPadding;
  final Widget? deleteIcon;
  final bool allowSpaces;

  const HashtagSelector({
    super.key,
    this.initialHashtags = const [],
    this.availableHashtags,
    required this.onHashtagsChanged,
    this.hashtagPrefix = '#',
    required this.inputFieldHint,
    this.selectedHashtagStyle,
    this.availableHashtagStyle,
    this.selectedHashtagColor,
    this.availableHashtagColor,
    this.inputFieldBackgroundColor,
    this.inputFieldTextColor,
    this.borderRadius,
    this.padding,
    this.chipPadding,
    this.deleteIcon,
    this.allowSpaces = false,
  });

  @override
  State<HashtagSelector> createState() => _HashtagSelectorState();
}

class _HashtagSelectorState extends State<HashtagSelector> {
  late List<String> _selectedHashtags;
  final TextEditingController _textEditingController = TextEditingController();
  final FocusNode _textFieldFocusNode = FocusNode();
  String _filterText = '';

  @override
  void initState() {
    super.initState();
    _selectedHashtags = [...widget.initialHashtags];
    _textEditingController.addListener(_onFilterTextChanged);
  }

  @override
  void dispose() {
    _textEditingController.dispose();
    _textFieldFocusNode.dispose();
    super.dispose();
  }

  void _onFilterTextChanged() {
    setState(() {
      _filterText = _textEditingController.text.toLowerCase();
    });
  }

  void _addHashtag(String hashtag) {
    String trimmedHashtag = hashtag.trim();
    if (!widget.allowSpaces) {
      trimmedHashtag = trimmedHashtag.replaceAll(' ', '');
    }

    if (trimmedHashtag.isNotEmpty &&
        !_selectedHashtags.contains(trimmedHashtag)) {
      setState(() {
        _selectedHashtags.add(trimmedHashtag);
        _textEditingController.clear();
        widget.onHashtagsChanged(_selectedHashtags);
        // Request focus so the user can keep typing
        _textFieldFocusNode.requestFocus();
      });
    } else {
      _textEditingController.clear(); //clear the text.
      _textFieldFocusNode.requestFocus();
    }
  }

  void _removeHashtag(String hashtag) {
    setState(() {
      _selectedHashtags.remove(hashtag);
      widget.onHashtagsChanged(_selectedHashtags);
    });
  }

  Widget _buildCombinedHashtagList() {
    final isCupertino = UniversalPlatform.isApple;
    final allHashtags = [..._selectedHashtags];
    if (widget.availableHashtags != null) {
      final filteredAvailable = widget.availableHashtags!.where(
        (tag) =>
            !_selectedHashtags.contains(tag) &&
            (_filterText.isEmpty || tag.toLowerCase().contains(_filterText)),
      );
      allHashtags.addAll(filteredAvailable);
    }

    if (allHashtags.isEmpty) {
      return const SizedBox.shrink();
    }

    Widget scrollView = SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Padding(
        padding: const EdgeInsets.only(bottom: 12.0),
        child: Row(
          children:
              allHashtags.map((tag) {
                final isSelected = _selectedHashtags.contains(tag);
                final baseStyle = TextStyle(
                  fontSize: 14.0,
                  color:
                      isSelected
                          ? (isCupertino
                              ? CupertinoTheme.of(context).primaryColor
                              : widget.selectedHashtagColor ??
                                  Theme.of(context).primaryColor)
                          : (widget.availableHashtagColor ??
                              (isCupertino
                                  ? CupertinoColors.label
                                  : Colors.grey[700])),
                );

                return Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: GestureDetector(
                    onTap:
                        isSelected
                            ? () => _removeHashtag(tag)
                            : () => _addHashtag(tag),
                    child: Container(
                      padding:
                          widget.chipPadding ??
                          const EdgeInsets.symmetric(
                            horizontal: 8.0,
                            vertical: 4.0,
                          ),
                      decoration: BoxDecoration(
                        color:
                            isSelected
                                ? (isCupertino
                                    ? CupertinoTheme.of(context).primaryColor
                                        .withAlpha((0.2 * 255).round())
                                    : (widget.selectedHashtagColor ??
                                            Theme.of(context).primaryColor)
                                        .withAlpha((0.2 * 255).round()))
                                : (isCupertino
                                    ? CupertinoColors.systemGrey.withAlpha(
                                      (0.1 * 255).round(),
                                    )
                                    : Colors.grey.withAlpha(
                                      (0.1 * 255).round(),
                                    )),
                        borderRadius: BorderRadius.circular(
                          widget.borderRadius ?? 8.0,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            '${widget.hashtagPrefix}$tag',
                            style:
                                (isSelected
                                        ? widget.selectedHashtagStyle
                                        : widget.availableHashtagStyle)
                                    ?.merge(baseStyle) ??
                                baseStyle,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
        ),
      ),
    );

    if (isCupertino) {
      scrollView = CupertinoScrollbar(
        thickness: 4.0,
        radius: const Radius.circular(4.0),
        child: scrollView,
      );
    } else {
      scrollView = Scrollbar(
        thickness: 4.0,
        radius: const Radius.circular(4.0),
        child: scrollView,
      );
    }

    return scrollView;
  }

  Widget _buildInputField() {
    final isCupertino = UniversalPlatform.isApple;
    final baseStyle = TextStyle(
      fontSize: 16.0,
      color:
          widget.inputFieldTextColor ??
          (isCupertino ? CupertinoColors.black : Colors.black),
    );

    final textField =
        isCupertino
            ? CupertinoTextField(
              controller: _textEditingController,
              focusNode: _textFieldFocusNode,
              placeholder: widget.inputFieldHint,
              placeholderStyle: const TextStyle(
                color: CupertinoColors.placeholderText,
              ),
              onSubmitted: (value) {
                if (value.isNotEmpty) _addHashtag(value);
              },
              style: widget.selectedHashtagStyle?.merge(baseStyle) ?? baseStyle,
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color:
                    widget.inputFieldBackgroundColor ?? CupertinoColors.white,
                borderRadius: BorderRadius.circular(widget.borderRadius ?? 8.0),
                border: Border.all(color: CupertinoColors.lightBackgroundGray),
              ),
            )
            : TextField(
              controller: _textEditingController,
              focusNode: _textFieldFocusNode,
              decoration: InputDecoration(
                hintText: widget.inputFieldHint,
                hintStyle: TextStyle(color: Colors.grey[400]),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(
                    widget.borderRadius ?? 8.0,
                  ),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: widget.inputFieldBackgroundColor ?? Colors.white,
                contentPadding: const EdgeInsets.symmetric(
                  vertical: 10.0,
                  horizontal: 12.0,
                ),
              ),
              onSubmitted: (value) {
                if (value.isNotEmpty) _addHashtag(value);
              },
              style: widget.selectedHashtagStyle?.merge(baseStyle) ?? baseStyle,
            );

    return textField;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: widget.padding ?? const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildInputField(),
          const SizedBox(height: 16.0),
          _buildCombinedHashtagList(),
        ],
      ),
    );
  }
}
