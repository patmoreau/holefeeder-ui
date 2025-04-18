import 'package:flutter/material.dart';
import 'package:holefeeder/core/view_models/screens/profile_view_model.dart';
import 'package:holefeeder/ui/widgets/platform_avatar_widget.dart';
import 'package:holefeeder/ui/widgets/platform_button_widget.dart';

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
          PlatformAvatar(
            radius: 50,
            backgroundImage:
                model.formState.pictureUrl.isNotEmpty
                    ? NetworkImage(model.formState.pictureUrl)
                    : AssetImage(model.fallbackPictureUrl) as ImageProvider,
            // Remove onBackgroundImageError and use Image.network with errorBuilder instead
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
          const Spacer(),
          PlatformButton(onPressed: model.logout, label: model.logoutTitle),
        ],
      ),
    );
  }
}
