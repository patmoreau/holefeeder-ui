// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for French (`fr`).
class AppLocalizationsFr extends AppLocalizations {
  AppLocalizationsFr([String locale = 'fr']) : super(locale);

  @override
  String get appTitle => 'Holefeeder';

  @override
  String get categories => 'Catégories';

  @override
  String get dashboard => 'Tableau de bord';

  @override
  String get errorGeneric => 'Une erreur s\'est produite';

  @override
  String helloUser(String userName) {
    return 'Bonjour $userName';
  }

  @override
  String get holefeederTitle => 'Holefeeder';

  @override
  String get home => 'Accueil';

  @override
  String get profile => 'Profil';

  @override
  String get retry => 'Retry';

  @override
  String get welcomeMessage => 'Bienvenue dans notre application';
}
