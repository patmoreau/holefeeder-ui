import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { PurchaseType } from '@/features/purchase/core/purchase-form-data';
import { Picker, PickerOption } from '@/features/shared/ui/Picker';
import { tk } from '@/i18n/translations';
import { useStyles } from '@/shared/hooks/theme/use-styles';

const tkTypes: Record<PurchaseType, string> = {
  [PurchaseType.expense]: tk.purchase.transactionTypeSection.expense,
  [PurchaseType.gain]: tk.purchase.transactionTypeSection.income,
  [PurchaseType.transfer]: tk.purchase.transactionTypeSection.transfer,
};

type PurchaseTypeTypeOption = PickerOption & {
  value: PurchaseType;
};

type Props = {
  selectedPurchaseType: PurchaseType | null;
  onSelectPurchaseType: (purchaseType: PurchaseType) => void;
};

const createStyles = () => ({
  container: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
  },
});

export const PurchaseTransferSection = ({ selectedPurchaseType, onSelectPurchaseType }: Props) => {
  const { t } = useTranslation();
  const styles = useStyles(createStyles);

  const options = useMemo<PurchaseTypeTypeOption[]>(() => {
    const types = Object.values(PurchaseType) as PurchaseType[];
    return types.map((type) => ({
      id: type,
      value: type,
    }));
  }, []);

  const selectedOption = options.find((opt) => opt.value === selectedPurchaseType) || options[0];

  return (
    <View style={styles.container}>
      <Picker
        variant="segmented"
        options={options}
        selectedOption={selectedOption}
        onSelectOption={(option) => onSelectPurchaseType(option.value)}
        onOptionLabel={(option) => t(tkTypes[option.value])}
      />
    </View>
  );
};
