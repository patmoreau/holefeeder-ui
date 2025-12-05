import React from 'react';
import { Text, View } from 'react-native';
import { CardHeaderScrollView } from '@/features/shared/ui/CardHeaderScrollView';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  largeTitle: {
    fontSize: 34,
    fontWeight: 'bold' as const,
    color: theme.colors.primaryText,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.secondaryText,
    opacity: 0.8,
  },
  smallTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: theme.colors.primaryText,
  },
  contentCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 8,
    color: '#333',
  },
  contentText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

const DashboardScreen = () => {
  const { theme } = useTheme();
  const styles = useStyles(createStyles);

  return (
    <CardHeaderScrollView
      headerBackgroundColor={theme.colors.primary}
      largeCard={
        <>
          <Text style={styles.largeTitle}>Bonjour Patrick!</Text>
          <Text style={styles.subtitle}>Welcome back</Text>
        </>
      }
      smallCard={<Text style={styles.smallTitle}>Patrick</Text>}
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <View key={i} style={styles.contentCard}>
          <Text style={styles.contentTitle}>Item {i + 1}</Text>
          <Text style={styles.contentText}>This is some content that you can scroll through to see the header morph animation.</Text>
        </View>
      ))}
    </CardHeaderScrollView>
  );
};

export default DashboardScreen;
