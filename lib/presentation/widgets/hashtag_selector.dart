import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core/constants/themes.dart';
import 'package:holefeeder/platform.dart';

class HashtagSelector extends StatefulWidget {
  final List<String> initialHashtags;
  final List<String>? availableHashtags;
  final ValueChanged<List<String>> onHashtagsChanged;
  final String hashtagPrefix;
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

    // Enhanced validation
    if (trimmedHashtag.isEmpty) {
      _textEditingController.clear();
      _textFieldFocusNode.requestFocus();
      return;
    }

    // Check for duplicates
    if (_selectedHashtags.contains(trimmedHashtag)) {
      _textEditingController.clear();
      _textFieldFocusNode.requestFocus();
      // Could add haptic feedback here for user awareness
      return;
    }

    // Check for maximum length or other business rules
    if (trimmedHashtag.length > 50) {
      // Example limit
      _textEditingController.clear();
      _textFieldFocusNode.requestFocus();
      return;
    }

    setState(() {
      _selectedHashtags.add(trimmedHashtag);
      _textEditingController.clear();
      widget.onHashtagsChanged(_selectedHashtags);
      _textFieldFocusNode.requestFocus();
    });
  }

  void _removeHashtag(String hashtag) {
    setState(() {
      _selectedHashtags.remove(hashtag);
      widget.onHashtagsChanged(_selectedHashtags);
    });
  }

  Widget _buildCombinedHashtagList() {
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

    // Check if keyboard is visible and adjust height accordingly
    final keyboardHeight = MediaQuery.of(context).viewInsets.bottom;
    final isKeyboardVisible = keyboardHeight > 0;
    final listHeight =
        isKeyboardVisible ? 32.0 : 40.0; // Smaller when keyboard is open

    Widget scrollView = SizedBox(
      height: listHeight,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: allHashtags.length,
        itemBuilder: (context, index) {
          final tag = allHashtags[index];
          return _buildHashtagChip(tag, isKeyboardVisible);
        },
      ),
    );

    // Use platform-appropriate scrollbar
    if (Platform.isCupertino) {
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

    return Padding(
      padding: EdgeInsets.only(bottom: isKeyboardVisible ? 6.0 : 12.0),
      child: scrollView,
    );
  }

  Widget _buildHashtagChip(String tag, bool isCompact) {
    final isSelected = _selectedHashtags.contains(tag);

    // Use theme-friendly colors
    final primaryColor =
        widget.selectedHashtagColor ?? AppThemes.getPrimaryColor(context);
    final textColor =
        isSelected
            ? primaryColor
            : (widget.availableHashtagColor ??
                AppThemes.getSecondaryTextColor(context));

    final backgroundColor =
        isSelected
            ? primaryColor.withValues(alpha: 0.2)
            : AppThemes.getCardColor(context);

    // Adjust font size and padding based on keyboard visibility
    final fontSize = isCompact ? 12.0 : 14.0;
    final horizontalPadding = isCompact ? 8.0 : 12.0;
    final verticalPadding = isCompact ? 4.0 : 6.0;
    final iconSize = isCompact ? 14.0 : 16.0;

    final baseStyle = TextStyle(fontSize: fontSize, color: textColor);

    return Padding(
      padding: const EdgeInsets.only(
        right: 6.0,
      ), // Reduced spacing between chips
      child: GestureDetector(
        onTap: isSelected ? () => _removeHashtag(tag) : () => _addHashtag(tag),
        child: Container(
          padding:
              widget.chipPadding ??
              EdgeInsets.symmetric(
                horizontal: horizontalPadding,
                vertical: verticalPadding,
              ),
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: BorderRadius.circular(
              widget.borderRadius ?? 6.0,
            ), // Slightly smaller radius when compact
            border: Border.all(
              color:
                  isSelected
                      ? primaryColor.withValues(alpha: 0.3)
                      : AppThemes.getBorderColor(
                        context,
                      ).withValues(alpha: 0.3),
              width: 1.0,
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
                SizedBox(width: isCompact ? 3 : 4),
                Icon(
                  Platform.isCupertino
                      ? CupertinoIcons.clear_circled_solid
                      : Icons.cancel,
                  size: iconSize,
                  color: textColor.withValues(alpha: 0.7),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInputField() {
    // Use theme-friendly colors and styles
    final backgroundColor =
        widget.inputFieldBackgroundColor ?? AppThemes.getCardColor(context);
    final textColor =
        widget.inputFieldTextColor ?? AppThemes.getTextColor(context);
    final placeholderColor = AppThemes.getPlaceholderTextColor(context);
    final borderColor = AppThemes.getBorderColor(context);

    final baseStyle = AppThemes.getFormFieldTextStyle(
      context,
    ).copyWith(color: textColor);

    if (Platform.isCupertino) {
      return CupertinoTextField(
        controller: _textEditingController,
        focusNode: _textFieldFocusNode,
        placeholder: widget.inputFieldHint,
        placeholderStyle: TextStyle(color: placeholderColor),
        onSubmitted: (value) {
          if (value.isNotEmpty) _addHashtag(value);
        },
        style: widget.selectedHashtagStyle?.merge(baseStyle) ?? baseStyle,
        padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 10.0),
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(widget.borderRadius ?? 8.0),
          border: Border.all(color: borderColor.withValues(alpha: 0.3)),
        ),
      );
    } else {
      return TextField(
        controller: _textEditingController,
        focusNode: _textFieldFocusNode,
        decoration: InputDecoration(
          hintText: widget.inputFieldHint,
          hintStyle: TextStyle(color: placeholderColor),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(widget.borderRadius ?? 8.0),
            borderSide: BorderSide(color: borderColor.withValues(alpha: 0.3)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(widget.borderRadius ?? 8.0),
            borderSide: BorderSide(color: borderColor.withValues(alpha: 0.3)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(widget.borderRadius ?? 8.0),
            borderSide: BorderSide(color: AppThemes.getPrimaryColor(context)),
          ),
          filled: true,
          fillColor: backgroundColor,
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
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: widget.padding ?? AppThemes.getFormRowPadding(context),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildInputField(),
          SizedBox(height: AppThemes.getFormSectionSpacing(context) / 2),
          _buildCombinedHashtagList(),
        ],
      ),
    );
  }
}
