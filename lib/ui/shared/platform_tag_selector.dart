import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:universal_platform/universal_platform.dart';
import 'package:holefeeder/ui/shared/cupertino_chip.dart';

class PlatformTagSelector extends StatefulWidget {
  final List<String> allTags;
  final List<String> selectedTags;
  final ValueChanged<List<String>> onTagsChanged;

  const PlatformTagSelector({
    super.key,
    required this.allTags,
    required this.selectedTags,
    required this.onTagsChanged,
  });

  @override
  State<PlatformTagSelector> createState() => _PlatformTagSelectorState();
}

class _PlatformTagSelectorState extends State<PlatformTagSelector> {
  final TextEditingController _textController = TextEditingController();
  final FocusNode _focusNode = FocusNode();
  final LayerLink _layerLink = LayerLink();
  List<String> _filteredTags = [];

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_handleFocusChange);
  }

  @override
  void dispose() {
    _textController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _handleFocusChange() async {
    if (_focusNode.hasFocus) {
      _filterTags(_textController.text);
    } else {
      _filteredTags = [];
    }
  }

  void _filterTags(String query) {
    setState(() {
      _filteredTags =
          query.isEmpty
              ? []
              : widget.allTags
                  .where(
                    (tag) =>
                        tag.toLowerCase().contains(query.toLowerCase()) &&
                        !widget.selectedTags.contains(tag),
                  )
                  .toList();
    });
  }

  void _addTag(String tag) {
    if (tag.isNotEmpty && !widget.selectedTags.contains(tag)) {
      final updatedTags = [...widget.selectedTags, tag];
      widget.onTagsChanged(updatedTags);
      _textController.clear();
      setState(() {
        _filteredTags = [];
      });
    }
  }

  void _removeTag(String tag) {
    final updatedTags = widget.selectedTags.where((t) => t != tag).toList();
    widget.onTagsChanged(updatedTags);
  }

  @override
  Widget build(BuildContext context) {
    return UniversalPlatform.isApple
        ? _buildCupertinoSelector()
        : _buildMaterialSelector();
  }

  Widget _buildCupertinoSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSelectedTags(),
        const SizedBox(height: 8),
        _buildTextField(true),
        if (_filteredTags.isNotEmpty) _buildTagsList(useCupertino: true),
      ],
    );
  }

  Widget _buildMaterialSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSelectedTags(),
        const SizedBox(height: 8),
        _buildTextField(false),
        if (_filteredTags.isNotEmpty) _buildTagsList(useCupertino: false),
      ],
    );
  }

  Widget _buildSelectedTags() {
    return Wrap(
      spacing: 8.0,
      runSpacing: 4.0,
      children:
          widget.selectedTags.map((tag) {
            return UniversalPlatform.isApple
                ? CupertinoChip(label: tag, onDeleted: () => _removeTag(tag))
                : Chip(
                  label: Text(tag),
                  onDeleted: () => _removeTag(tag),
                  deleteIcon: const Icon(Icons.cancel, size: 16),
                );
          }).toList(),
    );
  }

  Widget _buildTagsList({required bool useCupertino}) {
    return SizedBox(
      height: 150,
      child: ListView.builder(
        itemCount: _filteredTags.length,
        itemBuilder: (context, index) {
          final tag = _filteredTags[index];
          return useCupertino
              ? CupertinoButton(
                padding: EdgeInsets.zero,
                onPressed: () => _addTag(tag),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                  child: Text(tag),
                ),
              )
              : ListTile(title: Text(tag), onTap: () => _addTag(tag));
        },
      ),
    );
  }

  Widget _buildTextField(bool useCupertino) {
    return CompositedTransformTarget(
      link: _layerLink,
      child:
          useCupertino
              ? CupertinoTextField(
                controller: _textController,
                focusNode: _focusNode,
                placeholder: 'Add Tag',
                onChanged: _filterTags,
                onSubmitted: _addTag,
                suffix: CupertinoButton(
                  padding: EdgeInsets.zero,
                  child: const Icon(CupertinoIcons.add_circled_solid),
                  onPressed: () => _addTag(_textController.text),
                ),
              )
              : TextField(
                controller: _textController,
                focusNode: _focusNode,
                decoration: InputDecoration(
                  hintText: 'Add Tag',
                  suffixIcon: IconButton(
                    icon: const Icon(Icons.add_circle),
                    onPressed: () => _addTag(_textController.text),
                  ),
                  border: const OutlineInputBorder(),
                ),
                onChanged: _filterTags,
                onSubmitted: _addTag,
              ),
    );
  }
}
