import 'package:flutter/cupertino.dart';

class CupertinoChip extends StatelessWidget {
  final String label;
  final VoidCallback onDeleted;
  final Color? backgroundColor;
  final Color? labelColor;

  const CupertinoChip({
    super.key,
    required this.label,
    required this.onDeleted,
    this.backgroundColor,
    this.labelColor,
  });

  @override
  Widget build(BuildContext context) {
    final defaultBackgroundColor = CupertinoColors.systemGrey6.resolveFrom(
      context,
    );
    final defaultLabelColor = CupertinoColors.label.resolveFrom(context);

    return GestureDetector(
      onTap: onDeleted,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: backgroundColor ?? defaultBackgroundColor,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: TextStyle(
                color: labelColor ?? defaultLabelColor,
                fontSize: 14,
              ),
            ),
            const SizedBox(width: 4),
            Icon(
              CupertinoIcons.xmark_circle_fill,
              size: 16,
              color: CupertinoColors.systemGrey.resolveFrom(context),
            ),
          ],
        ),
      ),
    );
  }
}
