import { HStack, Section, VStack, Text, LabeledContent, Spacer } from '@expo/ui/swift-ui';
import { cornerRadius, foregroundStyle, frame, padding } from '@expo/ui/swift-ui/modifiers';
import { Image as ExpoImage } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useAppContext } from '@/contexts/AppContext';
import { AuthButton } from '@/features/shared/ui/components/AuthButton';
import { tk } from '@/i18n/translations';
import { useAuth } from '@/shared/hooks/use-auth';

export function ProfileSection() {
  const { profile } = useAppContext();
  const { tokenInfo } = useAuth();
  const { t } = useTranslation();

  const avatarUri =
    profile.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || profile.email || 'User')}&size=120&background=007AFF&color=fff`;

  return (
    <>
      <Section title={t(tk.profileSection.title)}>
        <VStack spacing={16} alignment={'center'}>
          <HStack spacing={16}>
            <HStack modifiers={[frame({ width: 120, height: 120 }), cornerRadius(100)]}>
              <ExpoImage source={{ uri: avatarUri }} style={styles.avatar} contentFit="cover" />
            </HStack>

            <VStack alignment="leading" modifiers={[padding({ top: 16, bottom: 16 })]}>
              <Text size={18} weight="bold">
                {profile.name}
              </Text>
              <Text modifiers={[foregroundStyle('gray')]}>{profile.email}</Text>
              <Spacer />
              <AuthButton />
            </VStack>
          </HStack>
          <LabeledContent label={t(tk.profileSection.accessToken)}>
            <Text>{tokenInfo.accessToken ? `${tokenInfo.accessToken?.substring(0, 20)}...` : t(tk.profileSection.noAccessToken)}</Text>
          </LabeledContent>
          <LabeledContent label={t(tk.profileSection.expiresAt)}>
            <Text>{tokenInfo.expiresAt ?? t(tk.profileSection.noExpiresAt)}</Text>
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
