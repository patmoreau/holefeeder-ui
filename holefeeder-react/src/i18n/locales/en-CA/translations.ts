const en = {
  alert: {
    discard: {
      title: 'Discard changes?',
      message: 'You have unsaved changes. Do you want to discard them and go back?',
      confirmText: 'Discard',
      cancelText: 'Stay',
    },
  },
  auth: {
    loginTitle: 'Welcome',
    loginSubtitle: 'Please login to continue',
    loginButton: 'Login',
    logoutButton: 'Logout',
    loggingIn: 'Logging in...',
    loginError: 'Login Error',
    loginErrorMessage: 'Failed to login. Please try again.',
    logoutSuccess: 'Logged out successfully',
  },
  common: {
    welcome: 'Welcome',
    login: 'Login',
    logout: 'Logout',
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    done: 'Done',
  },
  displaySection: {
    title: 'Display',
    language: 'Language',
    theme: 'Theme',
  },
  errors: {
    noInternetConnection: {
      title: 'No internet connection',
      message: 'It looks like you are offline. Please check your internet connection and try again.',
    },
    cannotReachServer: {
      title: 'Cannot reach the server',
      message: 'We are unable to reach the backend right now. Please try again in a moment.',
    },
  },
  errorSheet: {
    retry: 'Retry',
    dismiss: 'Dismiss',
  },
  home: {
    title: 'Welcome Home!',
    step1Title: 'Step 1: Try it',
    step1Description: 'Edit app/(tabs)/index.tsx to see changes. Press {{shortcut}} to open developer tools.',
    step2Title: 'Step 2: Explore',
    step2Description: "Tap the Explore tab to learn more about what's included in this starter app.",
    step3Title: 'Step 3: Get a fresh start',
    step3Description:
      "When you're ready, run npm run reset-project to get a fresh app directory. This will move the current app to app-example.",
    authTitle: 'Authentication',
    authDescription:
      'Your app now includes Auth0 authentication with token persistence. Login to access protected features and make authenticated API calls.',
    apiTitle: 'Authenticated API Calls',
    apiDescription: 'Once authenticated, you can make secure API calls with automatic token management.',
    setupTitle: 'Setup Instructions',
    setupDescription: 'To configure Auth0, add these environment variables to your .env file:',
  },
  'not-found': {
    title: 'Oops!',
    description: 'Sorry, the page you are looking for does not exist.',
    'go-back': 'Dashboard',
  },
  'profile-section': {
    title: 'User Profile',
    'access-token': 'Access Token',
    'no-access-token': 'No Access Token',
    'expires-at': 'Expires At',
    'no-expires-at': 'No Expiry Information',
  },
  purchase: {
    title: 'Purchase',
    basicSection: {
      title: 'Basic Section',
      account: 'Account',
      category: 'Category',
      date: 'Date',
      amount: 'Amount',
    },
    'details-section': {
      title: 'Additional details',
    },
  },
  'quick-actions': {
    'help-title': "Wait! Don't delete me!",
    'help-subtitle': "We're here to help",
    'purchase-title': 'Purchase',
  },
  settings: {
    title: 'Settings',
    parameters: 'Parameters',
  },
  tabs: {
    dashboard: 'Dashboard',
    accounts: 'Accounts',
    settings: 'Settings',
    test: 'Test',
  },
  'test-section': {
    title: 'Test',
    'not-found-page': 'Page not found',
    'go-to': 'Go to',
    component: 'Component',
  },
  'theme-switcher': {
    system: 'Automatic',
    light: 'Light',
    dark: 'Dark',
  },
} as const;

export default en;
