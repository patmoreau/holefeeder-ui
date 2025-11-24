import { Link } from 'expo-router';
import { AppText } from '@/features/shared/ui/components/AppText';
import { AppView } from '@/features/shared/ui/components/AppView';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  container: {
    ...theme.styles.containers.center,
    backgroundColor: theme.colors.background,
  },
  link: {
    ...theme.styles.text.link,
    marginTop: 15,
    paddingVertical: 15,
  },
});

export default function HelpScreen() {
  const styles = useStyles(createStyles);

  return (
    <AppView style={styles.container}>
      <AppText variant="title">This is a modal</AppText>
      <Link href="/" dismissTo style={styles.link}>
        <AppText variant="link">Go to home screen</AppText>
      </Link>
    </AppView>
  );
}
