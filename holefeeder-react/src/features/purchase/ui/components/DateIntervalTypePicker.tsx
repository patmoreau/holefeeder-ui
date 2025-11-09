import { Picker } from '@expo/ui/swift-ui';
import { useTranslation } from 'react-i18next';
import { DateIntervalType } from '@/features/purchase/core/date-interval-type';
import { tk } from '@/i18n/translations';

const tkTypes: Record<DateIntervalType, string> = {
  [DateIntervalType.weekly]: tk.dateIntervalTypePicker.weekly,
  [DateIntervalType.monthly]: tk.dateIntervalTypePicker.monthly,
  [DateIntervalType.yearly]: tk.dateIntervalTypePicker.yearly,
  [DateIntervalType.oneTime]: tk.dateIntervalTypePicker.oneTime,
};

type Props = {
  selectedDateIntervalType: DateIntervalType | null;
  onSelectDateIntervalType: (dateIntervalType: DateIntervalType) => void;
};

export function DateIntervalTypePicker({ selectedDateIntervalType, onSelectDateIntervalType }: Props) {
  const { t } = useTranslation();
  const types = Object.values(DateIntervalType) as DateIntervalType[];

  const selectedIndex = selectedDateIntervalType ? types.indexOf(selectedDateIntervalType) : 0;
  return (
    <Picker
      options={types.map((type) => t(tkTypes[type]))}
      selectedIndex={selectedIndex}
      onOptionSelected={({ nativeEvent: { index } }) => {
        onSelectDateIntervalType(types[index]);
      }}
      variant="menu"
    />
  );
}
