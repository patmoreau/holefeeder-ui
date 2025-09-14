import React, { type PropsWithChildren } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '@/components';

type Props = PropsWithChildren<{
  title: string;
}>;

export default function NativeSection({ children, title }: Props) {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.infoSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {title}
        </ThemedText>
        {children}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  infoSection: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 16,
  },
});
