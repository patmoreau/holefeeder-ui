import { LabeledContent, Text, TextField, VStack } from '@expo/ui/swift-ui';
import { font, padding } from '@expo/ui/swift-ui/modifiers';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Account } from '@/features/purchase/core/account';
import { PurchaseFormError, usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { AccountPicker } from '@/features/purchase/ui/components/AccountPicker';
import { DatePicker } from '@/features/purchase/ui/components/DatePicker';
import { AmountTextField } from '@/features/purchase/ui/components/fields/AmountTextField';
import { tk } from '@/i18n/translations';

const tkErrors: Record<PurchaseFormError, string> = {
  [PurchaseFormError.accountRequired]: tk.purchase.errors.accountRequired,
  [PurchaseFormError.amountRequired]: tk.purchase.errors.amountRequired,
  [PurchaseFormError.categoryRequired]: tk.purchase.errors.categoryRequired,
  [PurchaseFormError.sameAccount]: tk.purchase.errors.sameAccount,
};

type Props = {
  accounts: Account[];
};

export const TransferSection = ({ accounts }: Props) => {
  const { t } = useTranslation();
  const { formData, updateFormField, getFieldError, clearError } = usePurchaseForm();

  const updateSourceAccount = (account: Account) => {
    updateFormField('sourceAccount', account);
    if (getFieldError('targetAccount')) {
      clearError('targetAccount');
    }
  };

  const updateTargetAccount = (account: Account) => {
    updateFormField('targetAccount', account);
    if (account.id === formData.sourceAccount?.id) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).then();
    }
  };

  const updateDescription = (value: string) => updateFormField('description', value);

  const accountToErrorKey = getFieldError('targetAccount') as PurchaseFormError;

  return (
    <>
      <LabeledContent label={t(tk.purchase.transferSection.amount)}>
        <AmountTextField initialAmount={formData.amount} onAmountChange={(amount) => updateFormField('amount', amount)} />
      </LabeledContent>
      <LabeledContent label={t(tk.purchase.transferSection.date)}>
        <DatePicker selectedDate={formData.date} onDateSelected={(date) => updateFormField('date', date)} />
      </LabeledContent>
      <LabeledContent label={t(tk.purchase.transferSection.accountFrom)}>
        <AccountPicker accounts={accounts} selectedAccount={formData.sourceAccount} onSelectAccount={updateSourceAccount} />
      </LabeledContent>
      <VStack>
        <LabeledContent label={t(tk.purchase.transferSection.accountTo)}>
          <AccountPicker accounts={accounts} selectedAccount={formData.targetAccount} onSelectAccount={updateTargetAccount} />
        </LabeledContent>
        {accountToErrorKey && (
          <Text color={styles.errorText.color} modifiers={[font({ size: styles.errorText.fontSize }), padding({ all: 4 } as const)]}>
            {t(tkErrors[accountToErrorKey])}
          </Text>
        )}
      </VStack>
      <TextField
        placeholder={t(tk.purchase.transferSection.description)}
        defaultValue={formData.description}
        onChangeText={updateDescription}
      />
    </>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 16,
    marginBottom: 8,
  },
});
