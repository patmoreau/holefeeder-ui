import { TranslationStructure } from '@/i18n/translations';

export const fr: TranslationStructure = {
  alert: {
    discard: {
      title: 'Annuler les modifications ?',
      message: 'Vous avez des modifications non enregistrées. Voulez-vous les annuler et revenir en arrière ?',
      confirmText: 'Annuler',
      cancelText: 'Rester',
    },
    formError: {
      title_one: 'Erreur de formulaire',
      title_other: 'Erreurs de formulaire',
      message_one: 'Il y a une erreur dans le formulaire. Veuillez la corriger',
      message_other: 'Il y a des erreurs dans le formulaire. Veuillez les corriger',
      dismissText: 'Fermer',
    },
  },
  auth: {
    loginTitle: 'Bienvenue',
    loginSubtitle: 'Veuillez vous connecter pour continuer',
    loginButton: 'Connexion',
    logoutButton: 'Déconnexion',
    loggingIn: 'Connexion en cours...',
    loginError: 'Erreur de connexion',
    loginErrorMessage: 'Échec de la connexion. Veuillez réessayer.',
    logoutSuccess: 'Déconnexion réussie',
  },
  common: {
    welcome: 'Bienvenue',
    login: 'Connexion',
    logout: 'Déconnexion',
    loading: 'Chargement...',
    error: 'Erreur',
    retry: 'Réessayer',
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    done: 'Terminé',
  },
  dateIntervalTypePicker: {
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
    yearly: 'Annuel',
    oneTime: 'Unique',
  },
  displaySection: {
    title: 'Affichage',
    language: 'Langue',
    theme: 'Thème',
  },
  errors: {
    noInternetConnection: {
      title: 'Pas de connexion Internet',
      message: 'Il semble que vous soyez hors ligne. Veuillez vérifier votre connexion Internet et réessayer.',
    },
    cannotReachServer: {
      title: 'Impossible de joindre le serveur',
      message: 'Nous ne pouvons pas joindre le backend pour le moment. Veuillez réessayer dans un instant.',
    },
  },
  errorSheet: {
    retry: 'Réessayer',
    dismiss: 'Fermer',
  },
  home: {
    title: 'Bienvenue !',
    step1Title: 'Étape 1 : Essayez',
    step1Description:
      'Modifiez app/(tabs)/index.tsx pour voir les changements. Appuyez sur {{shortcut}} pour ouvrir les outils de développement.',
    step2Title: 'Étape 2 : Explorez',
    step2Description: "Appuyez sur l'onglet Explorer pour en savoir plus sur ce qui est inclus dans cette application de démarrage.",
    step3Title: 'Étape 3 : Nouveau départ',
    step3Description:
      "Quand vous êtes prêt, exécutez npm run reset-project pour obtenir un nouveau répertoire d'application. Cela déplacera l'application actuelle vers app-example.",
    authTitle: 'Authentification',
    authDescription:
      "Votre application inclut maintenant l'authentification Auth0 avec persistance des tokens. Connectez-vous pour accéder aux fonctionnalités protégées et effectuer des appels API authentifiés.",
    apiTitle: 'Appels API Authentifiés',
    apiDescription: 'Une fois authentifié, vous pouvez effectuer des appels API sécurisés avec gestion automatique des tokens.',
    setupTitle: 'Instructions de configuration',
    setupDescription: "Pour configurer Auth0, ajoutez ces variables d'environnement à votre fichier .env :",
  },
  notFound: {
    title: 'Oops !',
    description: "Désolé, la page que vous recherchez n'existe pas.",
    goBack: 'Tableau de bord',
  },
  profileSection: {
    title: 'Profil utilisateur',
    accessToken: "Jeton d'accès",
    noAccessToken: "Pas de jeton d'accès",
    expiresAt: 'Expire le',
    noExpiresAt: "Pas d'information d'expiration",
  },
  purchase: {
    title: 'Achat',
    basicSection: {
      account: 'Compte',
      amount: 'Montant',
      category: 'Catégorie',
      date: 'Date',
      description: 'Note',
    },
    cashflowSection: {
      title: 'Détails des flux de trésorerie',
      cashflow: 'Flux de trésorerie',
      date: 'Date',
      intervalType: "Type d'intervalle",
      frequency: 'Fréquence',
    },
    purchaseTransferSection: {
      purchase: 'Achat',
      transfer: 'Transfert',
    },
    transferSection: {
      accountFrom: 'Compte source',
      accountTo: 'Compte destination',
      amount: 'Montant',
      date: 'Date',
      description: 'Note',
    },
    errors: {
      sameAccount: 'Le compte de destination doit être différent du compte source',
      amountRequired: 'Le montant doit être supérieur à zéro',
      accountRequired: 'Le compte est requis',
      categoryRequired: 'La catégorie est requise pour les transactions non-transfert',
    },
  },
  quickActions: {
    helpTitle: 'Attendez ! Ne me supprimez pas !',
    helpSubtitle: 'Nous sommes là pour vous aider',
    purchaseTitle: 'Acheter',
  },
  settings: {
    title: 'Paramètres',
    parameters: 'Paramètres',
  },
  tabs: {
    dashboard: 'Tableau de bord',
    accounts: 'Comptes',
    settings: 'Configuration',
    test: 'Examen',
  },
  tagList: {
    placeHolder: 'Filtrer les étiquettes…',
  },
  testSection: {
    title: 'Test',
    notFoundPage: 'Page non trouvée',
    goTo: 'Aller à',
    component: 'Composant',
  },
  themeSwitcher: {
    system: 'Automatique',
    light: 'Clair',
    dark: 'Sombre',
  },
} as const;
