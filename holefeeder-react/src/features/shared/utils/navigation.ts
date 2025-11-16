import { router } from 'expo-router';

export const goBack = () => {
  if (router.canGoBack()) {
    console.debug('going back');
    router.back();
  } else {
    console.debug('going home');
    router.navigate('/');
  }
};
