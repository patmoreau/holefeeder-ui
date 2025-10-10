import { router } from 'expo-router';
import { View, Button, Text } from 'react-native';

export default function PurchaseScreen() {
  const handleCancel = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleSave = async () => {
    try {
      // Save purchase logic
      await savePurchase();

      // Navigate to home after successful save
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push('/');
      }
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
