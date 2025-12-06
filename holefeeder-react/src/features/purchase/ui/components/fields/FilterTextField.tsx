import { Pressable, TextInput, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { AppIcons } from '@/types/icons';

type FilterTextFieldProps = {
  filter: string;
  setFilter: (filter: string) => void;
  onSubmit: () => void;
  placeholder: string;
};

const useComponentStyles = () =>
  useStyles((theme) => ({
    container: {
      width: '100%',
      flexDirection: 'column',
    },
    input: {
      flex: 1,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginBottom: 8,
    },
    icon: {
      color: theme.colors.primary,
    },
  }));

export const FilterTextField = ({ filter, setFilter, onSubmit, placeholder }: FilterTextFieldProps) => {
  const styles = useComponentStyles();

  return (
    <View style={styles.container}>
      <TextInput value={filter} onChangeText={setFilter} placeholder={placeholder} style={styles.input} />
      <Pressable accessibilityRole="button" onPress={onSubmit}>
        <IconSymbol name={AppIcons.add} color={styles.icon.color} />
      </Pressable>
    </View>
  );
};
