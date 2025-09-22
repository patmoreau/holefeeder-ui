import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '@/components';
import { type NativeSectionProps } from './native-section.types';

export default function NativeSection({
  children,
  title,
  ...rest
}: NativeSectionProps) {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.infoSection}>
        <ThemedText
          testID="section-title"
          type="subtitle"
          style={styles.sectionTitle}
        >
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
