import React from 'react';
import { View, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Category } from '@/types';
import { LoadingIndicator } from './ui';
import { useStyles } from '@/hooks';
import { getColor } from '@/utils/style-utils';

type Props = {
  categories: Category[] | null;
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
};

export function CategoryPicker({
  categories,
  selectedCategory,
  onSelectCategory,
}: Props) {
  const styles = useStyles((theme) => ({
    container: {
      position: 'relative',
      width: '100%',
    },
    picker: {
      backgroundColor: getColor(theme, 'systemBackground'),
      borderColor: getColor(theme, 'separator'),
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: Platform.select({ web: 4, default: 8 }),
      minHeight: 40,
      width: '100%',
      ...(Platform.OS === 'web' && {
        appearance: 'none',
        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0.7rem top 50%',
        backgroundSize: '0.65rem auto',
      }),
    },
    pickerItem: Platform.select({
      web: {
        backgroundColor: getColor(theme, 'systemBackground'),
        color: getColor(theme, 'label'),
      },
      default: {},
    }),
  }));

  if (!categories) {
    return <LoadingIndicator size="small" />;
  }

  return (
    <View style={styles.container}>
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
          <Picker.Item
            key={category.id}
            label={category.name}
            value={category.id}
            style={styles.pickerItem}
          />
        ))}
      </Picker>
    </View>
  );
}
