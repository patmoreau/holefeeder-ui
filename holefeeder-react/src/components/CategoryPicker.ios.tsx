import { Picker } from '@expo/ui/swift-ui';
import { Category } from '@/core/category';
import { LoadingIndicator } from './ui/LoadingIndicator';

type Props = {
  categories: Category[] | null;
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
};

export function CategoryPicker({ categories, selectedCategory, onSelectCategory }: Props) {
  if (!categories) {
    return <LoadingIndicator size="small" />;
  }

  return (
    <Picker
      options={categories.map((category) => category.name)}
      selectedIndex={categories.findIndex((category) => category.id === selectedCategory?.id)}
      onOptionSelected={({ nativeEvent: { index } }) => {
        onSelectCategory(categories[index]);
      }}
      variant="menu"
    />
  );
}
