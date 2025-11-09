import { Picker } from '@expo/ui/swift-ui';
import { DateIntervalType } from '@/features/purchase/core/date-interval-type';
import { useLanguage } from '@/shared/hooks/use-language';

type Props = {
  selectedDateIntervalType: DateIntervalType | null;
  onSelectDateIntervalType: (dateIntervalType: DateIntervalType) => void;
};

export function DateIntervalTypePicker({ selectedDateIntervalType, onSelectDateIntervalType }: Props) {
  const { t } = useLanguage();
  const types = Object.values(DateIntervalType) as DateIntervalType[];

  const selectedIndex = selectedDateIntervalType ? types.indexOf(selectedDateIntervalType) : 0;
  return (
    <Picker
      options={types.map((type) => t(`dateIntervalTypePicker.${type}`))}
      selectedIndex={selectedIndex}
      onOptionSelected={({ nativeEvent: { index } }) => {
        onSelectDateIntervalType(types[index]);
      }}
      variant="menu"
    />
  );
}
