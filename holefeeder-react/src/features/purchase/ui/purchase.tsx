import { Form, Host } from '@expo/ui/swift-ui';
import { router } from 'expo-router';
import React from 'react';
import { BasicSection } from '@/features/purchase/ui/basic-section';
import { useStyles, useViewStyles } from '@/shared/hooks/theme/use-styles';

export default function PurchaseScreen() {
  const containerStyles = useViewStyles();

  const styles = useStyles((theme, global) => ({
    content: {
      width: '80%',
      maxWidth: 300,
      ...global.column,
      ...global.roundedLg,
      ...global.p24,
      ...global.alignCenter,
    },
  }));

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
      console.error('purchase save failed:', error);
    }
  };

  return (
    // <View style={styles.content}>
    <Host matchContents={{ vertical: true }} style={{ flex: 1 }}>
      <Form>
        <BasicSection />
      </Form>
    </Host>
    // </View>
  );
}

async function savePurchase() {
  // Save purchase logic
}
