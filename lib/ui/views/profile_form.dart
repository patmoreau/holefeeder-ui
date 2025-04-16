import 'package:flutter/material.dart';
import 'package:holefeeder/core/view_models/screens/profile_view_model.dart';

class ProfileForm extends StatelessWidget {
  final ProfileViewModel model;

  const ProfileForm({super.key, required this.model});

  @override
  Widget build(BuildContext context) {
    if (model.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

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
          CircleAvatar(
            radius: 50,
            backgroundImage:
                model.formState.pictureUrl.isNotEmpty
                    ? NetworkImage(model.formState.pictureUrl)
                    : AssetImage(model.fallbackPictureUrl) as ImageProvider,
            onBackgroundImageError: (_, __) => model.fallbackToDefaultPicture(),
          ),
          const SizedBox(height: 16),
          Text(
            model.formState.name,
            style: Theme.of(context).textTheme.titleLarge,
            textAlign: TextAlign.center,
          ),
          const Spacer(),
          ElevatedButton(
            onPressed: model.logout,
            child: Text(model.logoutTitle),
          ),
        ],
      ),
    );
  }
}
