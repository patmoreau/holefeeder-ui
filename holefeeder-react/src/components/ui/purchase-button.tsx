import * as React from 'react';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function PurchaseButton() {
  return (
    <Pressable
      style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}
      onPress={() => router.push('/(app)/purchase')}
    >
      <MaterialIcons name="add-shopping-cart" size={24} color="currentColor" />
    </Pressable>
  );
}
