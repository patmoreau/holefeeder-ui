import { Purchase } from '@/features/purchase/core/purchase';
import { createFormDataContext } from '@/features/shared/core/use-form-context';

export const { FormDataProvider: PurchaseFormProvider, useFormDataContext: usePurchaseForm } = createFormDataContext<Purchase>('Purchase');
