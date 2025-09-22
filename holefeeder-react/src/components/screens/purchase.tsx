import { View, Button, Text } from 'react-native';
import { router } from 'expo-router';

export default function PurchaseScreen() {
  const handleCancel = () => {
    router.push('/(tabs)');
  };

  const handleSave = async () => {
    try {
      // Save purchase logic
      await savePurchase();

      // Navigate to home after successful save
      router.push('/(tabs)');
    } catch (error) {
      console.error('Purchase save failed:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Purchase Screen</Text>
      <Button title="Cancel" onPress={handleCancel} />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

async function savePurchase() {
  // Save purchase logic
}
