import { Link } from 'expo-router';
import { ThemedText } from '@/features/shared/ui/components/ThemedText';
import { ThemedView } from '@/features/shared/ui/components/ThemedView';
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
    <ThemedView style={styles.container}>
      <ThemedText variant="title">This is a modal</ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText variant="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}
