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
  String get back => 'Retour';

  @override
  String get categories => 'Catégories';

  @override
  String get dashboard => 'Tableau de bord';

  @override
  String get errorGeneric => 'Une erreur s\'est produite';

  @override
  String get fieldAccount => 'Compte';

  @override
  String get fieldAccountPlaceHolder => 'Sélectionnez votre compte';

  @override
  String get fieldAmount => 'Montant';

  @override
  String get fieldCashflow => 'Flux de trésorerie';

  @override
  String get fieldCategory => 'Catégorie';

  @override
  String get fieldCategoryPlaceHolder => 'Sélectionnez votre catégorie';

  @override
  String get fieldFrequency => 'Fréquence';

  @override
  String get fieldIntervalType => 'Type d\'intervalle';

  @override
  String get fieldRecurrence => 'Récurrence';

  @override
  String helloUser(String userName) {
    return 'Bonjour $userName';
  }

  @override
  String get holefeederTitle => 'Holefeeder';

  @override
  String get home => 'Accueil';

  @override
  String get intervalTypeWeekly => 'Hebdomadaire';

  @override
  String get intervalTypeMonthly => 'Mensuel';

  @override
  String get intervalTypeYearly => 'Annuel';

  @override
  String get intervalTypeOneTime => 'Simple';

  @override
  String get note => 'Note';

  @override
  String get profile => 'Profil';

  @override
  String get purchase => 'Acheter';

  @override
  String get purchaseTitle => 'Faire un achat';

  @override
  String get retry => 'Retry';

  @override
  String get save => 'Enregistrer';

  @override
  String get welcomeMessage => 'Bienvenue dans notre application';
}
