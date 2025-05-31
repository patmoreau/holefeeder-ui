import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:universal_platform/universal_platform.dart';

class AdaptiveAvatar extends StatelessWidget {
  final double radius;
  final ImageProvider? backgroundImage;
  final Widget? child;
  final Color? backgroundColor;
  final VoidCallback? onBackgroundImageError;

  const AdaptiveAvatar({
    super.key,
    this.radius = 20,
    this.backgroundImage,
    this.child,
    this.backgroundColor,
    this.onBackgroundImageError,
  });

  @override
  Widget build(BuildContext context) {
    return UniversalPlatform.isApple
        ? _buildCupertinoAvatar(context)
        : _buildMaterialAvatar(context);
  }

  Widget _buildCupertinoAvatar(BuildContext context) {
    return Center(
      child: SizedBox(
        width: radius * 2,
        height: radius * 2,
        child: Stack(
          children: [
            Container(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: backgroundColor ?? CupertinoColors.systemGrey6,
                border: Border.all(
                  color: CupertinoColors.systemGrey5,
                  width: 1,
                ),
              ),
            ),
            if (backgroundImage != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(radius),
                child: Image(
                  image: backgroundImage!,
                  width: radius * 2,
                  height: radius * 2,
                  fit: BoxFit.cover,
                  errorBuilder:
                      onBackgroundImageError != null
                          ? (context, error, stackTrace) {
                            onBackgroundImageError!();
                            return _buildPlaceholder();
                          }
                          : null,
                ),
              )
            else if (child != null)
              Center(child: child),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceholder() {
    return Container(color: backgroundColor ?? CupertinoColors.systemGrey6);
  }

  Widget _buildMaterialAvatar(BuildContext context) {
    return CircleAvatar(
      radius: radius,
      backgroundColor: backgroundColor,
      backgroundImage: backgroundImage,
      onBackgroundImageError:
          onBackgroundImageError != null
              ? (exception, stackTrace) => onBackgroundImageError!()
              : null,
      child: backgroundImage == null ? child : null,
    );
  }
}
