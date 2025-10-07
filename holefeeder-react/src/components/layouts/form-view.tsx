import React from 'react';
import { StyleSheet } from 'react-native';

interface FormViewProps {
  children: React.ReactNode;
}

export function FormView({ children }: FormViewProps) {
  return <div style={styles.formContainer}>{children}</div>;
}

const styles = StyleSheet.create({
  formContainer: {
    maxWidth: 800,
    margin: '0 auto',
    padding: '24px',
    backgroundColor: 'var(--background)',
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
});
