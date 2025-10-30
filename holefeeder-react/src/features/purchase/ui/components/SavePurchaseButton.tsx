import { MaterialIcons } from '@expo/vector-icons';
import * as React from 'react';
import { Pressable } from 'react-native';

type SavePurchaseButtonProps = {
  onSave: () => void | Promise<void>;
};

export function SavePurchaseButton({ onSave }: SavePurchaseButtonProps) {
  return (
    <Pressable style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }} onPress={onSave}>
      <MaterialIcons name="add-circle" size={24} color="currentColor" />
    </Pressable>
  );
}
