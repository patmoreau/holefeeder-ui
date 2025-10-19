import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { View } from 'react-native';
import { Category } from '@/features/purchase/core/category';
import { LoadingIndicator } from '@/features/shared/ui/components/LoadingIndicator';
import { useTextStyles } from '@/shared/hooks/theme/use-styles';

type Props = {
  categories: Category[] | null;
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
};

export function CategoryPicker({ categories, selectedCategory, onSelectCategory }: Props) {
  const textStyles = useTextStyles();

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
        style={textStyles.picker}
        selectedValue={selectedCategory?.id}
        onValueChange={(itemValue: string | number) => {
          const selected = categories.find((cat) => cat.id === itemValue);
          if (selected) {
            onSelectCategory(selected);
          }
        }}
      >
        {categories.map((category) => (
          <Picker.Item key={category.id} label={category.name} value={category.id} style={textStyles.pickerItem} />
        ))}
      </Picker>
    </View>
  );
}
