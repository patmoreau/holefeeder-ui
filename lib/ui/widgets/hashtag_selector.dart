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
    this.inputFieldHint = 'Add hashtag',
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

  @override
  void initState() {
    super.initState();
    _selectedHashtags = [...widget.initialHashtags];
  }

  @override
  void dispose() {
    _textEditingController.dispose();
    _textFieldFocusNode.dispose();
    super.dispose();
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
      allHashtags.addAll(
        widget.availableHashtags!.where(
          (tag) => !_selectedHashtags.contains(tag),
        ),
      );
    }

    if (allHashtags.isEmpty) {
      return const SizedBox.shrink();
    }

    return Wrap(
      spacing: 8.0,
      runSpacing: 4.0,
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

            return GestureDetector(
              onTap:
                  isSelected
                      ? () => _removeHashtag(tag)
                      : () => _addHashtag(tag),
              child: Container(
                padding:
                    widget.chipPadding ??
                    const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
                decoration: BoxDecoration(
                  color:
                      isSelected
                          ? (isCupertino
                              ? CupertinoTheme.of(
                                context,
                              ).primaryColor.withOpacity(0.2)
                              : widget.selectedHashtagColor?.withOpacity(0.2) ??
                                  Theme.of(
                                    context,
                                  ).primaryColor.withOpacity(0.2))
                          : (isCupertino
                              ? CupertinoColors.systemGrey.withOpacity(0.1)
                              : Colors.grey.withOpacity(0.1)),
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
                    if (isSelected) ...[
                      const SizedBox(width: 4.0),
                      widget.deleteIcon ??
                          Icon(
                            isCupertino
                                ? CupertinoIcons.clear_circled_solid
                                : Icons.cancel,
                            size: 16.0,
                            color:
                                isCupertino
                                    ? CupertinoColors.systemGrey
                                    : widget.selectedHashtagColor ??
                                        Colors.grey,
                          ),
                    ],
                  ],
                ),
              ),
            );
          }).toList(),
    );
  }

  Widget _buildInputField() {
    final isCupertino = UniversalPlatform.isApple;
    final baseStyle = TextStyle(
      fontSize: 16.0,
      color:
          widget.inputFieldTextColor ??
          (isCupertino ? CupertinoColors.black : Colors.black),
    );

    return isCupertino
        ? CupertinoTextField(
          controller: _textEditingController,
          focusNode: _textFieldFocusNode,
          placeholder: widget.inputFieldHint,
          placeholderStyle: const TextStyle(
            color: CupertinoColors.placeholderText,
          ),
          onSubmitted: _addHashtag,
          style: widget.selectedHashtagStyle?.merge(baseStyle) ?? baseStyle,
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: widget.inputFieldBackgroundColor ?? CupertinoColors.white,
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
              borderRadius: BorderRadius.circular(widget.borderRadius ?? 8.0),
              borderSide: BorderSide.none, // Remove the border
            ),
            filled: true,
            fillColor:
                widget.inputFieldBackgroundColor ??
                Colors.white, // Set the fill color
            contentPadding: const EdgeInsets.symmetric(
              vertical: 10.0,
              horizontal: 12.0,
            ), // Adjust padding as needed, original was 16
          ),
          onSubmitted: _addHashtag,
          style: widget.selectedHashtagStyle?.merge(baseStyle) ?? baseStyle,
        );
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
