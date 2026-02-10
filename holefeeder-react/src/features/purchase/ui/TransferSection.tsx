import * as Haptics from 'expo-haptics';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';
import { PurchaseFormError, usePurchaseForm } from '@/features/purchase/core/use-purchase-form';
import { AccountField } from '@/features/purchase/ui/components/fields/AccountField';
import { DescriptionField } from '@/features/purchase/ui/components/fields/DescriptionField';
import { AppSection } from '@/features/shared/ui/AppSection';
import { DateField } from '@/features/shared/ui/fields/DateField';
import { tk } from '@/i18n/translations';
import { fontSize, spacing } from '@/types/theme/design-tokens';
import { Account } from '@/use-cases/core/accounts/account';

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
  const { formData, updateFormField, errors, clearErrors } = usePurchaseForm();

  const updateSourceAccount = (account: Account) => {
    updateFormField('sourceAccount', account);
    if (errors.targetAccount) {
      clearErrors('targetAccount');
    }
  };

  const updateTargetAccount = (account: Account) => {
    updateFormField('targetAccount', account);
    if (account.id === formData.sourceAccount?.id) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).then();
    }
  };

  const updateDescription = (value: string) => updateFormField('description', value);

  const accountToErrorKey = errors.targetAccount as PurchaseFormError;

  return (
    <AppSection>
      <DateField
        label={t(tk.purchase.transferSection.date)}
        selectedDate={formData.date}
        onDateSelected={(date) => updateFormField('date', date)}
      />
      <AccountField
        label={t(tk.purchase.transferSection.accountFrom)}
        accounts={accounts}
        selectedAccount={formData.sourceAccount}
        onSelectAccount={updateSourceAccount}
      />
      {/*<VStack>*/}
      <AccountField
        label={t(tk.purchase.transferSection.accountTo)}
        accounts={accounts}
        selectedAccount={formData.targetAccount}
        onSelectAccount={updateTargetAccount}
      />
      {accountToErrorKey && (
        // <Text color={styles.errorText.color} modifiers={[font({ size: styles.errorText.fontSize }), padding({ all: 4 } as const)]}>
        <Text style={styles.errorText}>{t(tkErrors[accountToErrorKey])}</Text>
      )}
      {/*</VStack>*/}
      <DescriptionField description={formData.description} onDescriptionChange={updateDescription} />
    </AppSection>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: '#FF3B30',
    fontSize: fontSize!.sm,
    marginTop: spacing.xs,
    marginLeft: spacing.lg,
    marginBottom: spacing.sm,
  },
});
