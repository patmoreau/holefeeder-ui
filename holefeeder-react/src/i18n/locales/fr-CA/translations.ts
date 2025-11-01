const fr = {
  alert: {
    discard: {
      title: 'Annuler les modifications ?',
      message: 'Vous avez des modifications non enregistrées. Voulez-vous les annuler et revenir en arrière ?',
      confirmText: 'Annuler',
      cancelText: 'Rester',
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
  'display-section': {
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
  'not-found': {
    title: 'Oops !',
    description: "Désolé, la page que vous recherchez n'existe pas.",
    'go-back': 'Tableau de bord',
  },
  'profile-section': {
    title: 'Profil utilisateur',
    'access-token': "Jeton d'accès",
    'no-access-token': "Pas de jeton d'accès",
    'expires-at': 'Expire le',
    'no-expires-at': "Pas d'information d'expiration",
  },
  purchase: {
    title: 'Achat',
    basicSection: {
      title: 'Section de base',
      account: 'Compte',
      category: 'Catégorie',
      date: 'Date',
      amount: 'Montant',
    },
    detailsSection: {
      title: 'Détails supplémentaires',
      description: 'Note',
    },
  },
  'quick-actions': {
    'help-title': 'Attendez ! Ne me supprimez pas !',
    'help-subtitle': 'Nous sommes là pour vous aider',
    'purchase-title': 'Acheter',
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
  'test-section': {
    title: 'Test',
    'not-found-page': 'Page non trouvée',
    'go-to': 'Aller à',
    component: 'Composant',
  },
  'theme-switcher': {
    system: 'Automatique',
    light: 'Clair',
    dark: 'Sombre',
  },
} as const;

export default fr;
