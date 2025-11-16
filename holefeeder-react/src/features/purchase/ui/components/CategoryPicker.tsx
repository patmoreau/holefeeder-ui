import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Platform, View } from 'react-native';
import { Category } from '@/features/purchase/core/category';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { useStyles } from '@/shared/hooks/theme/use-styles';
import { Theme } from '@/types/theme/theme';

type Props = {
  categories: Category[] | null;
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
};

const createStyles = (theme: Theme) => ({
  picker: {
    ...theme.styles.components.picker,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.separator,
  },
  pickerItem: {
    ...theme.styles.components.pickerItem,
    ...Platform.select({
      web: {
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      },
      default: {},
    }),
  },
});

export function CategoryPicker({ categories, selectedCategory, onSelectCategory }: Props) {
  const styles = useStyles(createStyles);

  if (!categories) {
    return <LoadingIndicator size="small" />;
  }

  return (
    <View
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      <Picker
        style={styles.picker}
        selectedValue={selectedCategory?.id}
        onValueChange={(itemValue: string | number) => {
          const selected = categories.find((cat) => cat.id === itemValue);
          if (selected) {
            onSelectCategory(selected);
          }
        }}
      >
        {categories.map((category) => (
          <Picker.Item key={category.id} label={category.name} value={category.id} style={styles.pickerItem} />
        ))}
      </Picker>
    </View>
  );
}
