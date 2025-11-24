import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/features/shared/ui/components/AppButton';
import { Field } from '@/features/shared/ui/Field';
import { Section } from '@/features/shared/ui/Section';
import { tk } from '@/i18n/translations';

export const TestSection = () => {
  const { t } = useTranslation();

  return (
    <Section title={t(tk.testSection.title)}>
      <Field label={t(tk.testSection.notFoundPage)} icon={'exclamationmark.triangle'}>
        <AppButton
          label={t(tk.testSection.goTo)}
          variant={'link'}
          onPress={() => {
            // @ts-ignore
            router.push({ pathname: '/+not-found' });
          }}
        />
      </Field>
    </Section>
  );
};
