import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '@/features/shared/ui/components/AppText';
import { AppView } from '@/features/shared/ui/components/AppView';
import { IconSymbol } from '@/features/shared/ui/components/IconSymbol';
import { useTheme } from '@/shared/hooks/theme/use-theme';
import { AppIcons } from '@/types/icons';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <AppView>
      <TouchableOpacity style={styles.heading} onPress={() => setIsOpen((value) => !value)} activeOpacity={0.8}>
        <IconSymbol
          name={AppIcons.expand}
          size={18}
          weight="medium"
          color={theme.colors.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <AppText variant="defaultSemiBold">{title}</AppText>
      </TouchableOpacity>
      {isOpen && <AppView style={styles.content}>{children}</AppView>}
    </AppView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
