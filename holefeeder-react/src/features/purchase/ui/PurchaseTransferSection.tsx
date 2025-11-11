import { Picker } from '@expo/ui/swift-ui';
import { useTranslation } from 'react-i18next';
import { usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { tk } from '@/i18n/translations';

export const PurchaseTransferSection = () => {
  const { t } = useTranslation();
  const { formData, updateFormField } = usePurchaseForm();

  return (
    <Picker
      options={[t(tk.purchase.purchaseTransferSection.purchase), t(tk.purchase.purchaseTransferSection.transfer)]}
      variant="segmented"
      selectedIndex={formData.transfer ? 1 : 0}
      onOptionSelected={({ nativeEvent: { index } }) => {
        updateFormField('transfer', index === 1);
      }}
    />
  );
};
