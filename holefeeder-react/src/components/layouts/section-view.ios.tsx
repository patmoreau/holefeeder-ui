import React from 'react';
import { StyleSheet } from 'react-native';

interface SectionViewProps {
  title: string;
  children: React.ReactNode;
}

export function SectionView({ title, children }: SectionViewProps) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <div style={styles.sectionContent}>{children}</div>
    </section>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
    padding: 24,
    backgroundColor: 'var(--surface)',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: 'var(--text)',
  },
  sectionContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
});
