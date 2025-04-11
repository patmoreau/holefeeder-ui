import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:universal_platform/universal_platform.dart';

class ErrorBanner extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;

  const ErrorBanner({super.key, required String? message, this.onRetry})
    : message = message ?? 'An error occurred.';

  @override
  Widget build(BuildContext context) {
    return UniversalPlatform.isApple
        ? _buildCupertinoError()
        : _buildMaterialError(context);
  }

  Widget _buildCupertinoError() {
    return CupertinoFormSection(
      backgroundColor: CupertinoColors.systemRed.withOpacity(0.1),
      header: Row(
        children: [
          const Icon(
            CupertinoIcons.exclamationmark_triangle_fill,
            color: CupertinoColors.systemRed,
          ),
          const SizedBox(width: 8),
          Expanded(child: Text(message)),
          if (onRetry != null)
            CupertinoButton(
              padding: EdgeInsets.zero,
              onPressed: onRetry,
              child: const Text('Retry'),
            ),
        ],
      ),
      children: const [],
    );
  }

  Widget _buildMaterialError(BuildContext context) {
    return Card(
      color: Theme.of(context).colorScheme.errorContainer,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            leading: Icon(
              Icons.error_outline,
              color: Theme.of(context).colorScheme.error,
            ),
            title: Text(
              message,
              style: TextStyle(color: Theme.of(context).colorScheme.error),
            ),
          ),
          if (onRetry != null)
            OverflowBar(
              children: [
                TextButton(onPressed: onRetry, child: const Text('Retry')),
              ],
            ),
        ],
      ),
    );
  }
}
