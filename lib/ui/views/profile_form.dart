import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:holefeeder/core/services/services.dart';
import 'package:holefeeder/core/view_models/view_models.dart';
import 'package:holefeeder/ui/widgets/widgets.dart';
import 'package:universal_platform/universal_platform.dart';

class ProfileForm extends StatelessWidget {
  final ProfileViewModel model;

  const ProfileForm({super.key, required this.model});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (model.hasError)
            Padding(
              padding: const EdgeInsets.only(bottom: 16.0),
              child: Text(
                model.error ?? 'An error occurred',
                style: TextStyle(color: Theme.of(context).colorScheme.error),
                textAlign: TextAlign.center,
              ),
            ),
          AdaptiveAvatar(
            radius: 50,
            backgroundImage:
                model.formState.pictureUrl.isNotEmpty
                    ? NetworkImage(model.formState.pictureUrl)
                    : AssetImage(model.fallbackPictureUrl) as ImageProvider,
            child:
                model.formState.pictureUrl.isNotEmpty
                    ? Image.network(
                      model.formState.pictureUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        // Schedule the fallback for the next frame
                        Future.microtask(
                          () => model.fallbackToDefaultPicture(),
                        );
                        return Container(); // Return empty container while switching to fallback
                      },
                    )
                    : null,
          ),
          const SizedBox(height: 16),
          Text(
            model.formState.name,
            style: Theme.of(context).textTheme.titleLarge,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          AdaptiveCard(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Authentication Details',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 12),
                _buildInfoRow(
                  context,
                  'Token Type:',
                  model.formState.tokenType.toUpperCase(),
                ),
                const SizedBox(height: 8),
                _buildInfoRow(
                  context,
                  'Token Expires In:',
                  model.formatTimeRemaining(model.formState.tokenExpiresAt),
                ),
              ],
            ),
          ),
          const Spacer(),
          AdaptiveButton(
            onPressed: model.logout,
            child: Text(LocalizationService.current.logoutTitle),
          ),
          const Spacer(),
          AdaptiveButton(
            onPressed: () {
              showConfirmationDialog(
                context,
                title: LocalizationService.current.clearDataTitle,
                message: LocalizationService.current.clearDataMessage,
                action: () async {
                  await model.clearData();
                },
              );
            },
            child: Text(LocalizationService.current.clearData),
          ),
        ],
      ),
    );
  }

  static Future<bool?> showConfirmationDialog(
    BuildContext context, {
    required String title,
    required String message,
    required Future<void> Function() action,
  }) =>
      UniversalPlatform.isApple
          ? _showCupertinoConfirmationDialog(
            context,
            title: title,
            message: message,
            action: action,
          )
          : _showMaterialConfirmationDialog(
            context,
            title: title,
            message: message,
            action: action,
          );

  static Future<bool?> _showCupertinoConfirmationDialog(
    BuildContext context, {
    required String title,
    required String message,
    required Future<void> Function() action,
  }) => showCupertinoDialog<bool>(
    context: context,
    builder:
        (context) => CupertinoAlertDialog(
          title: Text(title),
          content: Text(message),
          actions: [
            CupertinoDialogAction(
              isDefaultAction: true,
              child: Text(LocalizationService.current.cancel),
              onPressed: () => {Navigator.of(context).pop(false)},
            ),
            CupertinoDialogAction(
              isDestructiveAction: true,
              child: Text(LocalizationService.current.yes),
              onPressed: () {
                final navigatorContext = context;
                action().then((_) {
                  if (navigatorContext.mounted) {
                    Navigator.of(navigatorContext).pop(true);
                  }
                });
              },
            ),
          ],
        ),
  );

  static Future<bool?> _showMaterialConfirmationDialog(
    BuildContext context, {
    required String title,
    required String message,
    required Future<void> Function() action,
  }) => showDialog<bool>(
    context: context,
    builder:
        (context) => AlertDialog(
          title: Text(title),
          content: Text(message),
          actions: [
            TextButton(
              child: Text(LocalizationService.current.cancel),
              onPressed: () => {Navigator.of(context).pop(false)},
            ),
            TextButton(
              child: Text(LocalizationService.current.yes),
              onPressed: () {
                final navigatorContext = context;
                action().then((_) {
                  if (navigatorContext.mounted) {
                    Navigator.of(navigatorContext).pop(true);
                  }
                });
              },
            ),
          ],
        ),
  );

  Widget _buildInfoRow(BuildContext context, String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: Theme.of(context).colorScheme.onSurface.withAlpha(
              179,
            ), // ~70% opacity (0.7 * 255 ≈ 179)
          ),
        ),
        Text(
          value,
          style: Theme.of(
            context,
          ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w500),
        ),
      ],
    );
  }
}
