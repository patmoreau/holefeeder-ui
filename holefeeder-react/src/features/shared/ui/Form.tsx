import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAvoidingView, Platform, ScrollView, type ScrollViewProps } from 'react-native';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme/theme';

const createStyles = (theme: Theme) => ({
  form: {
    section: {
      flex: 1,
      flexDirection: 'row' as const,
    },
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export const Form = ({ style, ...otherProps }: ScrollViewProps) => {
  const styles = useStyles(createStyles);
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        style={styles.form}
        contentContainerStyle={[{ paddingTop: headerHeight }, style]}
        keyboardShouldPersistTaps="handled"
        {...otherProps}
      />
    </KeyboardAvoidingView>
  );
};
