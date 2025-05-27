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
  String get buttonOk => 'OK';

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
  String get fieldDate => 'Date';

  @override
  String get fieldFrequency => 'Fréquence';

  @override
  String get fieldIntervalType => 'Type d\'intervalle';

  @override
  String get fieldRecurrence => 'Récurrence';

  @override
  String get fieldTags => 'Étiquettes';

  @override
  String get fieldTagsPlaceHolder => 'Ajoutez vos étiquettes';

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
  String get lastUpdated => 'Dernière mise à jour';

  @override
  String get note => 'Note';

  @override
  String get notificationServiceErrorTitle => 'Erreur';

  @override
  String get notificationServiceSuccessTitle => 'Succès';

  @override
  String get profile => 'Profil';

  @override
  String get purchase => 'Acheter';

  @override
  String get purchaseBasicDetails => 'Détails de l\'achat';

  @override
  String get purchaseCashflowDetails => 'Détails du flux de trésorerie';

  @override
  String get purchaseTagsDetails => 'Étiquettes de l\'achat';

  @override
  String get purchaseTitle => 'Faire un achat';

  @override
  String get retry => 'Retry';

  @override
  String get save => 'Enregistrer';

  @override
  String get transactions => 'Transactions';

  @override
  String get transactionsEmpty => 'Aucune transaction trouvée';

  @override
  String get upcoming => 'À venir';

  @override
  String get upcomingEmpty => 'Aucun transaction à venir';

  @override
  String get validationDecimalNumber => 'Le nombre doit être décimal positif';

  @override
  String get validationNumberGreatherThanZero => 'Le nombre doit être supérieur à zéro';

  @override
  String get validationPositiveNumber => 'Le nombre doit être positif';

  @override
  String get welcomeMessage => 'Bienvenue dans notre application';
}
