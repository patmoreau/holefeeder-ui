import React from 'react';
import { StyleSheet } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { useAppContext, useLanguage } from '@/contexts';
import {
  HStack,
  Section,
  VStack,
  Text,
  LabeledContent,
  Spacer,
} from '@expo/ui/swift-ui';
import {
  cornerRadius,
  foregroundStyle,
  frame,
  padding,
} from '@expo/ui/swift-ui/modifiers';
import { AuthButton } from '@/components/auth-button';
import { useAuth } from '@/hooks/use-auth';

export function ProfileSection() {
  const { profile } = useAppContext();
  const { tokenInfo } = useAuth();
  const { t } = useLanguage();

  const avatarUri =
    profile.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || profile.email || 'User')}&size=120&background=007AFF&color=fff`;

  return (
    <>
      <Section title={t('profile-section.title')}>
        <VStack spacing={16} alignment={'center'}>
          <HStack spacing={16}>
            <HStack
              modifiers={[
                frame({ width: 120, height: 120 }),
                cornerRadius(100),
              ]}
            >
              <ExpoImage
                source={{ uri: avatarUri }}
                style={styles.avatar}
                contentFit="cover"
              />
            </HStack>

            <VStack
              alignment="leading"
              modifiers={[padding({ top: 16, bottom: 16 })]}
            >
              <Text size={18} weight="bold">
                {profile.name}
              </Text>
              <Text modifiers={[foregroundStyle('gray')]}>{profile.email}</Text>
              <Spacer />
              <AuthButton />
            </VStack>
          </HStack>
          <LabeledContent label={t('profile-section.access-token')}>
            <Text>
              {tokenInfo.accessToken ?? t('profile-section.no-access-token')}
            </Text>
          </LabeledContent>
          <LabeledContent label={t('profile-section.expires-at')}>
            <Text>
              {tokenInfo.expiresAt ?? t('profile-section.no-expires-at')}
            </Text>
          </LabeledContent>
        </VStack>
      </Section>
    </>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
});
