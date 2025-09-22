import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLanguage } from '@/contexts';
import { AuthButton } from '@/components';
import { Button, Form, Host, Section, Text, VStack } from '@expo/ui/swift-ui';

export default function LoginScreen() {
  const { t } = useLanguage();

  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={12} alignment={'center'}>
        <Text size={32}>{t('auth.loginTitle')}</Text>
        <Text size={16}>{t('auth.loginSubtitle')}</Text>
        <AuthButton />
      </VStack>
    </Host>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    alignContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
